import PropTypes from 'prop-types';

import { NAV_TYPES } from 'util/constants';

export const typePropType = PropTypes.oneOf([
  NAV_TYPES.AGENT,
  NAV_TYPES.COMPONENT,
  NAV_TYPES.SERVICE,
]);
