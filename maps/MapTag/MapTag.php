<?php
/**
 * MapTag.php
 *
 * @package colbycomms/wp-maps
 */

namespace ColbyComms\Maps\MapTag;

use ColbyComms\Maps\MapFeature\MapFeature;

/**
 * Handles the map TAG taxonomy.
 */
class MapTag {
	const TAXONOMY_NAME = 'map-tag';
	const TAXONOMY_ARGS = [
		'hierarchical' => false,
		'show_in_rest' => true,
		'show_admin_column' => true,
		'rest_controller_class' => 'WP_REST_Terms_Controller',
	];

	/**
	 * Registers hooks.
	 */
	public function __construct() {
		add_action( 'init', [ __CLASS__, 'register_taxonomy' ] );
	}

	/**
	 * Generate labels array for specified taxonomy.
	 *
	 * @param string $taxonomy Name of the taxonomy.
	 */
	private static function get_taxonomy_label_args( $taxonomy ) {
		return [
			'labels'       => [
				'name'          => "{$taxonomy}s",
				'singular_name' => $taxonomy,
				'add_new_item'  => "Add New {$taxonomy}",
				'search_items'  => "Search {$taxonomy}s",
			],
		];
	}

	/**
	 * Adds the taxonomy.
	 */
	public static function register_taxonomy() {
		register_taxonomy(
			self::TAXONOMY_NAME,
			MapFeature::POST_TYPE_NAME,
			array_merge(
				self::get_taxonomy_label_args( ucwords( str_replace( '-', ' ', self::TAXONOMY_NAME ) ) ),
				self::TAXONOMY_ARGS
			)
		);
	}
}
