<?php
/**
 * MapFeatureMeta.php
 *
 * @package colbycomms/wp-maps
 */

namespace ColbyComms\Maps\MapFeature;

use Carbon_Fields\{Field, Container};

/**
 * Handles post meta for the map-feature post type.
 */
class MapFeatureMeta {
	const MAP_DATA_META_KEY = 'colbycomms__maps__map_data';

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
		$this->details_box = Container::make( 'post_meta', 'Feature Location' )
			->where( 'post_type', '=', 'map-feature' );
	}
	/**
	 * Provides an array of fields to add.
	 *
	 * @return array The fields.
	 */
	public static function get_fields() {
		return [
			Field::make( 'mapsextended', self::MAP_DATA_META_KEY, 'Map' ),
		];
	}

	/**
	 * Adds the location field to the details box.
	 */
	public function register_fields() {
		$this->details_box->add_fields( self::get_fields() );
	}
}
