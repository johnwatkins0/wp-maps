import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { STYLE_VARIABLES } from '../../constants';

const StyledButton = styled.button`
  position: relative;
  display: block;
  width: 100%;
  padding: 0.375rem;
  border-radius: 0;
  font-size: 1rem;
  font-weight: ${({ active }) => (active ? '600' : '400')};
  border: none;
  cursor: pointer;
  text-align: left;

  &:focus {
    z-index: 555;
  }
`;

export const Feature = ({ onClick, active, title, id }) => (
  <StyledButton
    active={active}
    onClick={() => onClick(id)}
    dangerouslySetInnerHTML={{ __html: title.rendered }}
  />
);

Feature.propTypes = {
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  title: PropTypes.objectOf(PropTypes.string).isRequired,
  id: PropTypes.number.isRequired,
};
