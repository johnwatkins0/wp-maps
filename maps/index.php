<?php
/**
 * Main plugin entry point.
 *
 * @package colby-comms/wp-maps
 */

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

use ColbyComms\Maps\Field\{MapsExtended_Field, MapPosition_Field};
use Carbon_Fields\Carbon_Fields;

define( 'Carbon_Field_MapsExtended\\DIR', dirname( __DIR__ ) );
define( 'Carbon_Field_MapPosition\\DIR', dirname( __DIR__ ) );

Carbon_Fields::extend(
	MapsExtended_Field::class, function( $container ) {
		return new MapsExtended_Field( $container['arguments']['type'], $container['arguments']['name'], $container['arguments']['label'] );
	}
);

Carbon_Fields::extend(
	MapPosition_Field::class, function( $container ) {
		return new MapPosition_Field( $container['arguments']['type'], $container['arguments']['name'], $container['arguments']['label'] );
	}
);

new ColbyComms\Maps\Maps();


if ( ! function_exists( 'pp' ) ) {
	function pp( $data, $die = 0 ) {
		ob_start();
		echo '<pre>';
		print_r( $data );
		echo '</pre>';
		if ( $die ) {
			wp_die( ob_get_clean() );
		} else {
			echo ob_get_clean();
		}
	}
}
