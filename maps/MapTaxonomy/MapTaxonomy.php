<?php
/**
 * MapTaxonomy.php
 *
 * @package colbycomms/wp-maps
 */

namespace ColbyComms\Maps\MapTaxonomy;

use ColbyComms\Maps\MapFeature\MapFeature;

/**
 * Handles the map taxonomy.
 */
class MapTaxonomy {
	const CATEGORY_NAME = 'map';
	const CATEGORY_ARGS = [
		'hierarchical' => true,
		'show_in_rest' => true,
		'show_admin_column' => true,
		'rest_controller_class' => 'WP_REST_Terms_Controller',
		'rest_base' => 'maps',
		'meta_box_cb' => [ __CLASS__, 'meta_box_cb' ],
	];

	/**
	 * Registers hooks.
	 */
	public function __construct() {
		new MapTaxonomyMeta();

		add_action( 'init', [ __CLASS__, 'register_taxonomy' ] );
		add_action( 'save_post_' . MapFeature::POST_TYPE_NAME, [ __CLASS__, 'save_map_selection' ] );
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
			self::CATEGORY_NAME,
			MapFeature::POST_TYPE_NAME,
			array_merge(
				self::get_taxonomy_label_args( ucfirst( self::CATEGORY_NAME ) ),
				self::CATEGORY_ARGS
			)
		);
	}

	/**
	 * Returns a link to create a new term.
	 *
	 * @return string The link.
	 */
	public static function get_new_link() {
		return get_bloginfo( 'url' )
			. '/wp-admin/edit-tags.php?taxonomy='
			. self::CATEGORY_NAME . '&post_type='
			. MapFeature::POST_TYPE_NAME;
	}

	/**
	 * Generates the metabox callback for this taxonomy.
	 *
	 * @return void
	 */
	public static function meta_box_cb() {
		$terms = get_terms( self::CATEGORY_NAME, [ 'hide_empty' => false ] );

		$post = get_post();
		$map = wp_get_object_terms(
			$post->ID, self::CATEGORY_NAME, [
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
		?>
			<label title='<?php echo esc_attr( $term->name ); ?>'>
				<input type="radio"
					data-term-radio
					data-position="<?php echo esc_attr( MapTaxonomyMeta::get( $term->term_id, MapTaxonomyMeta::MAP_POSITION_META_KEY ) ); ?>"
					name="<?php echo self::CATEGORY_NAME; ?>"
					value="<?php echo $term->term_id; ?>"
					<?php checked( $term->term_id, $term_id ); ?>>
				<span><?php echo $term->name; ?></span>
			</label><br>
		<?php
		}

		echo '<p><a href=' . self::get_new_link() . '>
			Create new map
			</a></p>';
	}

	/**
	 * Saves the term to th epost.
	 *
	 * @param string|int $post_id The post ID.
	 * @return void
	 */
	public static function save_map_selection( $post_id ) {
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		if ( ! isset( $_POST[ self::CATEGORY_NAME ] ) ) {
			return;
		}

		$map = sanitize_text_field( $_POST[ self::CATEGORY_NAME ] );

		// A valid map is required, so don't let this get published without one.
		if ( empty( $map ) ) {
			// Unhook this function so it doesn't loop infinitely.
			remove_action( 'save_post_' . MapFeature::POST_TYPE_NAME, [ __CLASS__, 'save_map_selection' ] );
			$postdata = array(
				'ID'          => $post_id,
				'post_status' => 'draft',
			);
			wp_update_post( $postdata );
			return;
		}

		$term = get_term_by( 'id', $map, self::CATEGORY_NAME );
		if ( ! empty( $term ) && ! is_wp_error( $term ) ) {
			wp_set_object_terms( $post_id, $term->term_id, self::CATEGORY_NAME, false );
		}
	}
}
