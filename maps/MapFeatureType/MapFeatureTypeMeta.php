<?php
/**
 * MapFeatureMeta.php
 *
 * @package colbycomms/wp-maps
 */

namespace ColbyComms\Maps\MapFeatureType;

use Carbon_Fields\{Field, Container};
use Carbon_Fields\Helper\Helper;

/**
 * Handles post meta for the map-feature post type.
 */
class MapFeatureTypeMeta {
	const MAP_FEATURE_TYPE_META_KEY = 'colbycomms__maps__map_feature_type';
	const FEATURE_COLOR_KEY = 'colbycomms__maps__feature_color';

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
		$this->details_box = Container::make( 'term_meta', 'Map Feature Type Settings' )
			->where( 'term_taxonomy', '=', MapFeatureType::TAXONOMY_NAME );
	}
	/**
	 * Provides an array of fields to add.
	 *
	 * @return array The fields.
	 */
	public static function get_fields() {
		return [
			Field::make( 'radio', self::MAP_FEATURE_TYPE_META_KEY, 'Feature Type' )
				->add_options(
					[
						'marker' => 'Marker: A marker for a single point.',
						'circlemarker' => 'Circular Marker: A small, fixed-size circle marker',
						'circle' => 'Circle: A circle of adjustable size.',
						'polygon' => 'Polygon: A shape with a variable number of straight sides.',
						'rectangle' => 'Rectangle: A rectangle of adjustable size.',
						'polyline' => 'Line: A line made of one or more segments.',
					]
				)
				->set_visible_in_rest_api(),

			Field::make( 'color', self::FEATURE_COLOR_KEY, 'Feature Color' )
				->set_conditional_logic(
					[
						[
							'field' => self::MAP_FEATURE_TYPE_META_KEY,
							'compare' => 'IN',
							'value' => [
								'circlemarker',
								'circle',
								'polygon',
								'rectangle',
								'polyline'
							]
						]
					]
				)
				->set_default_value( '#002878' )
				->set_visible_in_rest_api()
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
