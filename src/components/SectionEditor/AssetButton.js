import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Image
} from 'quinoa-design-library/components';

import {translateNameSpacer} from '../../helpers/translateUtils';

import IconBtn from '../IconBtn';

import icons from 'quinoa-design-library/src/themes/millet/icons';

const AssetButton = ({
  onClick,
  active
}, {t}) => {
  const translate = translateNameSpacer(t, 'Component.SectionEditor');
  const onMouseDown = event => event.preventDefault();

  return (
    <IconBtn
      isColor={active && 'warning'}
      onMouseDown={onMouseDown}
      onClick={onClick}
      dataTip={translate('add an element from your library')}
      src={icons.asset.black.svg} />
  );
};

AssetButton.contextTypes = {
  t: PropTypes.func
};

export default AssetButton;
