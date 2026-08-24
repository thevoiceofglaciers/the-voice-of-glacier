<?php
/**
 * Plugin Name: TVGF Site Content
 * Description: Site-wide content types that aren't specific to Glacier Dialogues —
 *              currently just the Announcement bar shown below the main menu on
 *              every page. Same conventions as tvgf-glacier-dialogues.php: plain
 *              register_post_meta fields (no ACF), a manual meta box, GraphQL
 *              fields flattened via register_graphql_field, and a webhook-triggered
 *              Next.js revalidation on save.
 *
 * Install as a must-use plugin: upload this file to wp-content/mu-plugins/.
 *
 * Requires the same TVGF_NEXTJS_URL / TVGF_REVALIDATE_SECRET constants in
 * wp-config.php as tvgf-glacier-dialogues.php.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ---------------------------------------------------------------------------
// Custom Post Type: Announcement
// ---------------------------------------------------------------------------

add_action( 'init', function () {
	register_post_type( 'announcement', [
		'labels'              => [
			'name'          => 'Announcements',
			'singular_name' => 'Announcement',
			'add_new_item'  => 'Add New Announcement',
			'edit_item'     => 'Edit Announcement',
		],
		'public'              => true,
		'show_in_menu'        => true,
		'menu_icon'           => 'dashicons-megaphone',
		'supports'            => [ 'title', 'custom-fields' ],
		'has_archive'         => false,
		'rewrite'             => false,
		'show_in_rest'        => true,
		'show_in_graphql'     => true,
		'graphql_single_name' => 'announcement',
		'graphql_plural_name' => 'announcements',
	] );

	$auth_callback = function () {
		return current_user_can( 'edit_posts' );
	};

	register_post_meta( 'announcement', 'announcement_description', [
		'type'          => 'string',
		'single'        => true,
		'show_in_rest'  => true,
		'auth_callback' => $auth_callback,
	] );
	register_post_meta( 'announcement', 'cta_label', [
		'type'          => 'string',
		'single'        => true,
		'show_in_rest'  => true,
		'auth_callback' => $auth_callback,
	] );
	register_post_meta( 'announcement', 'cta_url', [
		'type'          => 'string',
		'single'        => true,
		'show_in_rest'  => true,
		'auth_callback' => $auth_callback,
	] );
	register_post_meta( 'announcement', 'is_active', [
		'type'          => 'boolean',
		'single'        => true,
		'show_in_rest'  => true,
		'default'       => true,
		'auth_callback' => $auth_callback,
	] );
} );

// ---------------------------------------------------------------------------
// Meta box: simple HTML5 inputs, no plugin needed
// ---------------------------------------------------------------------------

add_action( 'add_meta_boxes', function () {
	add_meta_box(
		'tvgf_announcement_details',
		'Announcement Details',
		'tvgf_render_announcement_meta_box',
		'announcement',
		'normal',
		'high'
	);
} );

function tvgf_render_announcement_meta_box( $post ) {
	wp_nonce_field( 'tvgf_save_announcement_meta', 'tvgf_announcement_nonce' );

	$description = get_post_meta( $post->ID, 'announcement_description', true );
	$cta_label   = get_post_meta( $post->ID, 'cta_label', true );
	$cta_url     = get_post_meta( $post->ID, 'cta_url', true );
	$is_active   = get_post_meta( $post->ID, 'is_active', true );
	// New posts have no saved meta yet — default the checkbox to checked.
	$is_active_checked = ( '' === $is_active ) ? true : (bool) $is_active;
	?>
	<p>
		<label for="tvgf_announcement_description"><strong>Description</strong></label><br>
		<textarea id="tvgf_announcement_description" name="tvgf_announcement_description" rows="3"
			style="width:100%"><?php echo esc_textarea( $description ); ?></textarea>
	</p>
	<p>
		<label for="tvgf_cta_label"><strong>Button Label</strong></label><br>
		<input type="text" id="tvgf_cta_label" name="tvgf_cta_label"
			value="<?php echo esc_attr( $cta_label ); ?>" style="width:100%" placeholder="Learn More">
	</p>
	<p>
		<label for="tvgf_cta_url"><strong>Button Link</strong></label><br>
		<input type="url" id="tvgf_cta_url" name="tvgf_cta_url"
			value="<?php echo esc_attr( $cta_url ); ?>" style="width:100%"
			placeholder="/glacier-dialogues or https://example.com">
	</p>
	<p>
		<label>
			<input type="checkbox" name="tvgf_is_active" value="1" <?php checked( $is_active_checked ); ?>>
			<strong>Active</strong> — shown on the site while checked
		</label>
	</p>
	<p style="color:#666;font-size:12px;">
		The site shows the most recently published Announcement that has
		"Active" checked. Uncheck this to hide it without deleting it, or
		publish a new Announcement to replace it.
	</p>
	<?php
}

add_action( 'save_post_announcement', function ( $post_id ) {
	if ( ! isset( $_POST['tvgf_announcement_nonce'] ) ||
		! wp_verify_nonce( $_POST['tvgf_announcement_nonce'], 'tvgf_save_announcement_meta' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	if ( isset( $_POST['tvgf_announcement_description'] ) ) {
		update_post_meta( $post_id, 'announcement_description', sanitize_textarea_field( $_POST['tvgf_announcement_description'] ) );
	}
	if ( isset( $_POST['tvgf_cta_label'] ) ) {
		update_post_meta( $post_id, 'cta_label', sanitize_text_field( $_POST['tvgf_cta_label'] ) );
	}
	if ( isset( $_POST['tvgf_cta_url'] ) ) {
		update_post_meta( $post_id, 'cta_url', esc_url_raw( $_POST['tvgf_cta_url'] ) );
	}
	update_post_meta( $post_id, 'is_active', isset( $_POST['tvgf_is_active'] ) );
}, 10, 1 );

// ---------------------------------------------------------------------------
// Flatten meta onto the GraphQL Announcement type
// ---------------------------------------------------------------------------

add_action( 'graphql_register_types', function () {
	if ( ! function_exists( 'register_graphql_field' ) ) {
		return;
	}

	register_graphql_field( 'Announcement', 'description', [
		'type'        => 'String',
		'description' => 'Announcement bar description text.',
		'resolve'     => function ( $post ) {
			return get_post_meta( $post->ID, 'announcement_description', true );
		},
	] );

	register_graphql_field( 'Announcement', 'ctaLabel', [
		'type'        => 'String',
		'description' => 'Announcement bar button label.',
		'resolve'     => function ( $post ) {
			return get_post_meta( $post->ID, 'cta_label', true );
		},
	] );

	register_graphql_field( 'Announcement', 'ctaUrl', [
		'type'        => 'String',
		'description' => 'Announcement bar button URL (internal or external).',
		'resolve'     => function ( $post ) {
			return get_post_meta( $post->ID, 'cta_url', true );
		},
	] );

	register_graphql_field( 'Announcement', 'isActive', [
		'type'        => 'Boolean',
		'description' => 'Whether this announcement should currently be shown.',
		'resolve'     => function ( $post ) {
			$value = get_post_meta( $post->ID, 'is_active', true );
			return '' === $value ? true : (bool) $value;
		},
	] );
} );

// ---------------------------------------------------------------------------
// Revalidation webhook
// ---------------------------------------------------------------------------

add_action( 'save_post_announcement', function ( $post_id, $post ) {
	tvgf_site_content_trigger_revalidate( 'announcement', $post );
}, 20, 2 );

add_action( 'transition_post_status', function ( $new_status, $old_status, $post ) {
	if ( $post->post_type === 'announcement' && $new_status === 'publish' && $old_status !== 'publish' ) {
		tvgf_site_content_trigger_revalidate( 'announcement', $post );
	}
}, 10, 3 );

function tvgf_site_content_trigger_revalidate( $type, $post ) {
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
				'slug'   => $post->post_name,
			] ),
		]
	);
}
