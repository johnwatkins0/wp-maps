<?php
/**
 * MapTaxonomy.php
 * 
 * @package colby-comms/wp-maps
 */

namespace ColbyComms\Maps\MapTaxonomy;

use ColbyComms\Maps\MapFeature\MapFeature;

/**
 * An abstract class for taxonomies to inherit from.
 */
abstract class MapTaxonomy {
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
			static::TAXONOMY_NAME,
			MapFeature::POST_TYPE_NAME,
			array_merge(
				static::get_taxonomy_label_args( ucwords( str_replace( '-', ' ', static::TAXONOMY_NAME ) ) ),
				static::TAXONOMY_ARGS
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
			. static::TAXONOMY_NAME . '&post_type='
			. MapFeature::POST_TYPE_NAME;
	}

	/**
	 * Generates the metabox callback for this taxonomy.
	 *
	 * @return void
	 */
	abstract public static function meta_box_cb();

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

		if ( ! isset( $_POST[ static::TAXONOMY_NAME ] ) ) {
			return;
		}

		$map = sanitize_text_field( $_POST[ static::TAXONOMY_NAME ] );

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

		$term = get_term_by( 'id', $map, static::TAXONOMY_NAME );
		if ( ! empty( $term ) && ! is_wp_error( $term ) ) {
			wp_set_object_terms( $post_id, $term->term_id, static::TAXONOMY_NAME, false );
		}
	}
}