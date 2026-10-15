<?php
/**
 * Plugin Name: TVGF News
 * Description: The "Latest News" section on the Next.js /media page. Editors
 *              add News Links by hand (headline, link, source, summary, image,
 *              "pin to top"), and a sync job imports articles from the legacy
 *              backend's /news feed on a WP-Cron schedule. Everything — the
 *              feed URL, schedule, whether imports go live immediately, how
 *              long imported items are kept, and a "Sync now" button — is
 *              managed under News Links > Sync Settings.
 *
 * Install as a must-use plugin: upload this file to wp-content/mu-plugins/.
 *
 * Requires the same TVGF_NEXTJS_URL / TVGF_REVALIDATE_SECRET constants in
 * wp-config.php as the other TVGF mu-plugins. WP-Cron only fires when
 * WordPress receives a request, so on Hostinger set up a real server cron
 * hitting wp-cron.php (see wordpress/README.md) for a dependable schedule.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'TVGF_NEWS_SETTINGS_OPTION', 'tvgf_news_settings' );
define( 'TVGF_NEWS_STATUS_OPTION', 'tvgf_news_last_sync' );
define( 'TVGF_NEWS_DISMISSED_OPTION', 'tvgf_news_dismissed' );
define( 'TVGF_NEWS_CRON_HOOK', 'tvgf_news_sync' );

function tvgf_news_default_settings() {
	return [
		'enabled'     => true,
		'feed_url'    => 'https://glacier-server.onrender.com/news',
		'frequency'   => 'daily',
		'sync_status' => 'publish',
		'keep_days'   => 30,
	];
}

function tvgf_news_settings() {
	$saved = get_option( TVGF_NEWS_SETTINGS_OPTION, [] );
	return array_merge( tvgf_news_default_settings(), is_array( $saved ) ? $saved : [] );
}

function tvgf_news_frequencies() {
	return [
		'hourly'     => 'Every hour',
		'twicedaily' => 'Every 12 hours',
		'daily'      => 'Every 24 hours',
	];
}

// ---------------------------------------------------------------------------
// Custom Post Type: News Link
// ---------------------------------------------------------------------------

add_action( 'after_setup_theme', function () {
	add_theme_support( 'post-thumbnails' );
}, 20 );

add_action( 'init', function () {
	register_post_type( 'news_link', [
		'labels'              => [
			'name'               => 'News Links',
			'singular_name'      => 'News Link',
			'add_new_item'       => 'Add New News Link',
			'edit_item'          => 'Edit News Link',
			'featured_image'     => 'Image',
			'set_featured_image' => 'Upload image',
		],
		'public'              => true,
		'show_in_menu'        => true,
		'menu_icon'           => 'dashicons-rss',
		'supports'            => [ 'title', 'thumbnail', 'custom-fields' ],
		'has_archive'         => false,
		'rewrite'             => false,
		'show_in_rest'        => true,
		'show_in_graphql'     => true,
		'graphql_single_name' => 'newsLink',
		'graphql_plural_name' => 'newsLinks',
	] );

	$auth_callback = function () {
		return current_user_can( 'edit_posts' );
	};
	$meta = [
		'link_url'    => 'string',
		'source_name' => 'string',
		'summary'     => 'string',
		'image_url'   => 'string',
		'is_pinned'   => 'boolean',
		'origin'      => 'string', // "manual" | "sync"
	];
	foreach ( $meta as $key => $type ) {
		register_post_meta( 'news_link', $key, [
			'type'          => $type,
			'single'        => true,
			'show_in_rest'  => true,
			'auth_callback' => $auth_callback,
		] );
	}
} );

// Just a handful of fields — the classic screen keeps them front and centre.
add_filter( 'use_block_editor_for_post_type', function ( $use, $post_type ) {
	return 'news_link' === $post_type ? false : $use;
}, 10, 2 );

add_filter( 'enter_title_here', function ( $placeholder, $post ) {
	return 'news_link' === $post->post_type ? 'Headline' : $placeholder;
}, 10, 2 );

// ---------------------------------------------------------------------------
// Edit screen
// ---------------------------------------------------------------------------

add_action( 'add_meta_boxes', function () {
	add_meta_box( 'tvgf_news_link_details', 'News Link Details', 'tvgf_render_news_link_meta_box', 'news_link', 'normal', 'high' );
} );

function tvgf_render_news_link_meta_box( $post ) {
	wp_nonce_field( 'tvgf_save_news_link_meta', 'tvgf_news_link_nonce' );

	$link_url  = get_post_meta( $post->ID, 'link_url', true );
	$source    = get_post_meta( $post->ID, 'source_name', true );
	$summary   = get_post_meta( $post->ID, 'summary', true );
	$image_url = get_post_meta( $post->ID, 'image_url', true );
	$is_pinned = (bool) get_post_meta( $post->ID, 'is_pinned', true );
	$origin    = get_post_meta( $post->ID, 'origin', true );
	?>
	<?php if ( 'sync' === $origin ) : ?>
		<p style="background:#f0f6fc;border-left:4px solid #72aee6;padding:8px 12px;">
			Imported automatically from the news feed. Edits you make here are kept —
			the sync never overwrites an existing item. Moving it to the Trash or
			deleting it stops it from being imported again.
		</p>
	<?php endif; ?>
	<p>
		<label for="tvgf_link_url"><strong>Article Link</strong> (required)</label><br>
		<input type="url" id="tvgf_link_url" name="tvgf_link_url" required
			value="<?php echo esc_attr( $link_url ); ?>" style="width:100%" placeholder="https://...">
	</p>
	<p>
		<label for="tvgf_source_name"><strong>Source</strong></label><br>
		<input type="text" id="tvgf_source_name" name="tvgf_source_name"
			value="<?php echo esc_attr( $source ); ?>" style="width:100%" placeholder="Hindustan Times">
	</p>
	<p>
		<label for="tvgf_summary"><strong>Summary</strong></label><br>
		<textarea id="tvgf_summary" name="tvgf_summary" rows="4" style="width:100%"><?php echo esc_textarea( $summary ); ?></textarea>
	</p>
	<p>
		<label for="tvgf_image_url"><strong>Image Link</strong></label><br>
		<input type="url" id="tvgf_image_url" name="tvgf_image_url"
			value="<?php echo esc_attr( $image_url ); ?>" style="width:100%" placeholder="https://.../photo.jpg">
		<span style="color:#666;font-size:12px;">Used when no image is uploaded in the "Image" box on the right.</span>
	</p>
	<p>
		<label>
			<input type="checkbox" name="tvgf_is_pinned" value="1" <?php checked( $is_pinned ); ?>>
			<strong>Pin to top</strong> — always shown first, whatever its date
		</label>
	</p>
	<p style="color:#666;font-size:12px;">
		The site shows pinned links first, then the newest by publish date. Change
		the publish date to reorder.
	</p>
	<?php
}

add_action( 'save_post_news_link', function ( $post_id ) {
	if ( ! isset( $_POST['tvgf_news_link_nonce'] ) ||
		! wp_verify_nonce( $_POST['tvgf_news_link_nonce'], 'tvgf_save_news_link_meta' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	update_post_meta( $post_id, 'link_url', esc_url_raw( wp_unslash( $_POST['tvgf_link_url'] ?? '' ) ) );
	update_post_meta( $post_id, 'source_name', sanitize_text_field( wp_unslash( $_POST['tvgf_source_name'] ?? '' ) ) );
	update_post_meta( $post_id, 'summary', sanitize_textarea_field( wp_unslash( $_POST['tvgf_summary'] ?? '' ) ) );
	update_post_meta( $post_id, 'image_url', esc_url_raw( wp_unslash( $_POST['tvgf_image_url'] ?? '' ) ) );
	update_post_meta( $post_id, 'is_pinned', isset( $_POST['tvgf_is_pinned'] ) );
	if ( ! get_post_meta( $post_id, 'origin', true ) ) {
		update_post_meta( $post_id, 'origin', 'manual' );
	}
}, 10, 1 );

// ---------------------------------------------------------------------------
// Admin list columns
// ---------------------------------------------------------------------------

add_filter( 'manage_news_link_posts_columns', function ( $columns ) {
	$date = $columns['date'] ?? null;
	unset( $columns['date'] );
	$columns['tvgf_source'] = 'Source';
	$columns['tvgf_origin'] = 'Added by';
	$columns['tvgf_pinned'] = 'Pinned';
	if ( $date ) {
		$columns['date'] = $date;
	}
	return $columns;
} );

add_action( 'manage_news_link_posts_custom_column', function ( $column, $post_id ) {
	if ( 'tvgf_source' === $column ) {
		$url = get_post_meta( $post_id, 'link_url', true );
		$src = get_post_meta( $post_id, 'source_name', true ) ?: ( $url ? wp_parse_url( $url, PHP_URL_HOST ) : '' );
		echo $url ? '<a href="' . esc_url( $url ) . '" target="_blank" rel="noopener">' . esc_html( $src ?: $url ) . '</a>' : '—';
	} elseif ( 'tvgf_origin' === $column ) {
		echo 'sync' === get_post_meta( $post_id, 'origin', true ) ? 'Feed sync' : 'Editor';
	} elseif ( 'tvgf_pinned' === $column ) {
		echo get_post_meta( $post_id, 'is_pinned', true ) ? '📌' : '';
	}
}, 10, 2 );

// ---------------------------------------------------------------------------
// GraphQL fields
// ---------------------------------------------------------------------------

add_action( 'graphql_register_types', function () {
	if ( ! function_exists( 'register_graphql_field' ) ) {
		return;
	}

	$fields = [
		'linkUrl'    => [ 'String', 'Article URL.', function ( $post ) {
			return get_post_meta( $post->ID, 'link_url', true );
		} ],
		'sourceName' => [ 'String', 'Publisher name.', function ( $post ) {
			return get_post_meta( $post->ID, 'source_name', true );
		} ],
		'summary'    => [ 'String', 'Short plain-text summary.', function ( $post ) {
			return get_post_meta( $post->ID, 'summary', true );
		} ],
		'imageUrl'   => [ 'String', 'Uploaded image if set, otherwise the Image Link.', function ( $post ) {
			$thumb = get_the_post_thumbnail_url( $post->ID, 'large' );
			return $thumb ?: get_post_meta( $post->ID, 'image_url', true );
		} ],
		'isPinned'   => [ 'Boolean', 'Shown before unpinned links.', function ( $post ) {
			return (bool) get_post_meta( $post->ID, 'is_pinned', true );
		} ],
		'origin'     => [ 'String', '"manual" or "sync".', function ( $post ) {
			return get_post_meta( $post->ID, 'origin', true ) ?: 'manual';
		} ],
	];

	foreach ( $fields as $name => [ $type, $description, $resolve ] ) {
		register_graphql_field( 'NewsLink', $name, [
			'type'        => $type,
			'description' => $description,
			'resolve'     => $resolve,
		] );
	}
} );

add_filter( 'rest_prepare_news_link', function ( $response, $post ) {
	$nextjs_url = defined( 'TVGF_NEXTJS_URL' ) ? TVGF_NEXTJS_URL : '';
	if ( $nextjs_url && 'publish' === $post->post_status ) {
		$response->data['link'] = rtrim( $nextjs_url, '/' ) . '/media';
	}
	return $response;
}, 10, 2 );

// ---------------------------------------------------------------------------
// Revalidation webhook (one call per sync run, not one per imported item)
// ---------------------------------------------------------------------------

function tvgf_news_revalidate() {
	if ( ! empty( $GLOBALS['tvgf_news_syncing'] ) ) {
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
			'body'     => wp_json_encode( [ 'secret' => $secret, 'type' => 'news' ] ),
		]
	);
}

add_action( 'save_post_news_link', function () {
	tvgf_news_revalidate();
}, 20 );

add_action( 'transition_post_status', function ( $new_status, $old_status, $post ) {
	if ( 'news_link' === $post->post_type && $new_status !== $old_status && ( 'publish' === $new_status || 'publish' === $old_status ) ) {
		tvgf_news_revalidate();
	}
}, 10, 3 );

// ---------------------------------------------------------------------------
// Removed imports stay removed: remember their URLs so the next sync skips
// them even after they're permanently deleted (not just while in the Trash).
// ---------------------------------------------------------------------------

function tvgf_news_url_key( $url ) {
	return md5( strtolower( untrailingslashit( trim( $url ) ) ) );
}

add_action( 'before_delete_post', function ( $post_id ) {
	if ( ! empty( $GLOBALS['tvgf_news_cleanup'] ) || 'news_link' !== get_post_type( $post_id ) ) {
		return;
	}
	if ( 'sync' !== get_post_meta( $post_id, 'origin', true ) ) {
		return;
	}
	$url = get_post_meta( $post_id, 'link_url', true );
	if ( $url ) {
		$dismissed   = (array) get_option( TVGF_NEWS_DISMISSED_OPTION, [] );
		$dismissed[] = tvgf_news_url_key( $url );
		// Feed items age out within weeks — the last 1000 is plenty.
		update_option( TVGF_NEWS_DISMISSED_OPTION, array_slice( array_values( array_unique( $dismissed ) ), -1000 ), false );
	}
} );

// ---------------------------------------------------------------------------
// Sync
// ---------------------------------------------------------------------------

// Publishers fall back to their site logo when an article has no photo
// (e.g. ".../newTsol_logo_socmedia.png"). Only the filename is checked —
// some CDNs have "/logo/" as a folder in every real image path.
function tvgf_news_is_placeholder_image( $url ) {
	$path = (string) wp_parse_url( $url, PHP_URL_PATH );
	return '' === $path || false !== stripos( basename( $path ), 'logo' );
}

function tvgf_news_link_exists( $url ) {
	$found = get_posts( [
		'post_type'      => 'news_link',
		'post_status'    => 'any', // excludes trash, so check it separately below
		'meta_key'       => 'link_url',
		'meta_value'     => $url,
		'fields'         => 'ids',
		'posts_per_page' => 1,
	] );
	if ( $found ) {
		return true;
	}
	return (bool) get_posts( [
		'post_type'      => 'news_link',
		'post_status'    => 'trash',
		'meta_key'       => 'link_url',
		'meta_value'     => $url,
		'fields'         => 'ids',
		'posts_per_page' => 1,
	] );
}

/**
 * Imports new articles from the feed and prunes old imported ones.
 * Returns [ 'ok' => bool, 'message' => string, 'added' => int, 'removed' => int ].
 */
function tvgf_news_run_sync() {
	$settings = tvgf_news_settings();
	$result   = [ 'ok' => false, 'message' => '', 'added' => 0, 'removed' => 0, 'time' => time() ];

	if ( empty( $settings['feed_url'] ) ) {
		$result['message'] = 'No feed URL set.';
		update_option( TVGF_NEWS_STATUS_OPTION, $result, false );
		return $result;
	}

	// Render's free tier sleeps when idle — the first request can take ~30s.
	$response = wp_remote_get( $settings['feed_url'], [ 'timeout' => 60 ] );
	if ( is_wp_error( $response ) ) {
		$result['message'] = 'Could not reach the feed: ' . $response->get_error_message();
		update_option( TVGF_NEWS_STATUS_OPTION, $result, false );
		return $result;
	}
	$code = wp_remote_retrieve_response_code( $response );
	$data = json_decode( wp_remote_retrieve_body( $response ), true );
	if ( 200 !== $code || ! is_array( $data ) ) {
		$result['message'] = "The feed returned an unexpected response (HTTP $code).";
		update_option( TVGF_NEWS_STATUS_OPTION, $result, false );
		return $result;
	}

	$articles  = isset( $data['articles'] ) && is_array( $data['articles'] ) ? $data['articles'] : ( isset( $data[0] ) ? $data : [] );
	$dismissed = array_flip( (array) get_option( TVGF_NEWS_DISMISSED_OPTION, [] ) );
	$status    = 'draft' === $settings['sync_status'] ? 'draft' : 'publish';

	$GLOBALS['tvgf_news_syncing'] = true;

	foreach ( $articles as $article ) {
		$title = isset( $article['title'] ) ? trim( wp_strip_all_tags( $article['title'] ) ) : '';
		$url   = isset( $article['url'] ) ? esc_url_raw( $article['url'] ) : '';
		$image = isset( $article['urlToImage'] ) ? esc_url_raw( $article['urlToImage'] ) : '';
		if ( ! $title || ! $url || ! $image || tvgf_news_is_placeholder_image( $image ) ) {
			continue;
		}
		if ( isset( $dismissed[ tvgf_news_url_key( $url ) ] ) || tvgf_news_link_exists( $url ) ) {
			continue;
		}

		$published = isset( $article['publishedAt'] ) ? strtotime( $article['publishedAt'] ) : false;
		$post_id   = wp_insert_post( [
			'post_type'     => 'news_link',
			'post_status'   => $status,
			'post_title'    => $title,
			'post_date_gmt' => $published ? gmdate( 'Y-m-d H:i:s', $published ) : '',
			'post_date'     => $published ? get_date_from_gmt( gmdate( 'Y-m-d H:i:s', $published ) ) : '',
			'meta_input'    => [
				'link_url'    => $url,
				'source_name' => isset( $article['source']['name'] ) ? sanitize_text_field( $article['source']['name'] ) : (string) wp_parse_url( $url, PHP_URL_HOST ),
				'summary'     => isset( $article['description'] ) ? sanitize_textarea_field( html_entity_decode( wp_strip_all_tags( $article['description'] ), ENT_QUOTES, 'UTF-8' ) ) : '',
				'image_url'   => $image,
				'is_pinned'   => false,
				'origin'      => 'sync',
			],
		], true );

		if ( ! is_wp_error( $post_id ) ) {
			$result['added']++;
		}
	}

	// Prune imported, unpinned items past the retention window.
	$keep_days = (int) $settings['keep_days'];
	if ( $keep_days > 0 ) {
		$old = get_posts( [
			'post_type'      => 'news_link',
			'post_status'    => 'any',
			'fields'         => 'ids',
			'posts_per_page' => 200,
			'date_query'     => [ [ 'before' => "$keep_days days ago", 'column' => 'post_date_gmt' ] ],
			'meta_query'     => [
				[ 'key' => 'origin', 'value' => 'sync' ],
				[
					'relation' => 'OR',
					[ 'key' => 'is_pinned', 'compare' => 'NOT EXISTS' ],
					[ 'key' => 'is_pinned', 'value' => [ '', '0' ], 'compare' => 'IN' ],
				],
			],
		] );
		$GLOBALS['tvgf_news_cleanup'] = true;
		foreach ( $old as $old_id ) {
			if ( wp_delete_post( $old_id, true ) ) {
				$result['removed']++;
			}
		}
		$GLOBALS['tvgf_news_cleanup'] = false;
	}

	$GLOBALS['tvgf_news_syncing'] = false;

	$result['ok']      = true;
	$result['message'] = sprintf(
		'%d new article(s) imported%s, %d old article(s) removed.',
		$result['added'],
		'draft' === $status && $result['added'] ? ' as drafts' : '',
		$result['removed']
	);
	update_option( TVGF_NEWS_STATUS_OPTION, $result, false );

	if ( $result['added'] || $result['removed'] ) {
		tvgf_news_revalidate();
	}
	return $result;
}

add_action( TVGF_NEWS_CRON_HOOK, 'tvgf_news_run_sync' );

// Keep the cron event in line with the settings (also covers first install).
function tvgf_news_reschedule() {
	$settings = tvgf_news_settings();
	$next     = wp_next_scheduled( TVGF_NEWS_CRON_HOOK );
	$event    = $next ? wp_get_scheduled_event( TVGF_NEWS_CRON_HOOK ) : false;

	if ( empty( $settings['enabled'] ) ) {
		wp_clear_scheduled_hook( TVGF_NEWS_CRON_HOOK );
		return;
	}
	if ( $event && $event->schedule === $settings['frequency'] ) {
		return;
	}
	wp_clear_scheduled_hook( TVGF_NEWS_CRON_HOOK );
	wp_schedule_event( time() + MINUTE_IN_SECONDS, $settings['frequency'], TVGF_NEWS_CRON_HOOK );
}

add_action( 'init', 'tvgf_news_reschedule' );

// ---------------------------------------------------------------------------
// News Links > Sync Settings
// ---------------------------------------------------------------------------

add_action( 'admin_menu', function () {
	add_submenu_page( 'edit.php?post_type=news_link', 'News Sync Settings', 'Sync Settings', 'edit_pages', 'tvgf-news-sync', 'tvgf_render_news_sync_page' );
} );

function tvgf_render_news_sync_page() {
	$settings = tvgf_news_settings();
	$status   = get_option( TVGF_NEWS_STATUS_OPTION, [] );
	$next     = wp_next_scheduled( TVGF_NEWS_CRON_HOOK );
	$fmt      = get_option( 'date_format' ) . ' ' . get_option( 'time_format' );
	?>
	<div class="wrap">
		<h1>News Sync Settings</h1>

		<?php if ( isset( $_GET['updated'] ) ) : ?>
			<div class="notice notice-success is-dismissible"><p>Settings saved.</p></div>
		<?php endif; ?>
		<?php if ( isset( $_GET['synced'] ) && ! empty( $status ) ) : ?>
			<div class="notice <?php echo ! empty( $status['ok'] ) ? 'notice-success' : 'notice-error'; ?> is-dismissible">
				<p><?php echo esc_html( $status['message'] ); ?></p>
			</div>
		<?php endif; ?>

		<p>
			News Links you add by hand are always shown. This sync also imports
			articles from the news feed, so the section stays fresh without anyone
			having to add them. Imported items appear in the News Links list marked
			"Feed sync" — edit, pin, or trash them like any other link.
		</p>

		<table class="widefat striped" style="max-width:720px;margin:16px 0;">
			<tbody>
				<tr>
					<th style="width:200px;">Last sync</th>
					<td>
						<?php if ( ! empty( $status['time'] ) ) : ?>
							<?php echo esc_html( wp_date( $fmt, $status['time'] ) ); ?> —
							<?php echo ! empty( $status['ok'] ) ? '✅' : '⚠️'; ?>
							<?php echo esc_html( $status['message'] ); ?>
						<?php else : ?>
							Never
						<?php endif; ?>
					</td>
				</tr>
				<tr>
					<th>Next automatic sync</th>
					<td><?php echo $next ? esc_html( wp_date( $fmt, $next ) ) : 'Off'; ?></td>
				</tr>
			</tbody>
		</table>

		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="margin-bottom:24px;">
			<input type="hidden" name="action" value="tvgf_news_sync_now">
			<?php wp_nonce_field( 'tvgf_news_sync_now', 'tvgf_news_sync_now_nonce' ); ?>
			<?php submit_button( 'Sync now', 'secondary', 'submit', false ); ?>
			<span style="color:#666;margin-left:8px;">Can take up to a minute if the feed server is waking up.</span>
		</form>

		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="tvgf_news_save_settings">
			<?php wp_nonce_field( 'tvgf_news_save_settings', 'tvgf_news_settings_nonce' ); ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">Automatic sync</th>
					<td>
						<label>
							<input type="checkbox" name="enabled" value="1" <?php checked( ! empty( $settings['enabled'] ) ); ?>>
							Import new articles from the feed automatically
						</label>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="tvgf_news_frequency">How often</label></th>
					<td>
						<select id="tvgf_news_frequency" name="frequency">
							<?php foreach ( tvgf_news_frequencies() as $value => $label ) : ?>
								<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $settings['frequency'], $value ); ?>><?php echo esc_html( $label ); ?></option>
							<?php endforeach; ?>
						</select>
					</td>
				</tr>
				<tr>
					<th scope="row">Imported articles</th>
					<td>
						<label><input type="radio" name="sync_status" value="publish" <?php checked( $settings['sync_status'], 'publish' ); ?>> Publish immediately</label><br>
						<label><input type="radio" name="sync_status" value="draft" <?php checked( $settings['sync_status'], 'draft' ); ?>> Save as drafts for review</label>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="tvgf_news_keep_days">Remove imported articles after</label></th>
					<td>
						<input type="number" id="tvgf_news_keep_days" name="keep_days" min="0" step="1" style="width:80px;"
							value="<?php echo esc_attr( (int) $settings['keep_days'] ); ?>"> days
						<p class="description">Pinned articles and ones you added by hand are never removed. 0 keeps everything.</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="tvgf_news_feed_url">Feed URL</label></th>
					<td>
						<input type="url" id="tvgf_news_feed_url" name="feed_url" class="regular-text" style="width:100%;max-width:480px;"
							value="<?php echo esc_attr( $settings['feed_url'] ); ?>">
						<p class="description">Must return NewsAPI-style JSON: <code>{ "articles": [ { "title", "url", "urlToImage", "description", "publishedAt", "source": { "name" } } ] }</code></p>
					</td>
				</tr>
			</table>
			<?php submit_button( 'Save Settings' ); ?>
		</form>
	</div>
	<?php
}

add_action( 'admin_post_tvgf_news_save_settings', function () {
	if ( ! current_user_can( 'edit_pages' ) ||
		! isset( $_POST['tvgf_news_settings_nonce'] ) ||
		! wp_verify_nonce( $_POST['tvgf_news_settings_nonce'], 'tvgf_news_save_settings' ) ) {
		wp_die( 'Not allowed.' );
	}

	$frequency = sanitize_key( $_POST['frequency'] ?? 'daily' );
	update_option( TVGF_NEWS_SETTINGS_OPTION, [
		'enabled'     => isset( $_POST['enabled'] ),
		'feed_url'    => esc_url_raw( wp_unslash( $_POST['feed_url'] ?? '' ) ),
		'frequency'   => array_key_exists( $frequency, tvgf_news_frequencies() ) ? $frequency : 'daily',
		'sync_status' => 'draft' === ( $_POST['sync_status'] ?? '' ) ? 'draft' : 'publish',
		'keep_days'   => max( 0, (int) ( $_POST['keep_days'] ?? 30 ) ),
	], false );

	// Force a fresh schedule so a changed frequency takes effect from now.
	wp_clear_scheduled_hook( TVGF_NEWS_CRON_HOOK );
	tvgf_news_reschedule();

	wp_safe_redirect( admin_url( 'edit.php?post_type=news_link&page=tvgf-news-sync&updated=1' ) );
	exit;
} );

add_action( 'admin_post_tvgf_news_sync_now', function () {
	if ( ! current_user_can( 'edit_pages' ) ||
		! isset( $_POST['tvgf_news_sync_now_nonce'] ) ||
		! wp_verify_nonce( $_POST['tvgf_news_sync_now_nonce'], 'tvgf_news_sync_now' ) ) {
		wp_die( 'Not allowed.' );
	}

	tvgf_news_run_sync();

	wp_safe_redirect( admin_url( 'edit.php?post_type=news_link&page=tvgf-news-sync&synced=1' ) );
	exit;
} );
