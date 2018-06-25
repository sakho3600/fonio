import React from 'react';
import PropTypes from 'prop-types';
import {
  Button
} from 'quinoa-design-library/components';

import {translateNameSpacer} from '../../helpers/translateUtils';

const NoteButton = ({
  onClick,
  active
}, {t}) => {
  const translate = translateNameSpacer(t, 'Component.SectionEditor');
  return (
    <Button
      isRounded
      isColor={active && 'info'}
      onClick={onClick}
      data-tip={translate('add a footnote')}>
      Note
    </Button>
  );
};


NoteButton.contextTypes = {
  t: PropTypes.func
};

export default NoteButton;