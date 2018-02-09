<?php
/**
 * Feature.php
 *
 * @package colbycomms/wp-maps
 */

namespace ColbyComms\Maps\MapFeature;

/**
 * Handles the feature post type.
 */
class MapFeature {
	const POST_TYPE_NAME = 'map-feature';
	const POST_TYPE_SETTINGS = [
		'label' => 'Map Features',
		'labels' => [
			'singular_name' => 'Map Feature',
		],
		'show_ui' => true,
		'show_in_rest' => true,
	];

	/**
	 * Adds hooks.
	 */
	public function __construct() {
		add_action( 'init', [ __CLASS__, 'register_post_type' ] );
	}

	/**
	 * Registers the post type.
	 *
	 * @return void
	 */
	public static function register_post_type() {
		register_post_type( self::POST_TYPE_NAME, self::POST_TYPE_SETTINGS );
	}
}
