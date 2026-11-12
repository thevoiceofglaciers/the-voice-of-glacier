<?php
/**
 * Plugin Name: TVGF Core
 * Description: Schema-driven content for every Next.js page that isn't a post
 *              feed — page text (Home, Story, Our Strategy, Programs, Learn,
 *              Why Glaciers Matter, Collaborate, Glacier Dialogues intro),
 *              list-style collections (Glossary Terms, Quiz Questions, Glacier
 *              Profiles) and site-wide Site Settings (footer, SEO).
 *
 *              Everything is declared in JSON under tvgf-core/schemas/: each
 *              schema lists its fields *and* the site's current text as the
 *              field defaults. The Next.js app imports the very same files for
 *              its fallbacks, so the two sides can't drift apart. Adding a
 *              field is a one-file change here plus using it in the page.
 *
 *              Same conventions as the other TVGF mu-plugins — no ACF, manual
 *              meta boxes, GraphQL exposure, and a revalidation webhook on save —
 *              except values are stored as one JSON blob per page/item (protected
 *              `_tvgf_*` meta) rather than one meta key per field.
 *
 * Install as a must-use plugin: upload this file AND the tvgf-core/ folder
 * next to it into wp-content/mu-plugins/. (WordPress only auto-loads top-level
 * mu-plugin files, so the folder's contents are data, not code that runs.)
 *
 * Requires the same TVGF_NEXTJS_URL / TVGF_REVALIDATE_SECRET constants in
 * wp-config.php as tvgf-glacier-dialogues.php.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'TVGF_CORE_DIR', __DIR__ . '/tvgf-core' );

const TVGF_PAGE_META       = '_tvgf_page_content';
const TVGF_COLLECTION_META = '_tvgf_fields';
const TVGF_SETTINGS_OPTION = 'tvgf_site_settings';

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

function tvgf_core_read_json( $path ) {
	if ( ! is_readable( $path ) ) {
		return null;
	}
	$data = json_decode( file_get_contents( $path ), true );
	return is_array( $data ) ? $data : null;
}

function tvgf_core_schemas( $subdir ) {
	static $cache = [];
	if ( ! isset( $cache[ $subdir ] ) ) {
		$cache[ $subdir ] = [];
		foreach ( glob( TVGF_CORE_DIR . "/schemas/{$subdir}/*.json" ) ?: [] as $file ) {
			$schema = tvgf_core_read_json( $file );
			if ( $schema ) {
				$cache[ $subdir ][] = $schema;
			}
		}
	}
	return $cache[ $subdir ];
}

function tvgf_page_schema( $slug ) {
	if ( ! $slug ) {
		return null;
	}
	foreach ( tvgf_core_schemas( 'pages' ) as $schema ) {
		if ( $schema['slug'] === $slug ) {
			return $schema;
		}
	}
	return null;
}

function tvgf_collection_schema( $post_type ) {
	foreach ( tvgf_core_schemas( 'collections' ) as $schema ) {
		if ( $schema['postType'] === $post_type ) {
			return $schema;
		}
	}
	return null;
}

function tvgf_site_settings_schema() {
	static $schema = false;
	if ( false === $schema ) {
		$schema = tvgf_core_read_json( TVGF_CORE_DIR . '/schemas/site-settings.json' );
	}
	return $schema;
}

/** Every field of a schema, whether it's grouped into `sections` or flat `fields`. */
function tvgf_schema_fields( $schema ) {
	if ( isset( $schema['fields'] ) ) {
		return $schema['fields'];
	}
	$fields = [];
	foreach ( $schema['sections'] ?? [] as $section ) {
		foreach ( $section['fields'] as $field ) {
			$fields[] = $field;
		}
	}
	return $fields;
}

function tvgf_schema_defaults( $fields ) {
	$defaults = [];
	foreach ( $fields as $field ) {
		if ( array_key_exists( 'default', $field ) ) {
			$defaults[ $field['key'] ] = $field['default'];
		}
	}
	return $defaults;
}

function tvgf_field_options( $field ) {
	if ( 'icon' === $field['type'] ) {
		static $icons = null;
		if ( null === $icons ) {
			$icons = tvgf_core_read_json( TVGF_CORE_DIR . '/schemas/icons.json' ) ?: [];
		}
		return $icons;
	}
	return $field['options'] ?? [];
}

// ---------------------------------------------------------------------------
// Sanitizing — by field type, so plain-text fields never pick up HTML and
// HTML fields go through wp_kses_post.
// ---------------------------------------------------------------------------

function tvgf_sanitize_value( $field, $value ) {
	switch ( $field['type'] ) {
		case 'repeater':
			$rows = [];
			foreach ( is_array( $value ) ? $value : [] as $row ) {
				if ( is_array( $row ) ) {
					$rows[] = tvgf_sanitize_values( $field['fields'], tvgf_fill_missing( $field['fields'], $row ) );
				}
			}
			return $rows;

		case 'lines':
			if ( is_array( $value ) ) {
				$value = implode( "\n", $value );
			}
			$lines = preg_split( '/\r\n|\r|\n/', sanitize_textarea_field( (string) $value ) );
			return array_values( array_filter( array_map( 'trim', $lines ), 'strlen' ) );

		case 'html':
			return trim( wp_kses_post( (string) $value ) );

		case 'textarea':
			return trim( sanitize_textarea_field( (string) $value ) );

		case 'url':
		case 'image':
		case 'video':
		case 'file':
			// esc_url_raw keeps relative "/path" and "#anchor" values as-is.
			return esc_url_raw( trim( (string) $value ) );

		case 'number':
			return is_numeric( $value ) ? $value + 0 : null;

		case 'select':
		case 'icon':
			$options = tvgf_field_options( $field );
			return in_array( (string) $value, $options, true ) ? (string) $value : ( $options[0] ?? '' );

		default:
			return trim( sanitize_text_field( (string) $value ) );
	}
}

/**
 * Only keys present in $input are returned — a missing key means "not set",
 * so Next.js falls back to that field's default. The meta box posts every
 * field, so it runs tvgf_fill_missing() first to turn a cleared repeater
 * (which posts nothing at all) into an explicit empty list.
 */
function tvgf_sanitize_values( $fields, $input ) {
	$clean = [];
	foreach ( $fields as $field ) {
		if ( array_key_exists( $field['key'], $input ) ) {
			$clean[ $field['key'] ] = tvgf_sanitize_value( $field, $input[ $field['key'] ] );
		}
	}
	return $clean;
}

function tvgf_fill_missing( $fields, $input ) {
	foreach ( $fields as $field ) {
		if ( ! array_key_exists( $field['key'], $input ) ) {
			$input[ $field['key'] ] = in_array( $field['type'], [ 'repeater', 'lines' ], true ) ? [] : '';
		}
	}
	return $input;
}

function tvgf_encode( $data ) {
	return wp_json_encode( $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
}

/** update_post_meta() unslashes its value, which would strip JSON's escaped quotes. */
function tvgf_save_json_meta( $post_id, $key, $data ) {
	update_post_meta( $post_id, $key, wp_slash( tvgf_encode( $data ) ) );
}

function tvgf_get_json_meta( $post_id, $key ) {
	$data = json_decode( (string) get_post_meta( $post_id, $key, true ), true );
	return is_array( $data ) ? $data : null;
}

// ---------------------------------------------------------------------------
// Field rendering (meta boxes + Site Settings screen)
// ---------------------------------------------------------------------------

function tvgf_render_fields( $fields, $values, $name_prefix ) {
	foreach ( $fields as $field ) {
		$value = array_key_exists( $field['key'], $values ) ? $values[ $field['key'] ] : ( $field['default'] ?? '' );
		tvgf_render_field( $field, "{$name_prefix}[{$field['key']}]", $value );
	}
}

function tvgf_render_field( $field, $name, $value ) {
	$type  = $field['type'];
	$id    = 'tvgf-' . md5( $name );
	$label = $field['label'] ?? $field['key'];
	?>
	<div class="tvgf-field tvgf-field--<?php echo esc_attr( $type ); ?>">
		<?php if ( 'repeater' === $type ) : ?>
			<span class="tvgf-label"><?php echo esc_html( $label ); ?></span>
			<?php tvgf_render_repeater( $field, $name, is_array( $value ) ? $value : [] ); ?>
		<?php else : ?>
			<label class="tvgf-label" for="<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $label ); ?></label>
			<?php
			switch ( $type ) {
				case 'textarea':
				case 'html':
				case 'lines':
					$text = is_array( $value ) ? implode( "\n", $value ) : (string) $value;
					$rows = $field['rows'] ?? ( 'html' === $type ? 5 : 3 );
					printf(
						'<textarea id="%s" name="%s" rows="%d" class="widefat">%s</textarea>',
						esc_attr( $id ),
						esc_attr( $name ),
						(int) $rows,
						esc_textarea( $text )
					);
					break;

				case 'select':
				case 'icon':
					printf( '<select id="%s" name="%s">', esc_attr( $id ), esc_attr( $name ) );
					foreach ( tvgf_field_options( $field ) as $option ) {
						printf( '<option value="%1$s"%2$s>%1$s</option>', esc_attr( $option ), selected( $value, $option, false ) );
					}
					echo '</select>';
					break;

				case 'image':
				case 'video':
				case 'file':
					$library = 'image' === $type ? 'image' : ( 'video' === $type ? 'video' : '' );
					?>
					<span class="tvgf-media">
						<input type="text" id="<?php echo esc_attr( $id ); ?>" name="<?php echo esc_attr( $name ); ?>"
							value="<?php echo esc_attr( $value ); ?>" class="widefat tvgf-media__input">
						<button type="button" class="button" data-tvgf-action="media"
							data-library="<?php echo esc_attr( $library ); ?>">Choose from Media Library</button>
					</span>
					<?php if ( 'image' === $type ) : ?>
						<img class="tvgf-media__preview" src="<?php echo esc_url( $value ); ?>" alt=""
							<?php echo $value ? '' : 'hidden'; ?>>
					<?php endif; ?>
					<?php
					break;

				default:
					printf(
						'<input type="%s" id="%s" name="%s" value="%s" class="widefat">',
						'number' === $type ? 'number' : 'text',
						esc_attr( $id ),
						esc_attr( $name ),
						esc_attr( is_scalar( $value ) ? $value : '' )
					);
			}
			?>
		<?php endif; ?>
		<?php if ( ! empty( $field['help'] ) ) : ?>
			<p class="description"><?php echo wp_kses_post( $field['help'] ); ?></p>
		<?php elseif ( 'lines' === $type ) : ?>
			<p class="description">One item per line.</p>
		<?php elseif ( 'html' === $type ) : ?>
			<p class="description">Basic HTML allowed, e.g. &lt;strong&gt;bold&lt;/strong&gt;, &lt;em&gt;, &lt;a href="…"&gt;.</p>
		<?php endif; ?>
	</div>
	<?php
}

function tvgf_render_repeater( $field, $name, $rows ) {
	$item_label = $field['itemLabel'] ?? 'Item';
	?>
	<div class="tvgf-repeater">
		<div class="tvgf-repeater__rows">
			<?php foreach ( array_values( $rows ) as $i => $row ) : ?>
				<?php tvgf_render_repeater_row( $field, "{$name}[{$i}]", is_array( $row ) ? $row : [], $item_label, false ); ?>
			<?php endforeach; ?>
		</div>
		<template>
			<?php tvgf_render_repeater_row( $field, "{$name}[__i__]", [], $item_label, true ); ?>
		</template>
		<button type="button" class="button" data-tvgf-action="add">+ Add <?php echo esc_html( strtolower( $item_label ) ); ?></button>
	</div>
	<?php
}

function tvgf_render_repeater_row( $field, $name, $row, $item_label, $is_new ) {
	$title_key = $field['titleField'] ?? $field['fields'][0]['key'];
	$title     = $row[ $title_key ] ?? '';
	$title     = is_scalar( $title ) ? wp_strip_all_tags( (string) $title ) : '';
	// Blank rows added from the template start out empty, not pre-filled with defaults.
	$values = $is_new ? array_fill_keys( wp_list_pluck( $field['fields'], 'key' ), '' ) : $row;
	?>
	<details class="tvgf-row"<?php echo $is_new ? ' open' : ''; ?>>
		<summary>
			<span class="tvgf-row__title"><?php echo esc_html( $title ? wp_trim_words( $title, 10 ) : "New {$item_label}" ); ?></span>
			<span class="tvgf-row__actions">
				<button type="button" class="button-link" data-tvgf-action="up" aria-label="Move up">↑</button>
				<button type="button" class="button-link" data-tvgf-action="down" aria-label="Move down">↓</button>
				<button type="button" class="button-link tvgf-row__remove" data-tvgf-action="remove">Remove</button>
			</span>
		</summary>
		<div class="tvgf-row__fields">
			<?php tvgf_render_fields( $field['fields'], $values, $name ); ?>
		</div>
	</details>
	<?php
}

function tvgf_render_sections( $schema, $values, $name_prefix ) {
	if ( isset( $schema['fields'] ) ) {
		tvgf_render_fields( $schema['fields'], $values, $name_prefix );
		return;
	}
	foreach ( $schema['sections'] as $section ) {
		?>
		<details class="tvgf-section" open>
			<summary><?php echo esc_html( $section['title'] ); ?></summary>
			<?php if ( ! empty( $section['description'] ) ) : ?>
				<p class="description"><?php echo wp_kses_post( $section['description'] ); ?></p>
			<?php endif; ?>
			<?php tvgf_render_fields( $section['fields'], $values, $name_prefix ); ?>
		</details>
		<?php
	}
}

add_action( 'admin_enqueue_scripts', function ( $hook ) {
	$screen = get_current_screen();
	$is_tvgf_screen = ( $screen && 'toplevel_page_tvgf-site-settings' === $screen->id )
		|| ( in_array( $hook, [ 'post.php', 'post-new.php' ], true ) && $screen
			&& ( 'page' === $screen->post_type || tvgf_collection_schema( $screen->post_type ) ) );
	if ( ! $is_tvgf_screen ) {
		return;
	}

	wp_enqueue_media();
	$base = WPMU_PLUGIN_URL . '/tvgf-core';
	wp_enqueue_style( 'tvgf-core-admin', "{$base}/admin.css", [], filemtime( TVGF_CORE_DIR . '/admin.css' ) );
	wp_enqueue_script( 'tvgf-core-admin', "{$base}/admin.js", [], filemtime( TVGF_CORE_DIR . '/admin.js' ), true );
} );

// Pages and collection items are edited entirely through these fields, so the
// classic screen (fields front and centre, no empty block canvas) fits better
// than the block editor.
add_filter( 'use_block_editor_for_post', function ( $use, $post ) {
	if ( ( 'page' === $post->post_type && tvgf_page_schema( $post->post_name ) ) || tvgf_collection_schema( $post->post_type ) ) {
		return false;
	}
	return $use;
}, 10, 2 );

add_filter( 'use_block_editor_for_post_type', function ( $use, $post_type ) {
	return tvgf_collection_schema( $post_type ) ? false : $use;
}, 10, 2 );

// ---------------------------------------------------------------------------
// Page content (core Pages matched by slug, e.g. "home", "learn")
// ---------------------------------------------------------------------------

add_action( 'add_meta_boxes_page', function ( $post ) {
	$schema = tvgf_page_schema( $post->post_name );
	if ( ! $schema ) {
		return;
	}
	add_meta_box( 'tvgf_page_content', $schema['title'], 'tvgf_render_page_content_box', 'page', 'normal', 'high', [ 'schema' => $schema ] );
	// These pages carry their own hero fields — don't also show the generic
	// Page Hero box from tvgf-media.php (it stays on e.g. the "media" Page).
	remove_meta_box( 'tvgf_page_hero', 'page', 'normal' );
} );

function tvgf_render_page_content_box( $post, $box ) {
	$schema = $box['args']['schema'];
	$saved  = tvgf_get_json_meta( $post->ID, TVGF_PAGE_META ) ?? [];
	$values = array_merge( tvgf_schema_defaults( tvgf_schema_fields( $schema ) ), $saved );
	$url    = defined( 'TVGF_NEXTJS_URL' ) ? rtrim( TVGF_NEXTJS_URL, '/' ) . $schema['path'] : $schema['path'];

	wp_nonce_field( 'tvgf_save_page_content', 'tvgf_page_content_nonce' );
	?>
	<style>#postdivrich { display: none; }</style>
	<p class="tvgf-intro">
		Everything on <a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener"><?php echo esc_html( $schema['path'] ); ?></a>
		comes from these fields. Click <strong>Update</strong> to publish changes — the live page refreshes within seconds.
		Clearing a field hides it on the site. In headings, wrap a word in *asterisks* to show it in the accent colour.
	</p>
	<?php
	tvgf_render_sections( $schema, $values, 'tvgf' );
}

add_action( 'save_post_page', function ( $post_id, $post ) {
	if ( ! isset( $_POST['tvgf_page_content_nonce'] ) ||
		! wp_verify_nonce( $_POST['tvgf_page_content_nonce'], 'tvgf_save_page_content' ) ) {
		return;
	}
	if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	$schema = tvgf_page_schema( $post->post_name );
	if ( ! $schema ) {
		return;
	}

	$input  = isset( $_POST['tvgf'] ) && is_array( $_POST['tvgf'] ) ? wp_unslash( $_POST['tvgf'] ) : [];
	$fields = tvgf_schema_fields( $schema );
	tvgf_save_json_meta( $post_id, TVGF_PAGE_META, tvgf_sanitize_values( $fields, tvgf_fill_missing( $fields, $input ) ) );
	tvgf_core_revalidate( 'page', $post->post_name );
}, 10, 2 );

// ---------------------------------------------------------------------------
// Collections: one custom post type per schema in tvgf-core/schemas/collections
// ---------------------------------------------------------------------------

add_action( 'init', function () {
	foreach ( tvgf_core_schemas( 'collections' ) as $schema ) {
		register_post_type( $schema['postType'], [
			'labels'              => [
				'name'          => $schema['label'],
				'singular_name' => $schema['singular'],
				'add_new_item'  => 'Add New ' . $schema['singular'],
				'edit_item'     => 'Edit ' . $schema['singular'],
				'all_items'     => 'All ' . $schema['label'],
			],
			'public'              => true,
			'show_in_menu'        => true,
			'menu_icon'           => $schema['menuIcon'] ?? 'dashicons-list-view',
			// page-attributes gives each item an "Order" number for sorting.
			'supports'            => [ 'title', 'page-attributes' ],
			'has_archive'         => false,
			'rewrite'             => false,
			'show_in_rest'        => true,
			'show_in_graphql'     => true,
			'graphql_single_name' => $schema['graphqlSingle'],
			'graphql_plural_name' => $schema['graphqlPlural'],
		] );
	}
} );

add_filter( 'enter_title_here', function ( $placeholder, $post ) {
	$schema = tvgf_collection_schema( $post->post_type );
	return $schema['titleLabel'] ?? $placeholder;
}, 10, 2 );

add_action( 'add_meta_boxes', function ( $post_type ) {
	$schema = tvgf_collection_schema( $post_type );
	if ( $schema ) {
		add_meta_box( 'tvgf_collection_fields', $schema['singular'] . ' Details', 'tvgf_render_collection_box', $post_type, 'normal', 'high', [ 'schema' => $schema ] );
	}
} );

function tvgf_render_collection_box( $post, $box ) {
	$schema = $box['args']['schema'];
	$values = tvgf_get_json_meta( $post->ID, TVGF_COLLECTION_META ) ?? [];
	$url    = defined( 'TVGF_NEXTJS_URL' ) ? rtrim( TVGF_NEXTJS_URL, '/' ) . $schema['path'] : $schema['path'];

	wp_nonce_field( 'tvgf_save_collection_fields', 'tvgf_collection_nonce' );
	?>
	<p class="tvgf-intro">
		Shown on <a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener"><?php echo esc_html( $schema['path'] ); ?></a>.
		<?php echo wp_kses_post( $schema['description'] ?? '' ); ?>
	</p>
	<?php
	tvgf_render_fields( $schema['fields'], $values, 'tvgf' );
}

add_action( 'save_post', function ( $post_id, $post ) {
	$schema = tvgf_collection_schema( $post->post_type );
	if ( ! $schema ) {
		return;
	}
	// Fires for every save (REST, quick edit, the meta box) — refresh the list
	// on the site either way, but only the meta box submits field values.
	if ( isset( $_POST['tvgf_collection_nonce'] ) &&
		wp_verify_nonce( $_POST['tvgf_collection_nonce'], 'tvgf_save_collection_fields' ) &&
		! ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) &&
		current_user_can( 'edit_post', $post_id ) ) {
		$input = isset( $_POST['tvgf'] ) && is_array( $_POST['tvgf'] ) ? wp_unslash( $_POST['tvgf'] ) : [];
		tvgf_save_json_meta( $post_id, TVGF_COLLECTION_META, tvgf_sanitize_values( $schema['fields'], tvgf_fill_missing( $schema['fields'], $input ) ) );
	}
	if ( 'publish' === $post->post_status ) {
		tvgf_core_revalidate( 'collection', $post->post_type );
	}
}, 20, 2 );

// Scheduled items going live, and items being unpublished or trashed.
add_action( 'transition_post_status', function ( $new_status, $old_status, $post ) {
	if ( $new_status !== $old_status && 'publish' === $old_status && tvgf_collection_schema( $post->post_type ) ) {
		tvgf_core_revalidate( 'collection', $post->post_type );
	}
}, 10, 3 );

// Admin lists sorted the way the site shows them.
add_action( 'pre_get_posts', function ( $query ) {
	if ( ! is_admin() || ! $query->is_main_query() || $query->get( 'orderby' ) ) {
		return;
	}
	$schema = tvgf_collection_schema( $query->get( 'post_type' ) );
	if ( $schema ) {
		$query->set( 'orderby', 'TITLE' === ( $schema['orderBy'] ?? '' ) ? 'title' : [ 'menu_order' => 'ASC', 'title' => 'ASC' ] );
		$query->set( 'order', 'ASC' );
	}
} );

// The glossary has more than WPGraphQL's default 100-item page size.
add_filter( 'graphql_connection_max_query_amount', function ( $max ) {
	return max( $max, 500 );
} );

// ---------------------------------------------------------------------------
// Site Settings (footer, social links, default SEO) — a wp-admin screen
// ---------------------------------------------------------------------------

add_action( 'admin_menu', function () {
	add_menu_page( 'Site Settings', 'Site Settings', 'edit_pages', 'tvgf-site-settings', 'tvgf_render_site_settings_page', 'dashicons-admin-site-alt3', 61 );
} );

function tvgf_get_site_settings() {
	$data = json_decode( (string) get_option( TVGF_SETTINGS_OPTION, '' ), true );
	return is_array( $data ) ? $data : null;
}

function tvgf_render_site_settings_page() {
	$schema = tvgf_site_settings_schema();
	if ( ! $schema ) {
		echo '<div class="wrap"><p>tvgf-core/schemas/site-settings.json is missing.</p></div>';
		return;
	}
	$values = array_merge( tvgf_schema_defaults( tvgf_schema_fields( $schema ) ), tvgf_get_site_settings() ?? [] );
	?>
	<div class="wrap tvgf-settings">
		<h1>Site Settings</h1>
		<?php if ( isset( $_GET['updated'] ) ) : ?>
			<div class="notice notice-success is-dismissible"><p>Saved — the site refreshes within seconds.</p></div>
		<?php endif; ?>
		<p class="tvgf-intro">Shown on every page of the website (footer, social links, search-engine defaults).</p>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="tvgf_save_site_settings">
			<?php wp_nonce_field( 'tvgf_save_site_settings', 'tvgf_site_settings_nonce' ); ?>
			<?php tvgf_render_sections( $schema, $values, 'tvgf' ); ?>
			<?php submit_button( 'Save Settings' ); ?>
		</form>
	</div>
	<?php
}

add_action( 'admin_post_tvgf_save_site_settings', function () {
	if ( ! current_user_can( 'edit_pages' ) ||
		! isset( $_POST['tvgf_site_settings_nonce'] ) ||
		! wp_verify_nonce( $_POST['tvgf_site_settings_nonce'], 'tvgf_save_site_settings' ) ) {
		wp_die( 'Not allowed.' );
	}
	$fields = tvgf_schema_fields( tvgf_site_settings_schema() );
	$input  = isset( $_POST['tvgf'] ) && is_array( $_POST['tvgf'] ) ? wp_unslash( $_POST['tvgf'] ) : [];
	update_option( TVGF_SETTINGS_OPTION, tvgf_encode( tvgf_sanitize_values( $fields, tvgf_fill_missing( $fields, $input ) ) ) );
	tvgf_core_revalidate( 'settings' );

	wp_safe_redirect( admin_url( 'admin.php?page=tvgf-site-settings&updated=1' ) );
	exit;
} );

// ---------------------------------------------------------------------------
// GraphQL: each blob is exposed as a JSON string; Next.js parses it and merges
// it over the same schema's defaults.
// ---------------------------------------------------------------------------

add_action( 'graphql_register_types', function () {
	if ( ! function_exists( 'register_graphql_field' ) ) {
		return;
	}

	register_graphql_field( 'Page', 'pageContent', [
		'type'        => 'String',
		'description' => 'JSON of this page\'s TVGF content fields (see tvgf-core/schemas/pages).',
		'resolve'     => function ( $post ) {
			$value = get_post_meta( $post->ID, TVGF_PAGE_META, true );
			return $value ?: null;
		},
	] );

	foreach ( tvgf_core_schemas( 'collections' ) as $schema ) {
		register_graphql_field( ucfirst( $schema['graphqlSingle'] ), 'tvgfFields', [
			'type'        => 'String',
			'description' => 'JSON of this item\'s fields (see tvgf-core/schemas/collections).',
			'resolve'     => function ( $post ) {
				$value = get_post_meta( $post->ID, TVGF_COLLECTION_META, true );
				return $value ?: null;
			},
		] );
	}

	register_graphql_field( 'RootQuery', 'tvgfSiteSettings', [
		'type'        => 'String',
		'description' => 'JSON of the Site Settings screen (see tvgf-core/schemas/site-settings.json).',
		'resolve'     => function () {
			return get_option( TVGF_SETTINGS_OPTION, '' ) ?: null;
		},
	] );
} );

// ---------------------------------------------------------------------------
// REST routes used by scripts/migrate-site-content.mjs to seed content. They
// run the same schema sanitizing as the admin screens. Existing content is
// left alone unless `overwrite` is true.
// ---------------------------------------------------------------------------

add_action( 'rest_api_init', function () {
	register_rest_route( 'tvgf/v1', '/pages/(?P<slug>[a-z0-9-]+)', [
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'publish_pages' );
		},
		'callback'            => function ( WP_REST_Request $request ) {
			$slug   = $request['slug'];
			$schema = tvgf_page_schema( $slug );
			if ( ! $schema ) {
				return new WP_Error( 'tvgf_unknown_page', "No schema for page '{$slug}'.", [ 'status' => 404 ] );
			}

			$page    = get_page_by_path( $slug, OBJECT, 'page' );
			$created = false;
			if ( ! $page ) {
				$page_id = wp_insert_post( [
					'post_type'   => 'page',
					'post_status' => 'publish',
					'post_title'  => $schema['pageTitle'] ?? $schema['title'],
					'post_name'   => $slug,
				], true );
				if ( is_wp_error( $page_id ) ) {
					return $page_id;
				}
				$page    = get_post( $page_id );
				$created = true;
			}

			if ( ! $request['overwrite'] && tvgf_get_json_meta( $page->ID, TVGF_PAGE_META ) !== null ) {
				return [ 'id' => $page->ID, 'created' => $created, 'skipped' => true ];
			}

			$content = is_array( $request['content'] ) ? $request['content'] : [];
			tvgf_save_json_meta( $page->ID, TVGF_PAGE_META, tvgf_sanitize_values( tvgf_schema_fields( $schema ), $content ) );
			tvgf_core_revalidate( 'page', $slug );
			return [ 'id' => $page->ID, 'created' => $created, 'skipped' => false ];
		},
	] );

	register_rest_route( 'tvgf/v1', '/collections/(?P<type>[a-z_]+)', [
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'publish_posts' );
		},
		'callback'            => function ( WP_REST_Request $request ) {
			$schema = tvgf_collection_schema( $request['type'] );
			if ( ! $schema ) {
				return new WP_Error( 'tvgf_unknown_collection', 'Unknown collection.', [ 'status' => 404 ] );
			}

			$existing = get_posts( [ 'post_type' => $schema['postType'], 'post_status' => 'any', 'numberposts' => -1, 'fields' => 'ids' ] );
			if ( $existing && ! $request['overwrite'] ) {
				return [ 'created' => 0, 'skipped' => true ];
			}

			// One webhook at the end, not one per inserted item.
			$GLOBALS['tvgf_core_suppress_revalidate'] = true;
			// Overwriting replaces the list: old items go to the Trash (restorable), not deleted.
			foreach ( $existing as $old_id ) {
				wp_trash_post( $old_id );
			}
			$created = 0;
			foreach ( (array) $request['items'] as $index => $item ) {
				$post_id = wp_insert_post( [
					'post_type'   => $schema['postType'],
					'post_status' => 'publish',
					'post_title'  => sanitize_text_field( $item['title'] ?? '' ),
					'menu_order'  => (int) ( $item['menuOrder'] ?? $index ),
				], true );
				if ( ! is_wp_error( $post_id ) ) {
					tvgf_save_json_meta( $post_id, TVGF_COLLECTION_META, tvgf_sanitize_values( $schema['fields'], (array) ( $item['fields'] ?? [] ) ) );
					$created++;
				}
			}
			$GLOBALS['tvgf_core_suppress_revalidate'] = false;
			tvgf_core_revalidate( 'collection', $schema['postType'] );
			return [ 'created' => $created, 'skipped' => false ];
		},
	] );

	register_rest_route( 'tvgf/v1', '/site-settings', [
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'edit_pages' );
		},
		'callback'            => function ( WP_REST_Request $request ) {
			if ( ! $request['overwrite'] && tvgf_get_site_settings() !== null ) {
				return [ 'skipped' => true ];
			}
			$settings = is_array( $request['settings'] ) ? $request['settings'] : [];
			update_option( TVGF_SETTINGS_OPTION, tvgf_encode( tvgf_sanitize_values( tvgf_schema_fields( tvgf_site_settings_schema() ), $settings ) ) );
			tvgf_core_revalidate( 'settings' );
			return [ 'skipped' => false ];
		},
	] );
} );

// ---------------------------------------------------------------------------
// Revalidation webhook — same payload as the other TVGF mu-plugins.
// ---------------------------------------------------------------------------

function tvgf_core_revalidate( $type, $slug = '' ) {
	if ( ! empty( $GLOBALS['tvgf_core_suppress_revalidate'] ) ) {
		return;
	}
	$nextjs_url = defined( 'TVGF_NEXTJS_URL' ) ? TVGF_NEXTJS_URL : '';
	$secret     = defined( 'TVGF_REVALIDATE_SECRET' ) ? TVGF_REVALIDATE_SECRET : '';
	if ( ! $nextjs_url || ! $secret ) {
		return;
	}

	wp_remote_post(
		rtrim( $nextjs_url, '/' ) . '/api/revalidate',
		[
			'timeout'  => 5,
			'blocking' => false,
			'headers'  => [ 'Content-Type' => 'application/json' ],
			'body'     => wp_json_encode( [
				'secret' => $secret,
				'type'   => $type,
				'slug'   => $slug,
			] ),
		]
	);
}
