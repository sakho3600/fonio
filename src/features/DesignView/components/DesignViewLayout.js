import React from 'react';

import {
  StretchedLayoutContainer,
} from 'quinoa-design-library/components';

import AsideDesignColumn from './AsideDesignColumn';
import MainDesignColumn from './MainDesignColumn';

const DesignViewLayout = ({
  designAsideTabMode,
  designAsideTabCollapsed,
  editedStory: story,
  referenceTypesVisible,
  actions: {
    setDesignAsideTabMode,
    setDesignAsideTabCollapsed,
    setReferenceTypesVisible,
  },
  onUpdateCss,
  onUpdateSettings,
}) => {
  return (
    <StretchedLayoutContainer isDirection="horizontal" isAbsolute>
      <AsideDesignColumn
        story={story}
        designAsideTabCollapsed={designAsideTabCollapsed}
        designAsideTabMode={designAsideTabMode}
        style={{minWidth: designAsideTabCollapsed ? undefined : '30%'}}
        className={`aside-edition-container ${designAsideTabCollapsed ? 'is-collapsed' : ''} is-hidden-mobile`}

        setDesignAsideTabMode={setDesignAsideTabMode}
        setDesignAsideTabCollapsed={setDesignAsideTabCollapsed}
        referenceTypesVisible={referenceTypesVisible}
        setReferenceTypesVisible={setReferenceTypesVisible}
        onUpdateCss={onUpdateCss}
        onUpdateSettings={onUpdateSettings} />

      <MainDesignColumn
        story={story} />
    </StretchedLayoutContainer>);
};
export default DesignViewLayout;
