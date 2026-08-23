<?php
/**
 * Plugin Name: TVGF Glacier Dialogues
 * Description: Custom post type, meta fields, taxonomy, GraphQL exposure, preview link,
 *              and Next.js revalidation webhook for the Glacier Dialogues series.
 *
 * Install as a must-use plugin: upload this file to wp-content/mu-plugins/.
 * mu-plugins load automatically and can't be accidentally deactivated from the admin UI.
 *
 * Requires the free "WPGraphQL" plugin active (register_graphql_field calls are
 * no-ops if it isn't). "WPGraphQL Content Blocks" is required to expose Gutenberg
 * block content (editorBlocks) to the Next.js site.
 *
 * Define these three constants in wp-config.php (see wordpress/README.md):
 *   TVGF_NEXTJS_URL         e.g. 'https://thevoiceofglaciers.org'
 *   TVGF_REVALIDATE_SECRET  shared secret, must match Next.js WORDPRESS_REVALIDATE_SECRET
 *   TVGF_PREVIEW_SECRET     shared secret, must match Next.js WORDPRESS_PREVIEW_SECRET
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ---------------------------------------------------------------------------
// Custom Post Type + Taxonomy
// ---------------------------------------------------------------------------

add_action( 'init', function () {

	register_post_type( 'glacier_dialogue', [
		'labels'              => [
			'name'          => 'Glacier Dialogues',
			'singular_name' => 'Glacier Dialogue',
			'add_new_item'  => 'Add New Glacier Dialogue',
			'edit_item'     => 'Edit Glacier Dialogue',
		],
		'public'              => true,
		'show_in_menu'        => true,
		'menu_icon'           => 'dashicons-microphone',
		'supports'            => [ 'title', 'editor', 'thumbnail', 'revisions', 'custom-fields' ],
		'has_archive'         => false,
		'rewrite'             => [ 'slug' => 'glacier-dialogues' ],
		'show_in_rest'        => true,
		'show_in_graphql'     => true,
		'graphql_single_name' => 'glacierDialogue',
		'graphql_plural_name' => 'glacierDialogues',
	] );

	register_taxonomy( 'dialogue_topic', 'glacier_dialogue', [
		'labels'              => [
			'name'          => 'Topics',
			'singular_name' => 'Topic',
		],
		'public'              => true,
		'hierarchical'        => false,
		'show_in_rest'        => true,
		'show_in_graphql'     => true,
		'graphql_single_name' => 'dialogueTopic',
		'graphql_plural_name' => 'dialogueTopics',
	] );
} );

// ---------------------------------------------------------------------------
// Post meta (plain fields — no ACF needed for these single-value fields)
// ---------------------------------------------------------------------------

add_action( 'init', function () {
	$auth_callback = function () {
		return current_user_can( 'edit_posts' );
	};

	register_post_meta( 'glacier_dialogue', 'dialogue_date', [
		'type'          => 'string',
		'single'        => true,
		'show_in_rest'  => true,
		'auth_callback' => $auth_callback,
	] );

	register_post_meta( 'glacier_dialogue', 'speaker_name', [
		'type'          => 'string',
		'single'        => true,
		'show_in_rest'  => true,
		'auth_callback' => $auth_callback,
	] );

	register_post_meta( 'glacier_dialogue', 'video_link', [
		'type'          => 'string',
		'single'        => true,
		'show_in_rest'  => true,
		'auth_callback' => $auth_callback,
	] );
} );

// ---------------------------------------------------------------------------
// Meta box: simple HTML5 inputs, edited by semi-technical staff, no plugin needed
// ---------------------------------------------------------------------------

add_action( 'add_meta_boxes', function () {
	add_meta_box(
		'tvgf_glacier_dialogue_details',
		'Dialogue Details',
		'tvgf_render_glacier_dialogue_meta_box',
		'glacier_dialogue',
		'side',
		'high'
	);
} );

function tvgf_render_glacier_dialogue_meta_box( $post ) {
	wp_nonce_field( 'tvgf_save_glacier_dialogue_meta', 'tvgf_glacier_dialogue_nonce' );

	$date    = get_post_meta( $post->ID, 'dialogue_date', true );
	$speaker = get_post_meta( $post->ID, 'speaker_name', true );
	$video   = get_post_meta( $post->ID, 'video_link', true );
	?>
	<p>
		<label for="tvgf_dialogue_date"><strong>Dialogue Date</strong></label><br>
		<input type="date" id="tvgf_dialogue_date" name="tvgf_dialogue_date"
			value="<?php echo esc_attr( $date ); ?>" style="width:100%" required>
	</p>
	<p>
		<label for="tvgf_speaker_name"><strong>Speaker(s)</strong></label><br>
		<input type="text" id="tvgf_speaker_name" name="tvgf_speaker_name"
			value="<?php echo esc_attr( $speaker ); ?>" style="width:100%"
			placeholder="Dr Ashim Sattar &amp; Dr Mohd Farooq Azam">
	</p>
	<p>
		<label for="tvgf_video_link"><strong>Video Link</strong></label><br>
		<input type="url" id="tvgf_video_link" name="tvgf_video_link"
			value="<?php echo esc_attr( $video ); ?>" style="width:100%"
			placeholder="https://www.youtube.com/watch?v=...">
	</p>
	<p style="color:#666;font-size:12px;">
		Also set a Featured Image (used as the listing card image) and assign one or
		more Topics — both appear further down/in the sidebar.
	</p>
	<?php
}

add_action( 'save_post_glacier_dialogue', function ( $post_id ) {
	if ( ! isset( $_POST['tvgf_glacier_dialogue_nonce'] ) ||
		! wp_verify_nonce( $_POST['tvgf_glacier_dialogue_nonce'], 'tvgf_save_glacier_dialogue_meta' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	if ( isset( $_POST['tvgf_dialogue_date'] ) ) {
		update_post_meta( $post_id, 'dialogue_date', sanitize_text_field( $_POST['tvgf_dialogue_date'] ) );
	}
	if ( isset( $_POST['tvgf_speaker_name'] ) ) {
		update_post_meta( $post_id, 'speaker_name', sanitize_text_field( $_POST['tvgf_speaker_name'] ) );
	}
	if ( isset( $_POST['tvgf_video_link'] ) ) {
		update_post_meta( $post_id, 'video_link', esc_url_raw( $_POST['tvgf_video_link'] ) );
	}
}, 10, 1 );

// ---------------------------------------------------------------------------
// Flatten the three meta fields directly onto the GraphQL GlacierDialogue type
// ---------------------------------------------------------------------------

add_action( 'graphql_register_types', function () {
	if ( ! function_exists( 'register_graphql_field' ) ) {
		return;
	}

	register_graphql_field( 'GlacierDialogue', 'dialogueDate', [
		'type'        => 'String',
		'description' => 'ISO 8601 date of the dialogue/event (YYYY-MM-DD).',
		'resolve'     => function ( $post ) {
			return get_post_meta( $post->ID, 'dialogue_date', true );
		},
	] );

	register_graphql_field( 'GlacierDialogue', 'speakerName', [
		'type'        => 'String',
		'description' => 'Lead speaker(s), shown on the listing card.',
		'resolve'     => function ( $post ) {
			return get_post_meta( $post->ID, 'speaker_name', true );
		},
	] );

	register_graphql_field( 'GlacierDialogue', 'videoLink', [
		'type'        => 'String',
		'description' => 'External video URL (e.g. YouTube), used for the "Watch Video" button.',
		'resolve'     => function ( $post ) {
			return get_post_meta( $post->ID, 'video_link', true );
		},
	] );
} );

// ---------------------------------------------------------------------------
// Preview link -> Next.js draft-mode route (signed with TVGF_PREVIEW_SECRET)
// ---------------------------------------------------------------------------

add_filter( 'preview_post_link', function ( $link, $post ) {
	if ( ! $post || $post->post_type !== 'glacier_dialogue' ) {
		return $link;
	}

	$nextjs_url = defined( 'TVGF_NEXTJS_URL' ) ? TVGF_NEXTJS_URL : '';
	$secret     = defined( 'TVGF_PREVIEW_SECRET' ) ? TVGF_PREVIEW_SECRET : '';
	if ( ! $nextjs_url || ! $secret ) {
		return $link;
	}

	return add_query_arg(
		[
			'secret' => $secret,
			'slug'   => $post->post_name,
		],
		rtrim( $nextjs_url, '/' ) . '/api/draft'
	);
}, 10, 2 );

// ---------------------------------------------------------------------------
// "View Post" link (published posts) -> the real Next.js page, not the
// WordPress theme. preview_post_link above only fires for drafts/unsaved
// changes — once a post is published, WordPress uses the plain permalink for
// the editor's "View Post" link instead, which without this filter would
// point at WordPress's own (soon-to-be-blocked, see below) front-end.
// ---------------------------------------------------------------------------

add_filter( 'post_type_link', function ( $link, $post ) {
	if ( ! $post || $post->post_type !== 'glacier_dialogue' ) {
		return $link;
	}

	$nextjs_url = defined( 'TVGF_NEXTJS_URL' ) ? TVGF_NEXTJS_URL : '';
	if ( ! $nextjs_url ) {
		return $link;
	}

	return rtrim( $nextjs_url, '/' ) . '/glacierDialgoues/' . $post->post_name;
}, 10, 2 );

// ---------------------------------------------------------------------------
// Headless lockdown: redirect any normal front-end request to wp-admin.
// WordPress's own theme should never be publicly browsable — only the REST
// API, GraphQL, and wp-admin/wp-login need to stay reachable. Static files
// (Media Library uploads) are served directly by the webserver and never
// reach this hook at all, so nothing needs to be special-cased for those.
// ---------------------------------------------------------------------------

add_action( 'template_redirect', function () {
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return;
	}

	$uri = $_SERVER['REQUEST_URI'] ?? '';
	if ( strpos( $uri, '/graphql' ) === 0 || strpos( $uri, '/wp-json' ) === 0 ) {
		return;
	}

	wp_safe_redirect( admin_url(), 302 );
	exit;
} );

// ---------------------------------------------------------------------------
// Revalidation webhook: tell Next.js to refresh its cache for this dialogue
// ---------------------------------------------------------------------------

function tvgf_trigger_revalidate( $post ) {
	if ( ! $post || $post->post_type !== 'glacier_dialogue' ) {
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
				'slug'   => $post->post_name,
			] ),
		]
	);
}

// Fires on every save (draft edits included) — harmless, keeps published data fresh.
add_action( 'save_post_glacier_dialogue', function ( $post_id, $post ) {
	tvgf_trigger_revalidate( $post );
}, 20, 2 );

// Also fires specifically when a scheduled-future post goes live via WP-Cron,
// which save_post_glacier_dialogue alone would miss.
add_action( 'transition_post_status', function ( $new_status, $old_status, $post ) {
	if ( $new_status === 'publish' && $old_status !== 'publish' ) {
		tvgf_trigger_revalidate( $post );
	}
}, 10, 3 );
