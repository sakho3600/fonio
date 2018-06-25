import React from 'react';
import PropTypes from 'prop-types';
import {
  Button
} from 'quinoa-design-library/components';

import {translateNameSpacer} from '../../helpers/translateUtils';

const AssetButton = ({
  onClick,
  active
}, {t}) => {
  const translate = translateNameSpacer(t, 'Component.SectionEditor');
  return (
    <Button
      isRounded
      isColor={active && 'info'}
      onClick={onClick}
      data-tip={translate('add an element from your library')}>
      Asset
    </Button>
  );
};

AssetButton.contextTypes = {
  t: PropTypes.func
};

export default AssetButton;