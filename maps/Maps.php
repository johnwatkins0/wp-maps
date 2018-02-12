<?php
/**
 * Main plugin class.
 *
 * @package colbycomms/wp-maps
 */

namespace ColbyComms\Maps;

/**
 * Plugin setup.
 */
class Maps {
	/**
	 * The text domain.
	 *
	 * @var string
	 */
	const TEXT_DOMAIN = 'wp-maps';

	/**
	 * Initiation.
	 */
	public function __construct() {
		new MapFeature\MapFeature();
		new MapFeature\MapFeatureMeta();
		new MapCategory\MapCategory();
		new MapTag\MapTag();
	}
}
