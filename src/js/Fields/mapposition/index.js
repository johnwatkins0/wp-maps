/**
 * The external dependencies.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, setStatic } from 'recompose';

/**
 * The internal dependencies.
 */
import Field from 'fields/components/field';
import withStore from 'fields/decorators/with-store';
import withSetup from 'fields/decorators/with-setup';
import Map from './Map';

/**
 * Render a number input field.
 *
 * @param  {Object}        props
 * @param  {String}        props.name
 * @param  {Object}        props.field
 * @param  {Function}      props.handleChange
 * @return {React.Element}
 */
export const MapPosition = ({ name, field, handleChange }) => {
  return (
    <Field field={field}>
      <input
        type="hidden"
        name={`${name}`}
        value={JSON.stringify(field.value)}
        disabled={!field.ui.is_visible}
        readOnly
      />

      <Map field={field} onChange={handleChange} />
    </Field>
  );
};

/**
 * Validate the props.
 *
 * @type {Object}
 */
MapPosition.propTypes = {
  name: PropTypes.string,
  field: PropTypes.objectOf(PropTypes.any),
  handleChange: PropTypes.func,
};

/**
 * The enhancer.
 *
 * @type {Function}
 */
export const enhance = compose(
  /**
   * Connect to the Redux store.
   */
  withStore(),

  /**
   * Attach the setup hooks.
   */
  withSetup(),

  /**
   * Pass some handlers to the component.
   */
  withHandlers({
    handleChange: ({ field, setFieldValue }) => data => {
      setFieldValue(field.id, data);
    },
  })
);

export default setStatic('type', ['mapposition'])(enhance(MapPosition));
