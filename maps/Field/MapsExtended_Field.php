<?php
/**
 * Carbon Fields field extension providing a map with multiple feature options.
 *
 * @package colbycomms\wp-maps
 */

namespace ColbyComms\Maps\Field;

use Carbon_Fields\Field\Field;

/**
 * See Field/Field in Carbon_Fields for documentation.
 */
class MapsExtended_Field extends Field {
	const NAME = 'MapsExtended';

	/**
	 * Enqueues scripts and styles in admin.
	 */
	public static function admin_enqueue_scripts() {
		wp_enqueue_style(
			'leaflet',
			'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css'
		);
		wp_enqueue_style(
			'leaflet-draw',
			'https://unpkg.com/leaflet-draw@1.0.2/dist/leaflet.draw.css',
			[ 'leaflet' ]
		);

		$root_uri = plugin_dir_url( dirname( __DIR__, 2 ) . '/index.php' );

		wp_enqueue_script(
			'leaflet',
			'https://unpkg.com/leaflet@1.3.1/dist/leaflet-src.js'
		);

		wp_enqueue_script(
			'leaflet-draw',
			$root_uri . '/src/js/Fields/mapfield/draw.js', // 'https://unpkg.com/leaflet-draw@1.0.2/dist/leaflet.draw-src.js',
			[ 'leaflet' ]
		);

		wp_enqueue_script(
			strtolower( self::NAME ),
			"{$root_uri}/dist/" . strtolower( self::NAME ) . '.js',
			[ 'carbon-fields-boot', 'leaflet', 'leaflet-draw' ]
		);

	}

	/**
	 * Returns an array that holds the field data, suitable for JSON representation.
	 *
	 * @param bool $load  Should the value be loaded from the database.
	 * @return array
	 */
	public function to_json( $load ) {
		$field_data = parent::to_json( $load );

		// The value is JSON.stringified on the way in.
		if ( isset( $field_data['value'] ) ) {
			$field_data['value'] = json_decode( $field_data['value'] );
		}

		return $field_data;
	}
}
