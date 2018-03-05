<?php
/**
 * MapCategory.php
 *
 * @package colbycomms/wp-maps
 */

namespace ColbyComms\Maps\MapFeatureType;

use ColbyComms\Maps\MapTaxonomy\MapTaxonomy;
use ColbyComms\Maps\MapFeature\MapFeature;

/**
 * Handles the map taxonomy.
 */
class MapFeatureType extends MapTaxonomy {
	const TAXONOMY_NAME = 'feature-type';
	const TAXONOMY_ARGS = [
		'hierarchical' => true,
		'show_in_rest' => true,
		'show_admin_column' => true,
		'rest_controller_class' => 'WP_REST_Terms_Controller',
		'meta_box_cb' => [ __CLASS__, 'meta_box_cb' ],
	];

	/**
	 * Registers hooks.
	 */
	public function __construct() {
		new MapFeatureTypeMeta();

		add_action( 'init', [ __CLASS__, 'register_taxonomy' ] );
		add_action( 'save_post_' . MapFeature::POST_TYPE_NAME, [ __CLASS__, 'save_map_selection' ] );
	}

	/**
	 * Generates the metabox callback for this taxonomy.
	 *
	 * @return void
	 */
	public static function meta_box_cb() {
		$terms = get_terms( static::TAXONOMY_NAME, [ 'hide_empty' => false ] );

		$post = get_post();
		$map = wp_get_object_terms(
			$post->ID, static::TAXONOMY_NAME, [
				'orderby' => 'term_id',
				'order' => 'ASC',
			]
		);

		$term_id = '';
		if ( ! is_wp_error( $map ) ) {
			if ( isset( $map[0] ) && isset( $map[0]->term_id ) ) {
				$term_id = $map[0]->term_id;
			}
		}

		foreach ( $terms as $term ) {
			$feature_type = MapFeatureTypeMeta::get(
				$term->term_id,
				MapFeatureTypeMeta::MAP_FEATURE_TYPE_META_KEY
			);

		?>
			<label title='<?php echo esc_attr( $term->name ); ?>'>
				<input type="radio"
					data-feature-type-select
					data-feature-type-value="<?php echo esc_attr( $feature_type ); ?>"
					name="<?php echo static::TAXONOMY_NAME; ?>"
					value="<?php echo $term->term_id; ?>"
					<?php checked( $term->term_id, $term_id ); ?>>
				<span><?php echo "{$term->name} ($feature_type)"; ?></span>
			</label><br>
		<?php
		}

		echo '<p><a href=' . self::get_new_link() . '>
			Create new ' . str_replace( '-', ' ', static::TAXONOMY_NAME ) . '
			</a></p>';
	}
}
