<?php
/**
 * Plugin Name: TVGF Glacier Blocks
 * Description: Custom Gutenberg blocks for Glacier Dialogue articles (Context Strip,
 *              Speaker Bio, Stat Tiles, Callout, Comparison). No build step required —
 *              plain JS registered against core WordPress packages already bundled
 *              with the block editor.
 *
 * Install as a regular plugin: upload the whole "tvgf-glacier-blocks" folder to
 * wp-content/plugins/, then activate "TVGF Glacier Blocks" from Plugins in wp-admin.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', function () {
	$blocks = [ 'context-strip', 'speaker-bio', 'stat-tiles', 'callout', 'comparison' ];

	foreach ( $blocks as $block ) {
		register_block_type( __DIR__ . '/blocks/' . $block );
	}
} );
