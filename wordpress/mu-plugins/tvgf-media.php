<?php
/**
 * Plugin Name: TVGF Media
 * Description: Content behind the Next.js /media page — the "Media Posts" feed
 *              (image-first posts with an optional video link) plus reusable
 *              hero fields (headline + background video) on core Pages. Same
 *              conventions as tvgf-site-content.php: plain register_post_meta
 *              fields (no ACF), manual meta boxes, GraphQL fields flattened via
 *              register_graphql_field, and a webhook-triggered Next.js
 *              revalidation on save.
 *
 * Install as a must-use plugin: upload this file to wp-content/mu-plugins/.
 *
 * Requires the same TVGF_NEXTJS_URL / TVGF_REVALIDATE_SECRET constants in
 * wp-config.php as tvgf-glacier-dialogues.php.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Headless install — the active theme may not declare featured image support,
// which both Media Posts (card image) and Pages (hero poster) rely on.
add_action( 'after_setup_theme', function () {
	add_theme_support( 'post-thumbnails' );
}, 20 );

// ---------------------------------------------------------------------------
// Custom Post Type: Media Post
// ---------------------------------------------------------------------------

add_action( 'init', function () {
	// Labelled "Media Posts" rather than "Media" so it isn't confused with
	// WordPress's own Media Library menu.
	register_post_type( 'media_post', [
		'labels'              => [
			'name'               => 'Media Posts',
			'singular_name'      => 'Media Post',
			'add_new_item'       => 'Add New Media Post',
			'edit_item'          => 'Edit Media Post',
			'featured_image'     => 'Card Image',
			'set_featured_image' => 'Set card image',
		],
		'public'              => true,
		'show_in_menu'        => true,
		'menu_icon'           => 'dashicons-format-gallery',
		'supports'            => [ 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ],
		'has_archive'         => false,
		'rewrite'             => false,
		'show_in_rest'        => true,
		'show_in_graphql'     => true,
		'graphql_single_name' => 'mediaPost',
		'graphql_plural_name' => 'mediaPosts',
	] );

	$auth_callback = function () {
		return current_user_can( 'edit_posts' );
	};

	register_post_meta( 'media_post', 'video_url', [
		'type'          => 'string',
		'single'        => true,
		'show_in_rest'  => true,
		'auth_callback' => $auth_callback,
	] );

	register_post_meta( 'page', 'hero_headline', [
		'type'          => 'string',
		'single'        => true,
		'show_in_rest'  => true,
		'auth_callback' => $auth_callback,
	] );
	register_post_meta( 'page', 'hero_video_url', [
		'type'          => 'string',
		'single'        => true,
		'show_in_rest'  => true,
		'auth_callback' => $auth_callback,
	] );
} );

// ---------------------------------------------------------------------------
// Meta boxes
// ---------------------------------------------------------------------------

add_action( 'add_meta_boxes', function () {
	add_meta_box(
		'tvgf_media_post_details',
		'Video (optional)',
		'tvgf_render_media_post_meta_box',
		'media_post',
		'normal',
		'high'
	);
	add_meta_box(
		'tvgf_page_hero',
		'Page Hero',
		'tvgf_render_page_hero_meta_box',
		'page',
		'normal',
		'high'
	);
} );

function tvgf_render_media_post_meta_box( $post ) {
	wp_nonce_field( 'tvgf_save_media_post_meta', 'tvgf_media_post_nonce' );
	$video_url = get_post_meta( $post->ID, 'video_url', true );
	?>
	<p>
		<label for="tvgf_video_url"><strong>Video Link</strong></label><br>
		<input type="url" id="tvgf_video_url" name="tvgf_video_url"
			value="<?php echo esc_attr( $video_url ); ?>" style="width:100%"
			placeholder="https://www.youtube.com/watch?v=...">
	</p>
	<p style="color:#666;font-size:12px;">
		Leave empty for a normal image post — the card shows the Card Image
		(featured image). When set, the card plays this video instead, using the
		Card Image as its thumbnail. Prefer YouTube or Vimeo links; a Media
		Library .mp4 URL also works but large uploads may hit the hosting limit.
	</p>
	<?php
}

function tvgf_render_page_hero_meta_box( $post ) {
	wp_nonce_field( 'tvgf_save_page_hero_meta', 'tvgf_page_hero_nonce' );
	$headline  = get_post_meta( $post->ID, 'hero_headline', true );
	$video_url = get_post_meta( $post->ID, 'hero_video_url', true );
	?>
	<p>
		<label for="tvgf_hero_headline"><strong>Hero Headline</strong></label><br>
		<input type="text" id="tvgf_hero_headline" name="tvgf_hero_headline"
			value="<?php echo esc_attr( $headline ); ?>" style="width:100%"
			placeholder="Save glaciers, save our future.">
	</p>
	<p>
		<label for="tvgf_hero_video_url"><strong>Hero Background Video (.mp4 URL)</strong></label><br>
		<input type="url" id="tvgf_hero_video_url" name="tvgf_hero_video_url"
			value="<?php echo esc_attr( $video_url ); ?>" style="width:100%"
			placeholder="https://.../wp-content/uploads/hero.mp4">
	</p>
	<p style="color:#666;font-size:12px;">
		Used by the matching page on the website (e.g. a Page with the slug
		<code>media</code> drives the /media hero). The video must be a direct
		.mp4 file — upload it to the Media Library and paste its File URL. The
		Featured Image is shown while the video loads. Leave fields empty to
		keep the site's built-in defaults.
	</p>
	<?php
}

add_action( 'save_post_media_post', function ( $post_id ) {
	if ( ! isset( $_POST['tvgf_media_post_nonce'] ) ||
		! wp_verify_nonce( $_POST['tvgf_media_post_nonce'], 'tvgf_save_media_post_meta' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	if ( isset( $_POST['tvgf_video_url'] ) ) {
		update_post_meta( $post_id, 'video_url', esc_url_raw( $_POST['tvgf_video_url'] ) );
	}
}, 10, 1 );

add_action( 'save_post_page', function ( $post_id ) {
	if ( ! isset( $_POST['tvgf_page_hero_nonce'] ) ||
		! wp_verify_nonce( $_POST['tvgf_page_hero_nonce'], 'tvgf_save_page_hero_meta' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	if ( isset( $_POST['tvgf_hero_headline'] ) ) {
		update_post_meta( $post_id, 'hero_headline', sanitize_text_field( $_POST['tvgf_hero_headline'] ) );
	}
	if ( isset( $_POST['tvgf_hero_video_url'] ) ) {
		update_post_meta( $post_id, 'hero_video_url', esc_url_raw( $_POST['tvgf_hero_video_url'] ) );
	}
}, 10, 1 );

// ---------------------------------------------------------------------------
// Flatten meta onto the GraphQL MediaPost / Page types
// ---------------------------------------------------------------------------

add_action( 'graphql_register_types', function () {
	if ( ! function_exists( 'register_graphql_field' ) ) {
		return;
	}

	register_graphql_field( 'MediaPost', 'videoUrl', [
		'type'        => 'String',
		'description' => 'Optional YouTube/Vimeo/.mp4 link; when set the card shows a video.',
		'resolve'     => function ( $post ) {
			return get_post_meta( $post->ID, 'video_url', true );
		},
	] );

	register_graphql_field( 'Page', 'heroHeadline', [
		'type'        => 'String',
		'description' => 'Hero headline shown on the matching Next.js page.',
		'resolve'     => function ( $post ) {
			return get_post_meta( $post->ID, 'hero_headline', true );
		},
	] );

	register_graphql_field( 'Page', 'heroVideoUrl', [
		'type'        => 'String',
		'description' => 'Direct .mp4 URL for the hero background video.',
		'resolve'     => function ( $post ) {
			return get_post_meta( $post->ID, 'hero_video_url', true );
		},
	] );
} );

// ---------------------------------------------------------------------------
// "View" links -> the real Next.js page, not the (locked-down) WP theme.
// Same approach as rest_prepare_glacier_dialogue in tvgf-glacier-dialogues.php.
// ---------------------------------------------------------------------------

add_filter( 'rest_prepare_media_post', function ( $response, $post ) {
	$nextjs_url = defined( 'TVGF_NEXTJS_URL' ) ? TVGF_NEXTJS_URL : '';
	if ( $nextjs_url && $post->post_status === 'publish' ) {
		$response->data['link'] = rtrim( $nextjs_url, '/' ) . '/media';
	}
	return $response;
}, 10, 2 );

add_filter( 'rest_prepare_page', function ( $response, $post ) {
	$nextjs_url = defined( 'TVGF_NEXTJS_URL' ) ? TVGF_NEXTJS_URL : '';
	if ( $nextjs_url && $post->post_status === 'publish' ) {
		$response->data['link'] = rtrim( $nextjs_url, '/' ) . '/' . $post->post_name;
	}
	return $response;
}, 10, 2 );

// ---------------------------------------------------------------------------
// Revalidation webhook
// ---------------------------------------------------------------------------

function tvgf_media_trigger_revalidate( $post ) {
	if ( ! $post ) {
		return;
	}
	if ( $post->post_type === 'media_post' ) {
		$type = 'media';
	} elseif ( $post->post_type === 'page' ) {
		$type = 'page';
	} else {
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
				'slug'   => $post->post_name,
			] ),
		]
	);
}

// Priority 20 so the meta box saves above (priority 10) have already run.
add_action( 'save_post_media_post', function ( $post_id, $post ) {
	tvgf_media_trigger_revalidate( $post );
}, 20, 2 );

add_action( 'save_post_page', function ( $post_id, $post ) {
	tvgf_media_trigger_revalidate( $post );
}, 20, 2 );

// Also catches scheduled posts going live via WP-Cron, and trashing/unpublishing,
// so a removed post disappears from the site without waiting for the hourly revalidate.
add_action( 'transition_post_status', function ( $new_status, $old_status, $post ) {
	if ( $new_status !== $old_status && ( $new_status === 'publish' || $old_status === 'publish' ) ) {
		tvgf_media_trigger_revalidate( $post );
	}
}, 10, 3 );
