<?php
/**
 * MapFeatureMeta.php
 *
 * @package colbycomms/wp-maps
 */

namespace ColbyComms\Maps\MapCategory;

use Carbon_Fields\{Field, Container};
use Carbon_Fields\Helper\Helper;

/**
 * Handles post meta for the map-feature post type.
 */
class MapCategoryMeta {
	const MAP_POSITION_META_KEY = 'colbycomms__maps__map_data';

	/**
	 * Constructor function; add all hooks.
	 */
	public function __construct() {
		add_action(
			'carbon_fields_register_fields',
			[ $this, 'register_details_meta_box' ]
		);
		add_action(
			'carbon_fields_register_fields',
			[ $this, 'register_fields' ]
		);
	}
	/**
	 * Creates the box that will contain meta fields.
	 */
	public function register_details_meta_box() {
		$this->details_box = Container::make( 'term_meta', 'Map Position' )
			->where( 'term_taxonomy', '=', MapCategory::TAXONOMY_NAME );
	}
	/**
	 * Provides an array of fields to add.
	 *
	 * @return array The fields.
	 */
	public static function get_fields() {
		return [
			Field::make( 'mapposition', self::MAP_POSITION_META_KEY, 'Map' )
				->set_visible_in_rest_api(),
		];
	}

	/**
	 * Adds the location field to the details box.
	 */
	public function register_fields() {
		$this->details_box->add_fields( self::get_fields() );
	}

	public static function get( $id, $key ) {
		return Helper::get_term_meta( $id, $key );
	}
}
