/**
 * Imports Libraries
 */
import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'axios';
import ReactTooltip from 'react-tooltip';
import {
  Button,
  Navbar,
  StretchedLayoutContainer,
  StretchedLayoutItem,
} from 'quinoa-design-library/components/';
import icons from 'quinoa-design-library/src/themes/millet/icons';

/**
 * Imports Project utils
 */
import { translateNameSpacer } from '../../../helpers/translateUtils';
import downloadFile from '../../../helpers/fileDownloader';
import {
  bundleProjectAsJSON,
} from '../../../helpers/projectBundler';
import {
  abbrevString
} from '../../../helpers/misc';

/**
 * Imports Components
 */
import LanguageToggler from '../../../components/LanguageToggler';
import IdentificationModal from '../../../components/IdentificationModal';
import ExportModal from '../../../components/ExportModal';

/**
 * Imports Assets
 */
import config from '../../../config';

const EditionUiWrapperLayout = ( {
  userId,
  userInfo,
  activeUsers,
  userInfoTemp,
  userInfoModalOpen,
  exportModalOpen,
  editedStory = {},
  lockingMap = {},
  sectionId,
  navLocation,
  navbarOpen,
  lang,
  actions: {
    setUserInfoTemp,
    setUserInfoModalOpen,
    setExportModalOpen,
    createUser,
    setUserInfo,
    toggleNavbarOpen,
  },
  children,
  activeSectionTitle = '',
}, {
  t
} ) => {
  const translate = translateNameSpacer( t, 'Features.EditionUiWrapper' );

  const storyId = editedStory.id;

  const lockMap = lockingMap[storyId] && lockingMap[storyId].locks || {};
  const userLockedOnDesignId = Object.keys( lockMap ).find( ( thatUserId ) => lockMap[thatUserId].design );
  let designStatus;
  let designMessage;
  if ( userLockedOnDesignId === userId ) {
    designStatus = 'active';
    designMessage = translate( 'edited by you' );
  }
  else if ( userLockedOnDesignId && activeUsers[userLockedOnDesignId] ) {
    const userLockedOnDesignInfo = activeUsers[userLockedOnDesignId];
    designStatus = 'locked';
    designMessage = translate( 'edited by {n}', { n: userLockedOnDesignInfo.name } );
  }
  else {
    designStatus = 'open';
    designMessage = translate( 'open to edition' );
  }

  const handleSubmitUserInfo = () => {
    createUser( {
      ...userInfoTemp,
      userId
    } );
    setUserInfo( userInfoTemp );
    setUserInfoModalOpen( false );
  };

  /**
   * @todo turn to a temp variable
   */
  const computeTitle = () => {
    if ( editedStory && editedStory.metadata && editedStory.metadata.title ) {
      return abbrevString( editedStory.metadata.title, 25 );
    }
    else return translate( 'Unnamed story' );
  };

  /**
   * @todo move to container
   */
  const exportToFile = ( type ) => {
    const title = editedStory.metadata.title;
    // @todo: handle failure error in UI
    const onRejection = ( e ) => console.error( e );/* eslint no-console : 0 */
    switch ( type ) {
      case 'json':
        get( `${config.restUrl}/stories/${storyId}?edit=false&&format=json` )
        .then( ( { data } ) => {
          if ( data ) {
            const JSONbundle = bundleProjectAsJSON( data );
            downloadFile( JSONbundle, 'json', title );
            setExportModalOpen( false );
          }
          else {
            onRejection( 'no data retrieved' );
          }
        } )
        .catch( onRejection );
        break;
      case 'html':
        get( `${config.restUrl}/stories/${storyId}?edit=false&&format=html&&locale=${lang}` )
        .then( ( { data } ) => {
          if ( data ) {
            downloadFile( data, 'html', title );
            setExportModalOpen( false );
          }
          else {
            onRejection( 'no data retrieved' );
          }
        } )
        .catch( onRejection );
        break;
      default:
        break;
    }
  };

  let realActiveSectionTitle;
  if ( activeSectionTitle.length ) {
    realActiveSectionTitle = activeSectionTitle.length > 10 ? `${activeSectionTitle.substr( 0, 10 ) }...` : activeSectionTitle;
  }
  else {
    realActiveSectionTitle = translate( 'Untitled section' );
  }

  const onOpenExportModal = () => setExportModalOpen( true );
  const onCloseExportModal = () => setUserInfoModalOpen( false );

  return (
    <StretchedLayoutContainer isAbsolute>
      <Navbar
        brandImage={ icons.fonioBrand.svg }
        brandUrl={ '/' }
        isOpen={ navbarOpen === true }
        onToggle={ toggleNavbarOpen }
        style={ { zIndex: 2000 } }

        locationBreadCrumbs={ [
            {
              href: '/',
              isActive: false,
              content: `${translate( 'Home' )}`,
            },
            {
              href: `/story/${storyId}`,
              content: computeTitle()
              || translate( 'Unnamed story' ),
              isActive: navLocation === 'summary'
            },
          ] }

        menuOptions={ [
            // link to summary view
            {
              href: `/story/${storyId}`,
              isActive: navLocation === 'summary',
              content: `${translate( 'Overview' )}`,
            },
            // inactive section marker if  in section
            navLocation === 'editor' ?
            {
              isActive: true,
              content: `/ ${realActiveSectionTitle}`,
              href: `/story/${storyId}/section/${sectionId}`,
            }
            : undefined,
            // link to livrary view
            {
              href: `/story/${storyId}/library`,
              isActive: navLocation === 'library',
              content: translate( 'Library' ),
            },
            // link to design view
            {
              href: `/story/${storyId}/design`,
              isActive: navLocation === 'design',
              content: translate( 'Design' ),
              lockStatus: designStatus,
              statusMessage: designMessage
            },
          ].filter( ( d ) => d ) }
        actionOptions={ [ {
            content: (
              <Button
                onClick={ onOpenExportModal }
                className={ 'button' }
              >
                {translate( 'Export' )}
              </Button>
            )
          },
          {
            content: <LanguageToggler />
          } ] }
        onProfileClick={ onOpenExportModal }
        profile={ {
            imageUri: userInfo && require( `../../../sharedAssets/avatars/${userInfo.avatar}` ),
            nickName: userInfo && userInfo.name
          } }
      />
      <StretchedLayoutItem
        isFlex={ 1 }
        isFlowing
      >
        {children}
      </StretchedLayoutItem>
      <IdentificationModal
        isActive={ userInfoModalOpen }

        userInfo={ userInfoTemp }

        onChange={ setUserInfoTemp }
        onClose={ onCloseExportModal }
        onSubmit={ handleSubmitUserInfo }
      />
      <ExportModal
        isActive={ exportModalOpen }
        onClose={ onCloseExportModal }
        onChange={ exportToFile }
      />
      <ReactTooltip id={ 'tooltip' } />
    </StretchedLayoutContainer>
  );
};

EditionUiWrapperLayout.contextTypes = {
  t: PropTypes.func,
};

export default EditionUiWrapperLayout;
