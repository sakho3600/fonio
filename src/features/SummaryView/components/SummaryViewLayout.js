import React from 'react';
import PropTypes from 'prop-types';

import {arrayMove} from 'react-sortable-hoc';

import {v4 as genId} from 'uuid';

import {
  Button,
  Column,
  Columns,
  Delete,
  Container,
  Content,
  Collapsable,
  Icon,
  Image,
  Help,
  Level,
  LevelItem,
  LevelLeft,
  StatusMarker,
  Title,
} from 'quinoa-design-library/components/';


import MetadataForm from '../../../components/MetadataForm';
import NewSectionForm from '../../../components/NewSectionForm';

import SortableSectionsList from './SortableSectionsList';

import {translateNameSpacer} from '../../../helpers/translateUtils';
import {createDefaultSection} from '../../../helpers/schemaUtils';

const SummaryViewLayout = ({
  editedStory,
  lockingMap = {},
  activeUsers,
  userId,

  metadataOpen,
  newSectionOpen,

  actions: {
    enterBlock,
    leaveBlock,
    updateStoryMetadata,
    setNewSectionOpen,
    setTempSectionToCreate,
    setTempSectionsOrder,
    setTempSectionIdToDelete,
  },
  goToSection
}, {t}) => {


  const translate = translateNameSpacer(t, 'Features.SummaryView');

  const {
    metadata: {
      title,
      subtitle,
      authors,
      abstract
    },
    sections,
    sectionsOrder,
    id,
  } = editedStory;

  const sectionsList = sectionsOrder.map(sectionId => sections[sectionId]);

  const reverseSectionLockMap = lockingMap[id] && lockingMap[id].locks ?
     Object.keys(lockingMap[id].locks)
      .reduce((result, thatUserId) => {
        const userSectionLock = lockingMap[id].locks[thatUserId].sections;
        if (userSectionLock) {
          return {
            ...result,
            [userSectionLock.blockId]: {
              ...activeUsers[userSectionLock.userId]
            }
          };
        }
        return result;
      }, {})
     : {};

  const storyActiveUsersIds = lockingMap[id] && lockingMap[id].locks ?
    Object.keys(lockingMap[id].locks)
    : [];

  const activeAuthors = lockingMap[id] && lockingMap[id].locks ?
    Object.keys(activeUsers)
      .filter(thatUserId => storyActiveUsersIds.indexOf(thatUserId) !== -1)
      .map(thatUserId => ({
        ...activeUsers[thatUserId],
        locks: lockingMap[id].locks[thatUserId]
      }))
      : [];

  const buildAuthorMessage = author => {
    const {name, locks = {}} = author;
    const lockNames = Object.keys(locks).filter(thatName => locks[thatName]);
    let message;
    if (lockNames.length === 1 && lockNames[0] === 'summary') {
      message = translate('{a} is here on the summary', {a: name});
    }
    else if (lockNames.length > 1) {
      const oLockNames = lockNames.filter(n => n !== 'summary');
      if (oLockNames.length === 1) {
        const lockName = oLockNames[0];
        if (lockName === 'sections') {
          const lock = locks[lockName];
          if (lock) {
            const sectionId = locks[lockName].blockId;
            const section = sections[sectionId];
            const sectionTitle = section.metadata.title;
            message = translate('{a} is working on section "{t}"', {a: name, t: sectionTitle});
          }
          else message = translate('{a} is working on a section', {a: name});
        }
        else if (lockName === 'storyMetadata') {
          message = translate('{a} is editing story settings', {a: name});
        }
        else message = translate('{a} is working on {l}', {a: name, l: oLockNames[0]});
      }
      else {
        message = translate('{a} is working on {l} and {n}', {a: name, l: lockNames[0], n: lockNames[1]});
      }
    }
    else {
      message = translate('{a} is nowhere, alone in the dark', {a: name});
    }
    return message;
  };

  const userLockedOnMetadataId = lockingMap[id] && lockingMap[id].locks &&
    Object.keys(lockingMap[id].locks)
      .find(thatUserId => lockingMap[id].locks[thatUserId].storyMetadata !== undefined);

  let metadataLockStatus;
  let metadataLockMessage;
  if (userLockedOnMetadataId) {
    if (userLockedOnMetadataId === userId) {
      metadataLockStatus = 'active';
      metadataLockMessage = translate('edited by you');
    }
    else {
      metadataLockStatus = 'locked';
      metadataLockMessage = translate('edited by {a}', {a: activeUsers[userLockedOnMetadataId].name});
    }
  }
   else {
    metadataLockStatus = 'open';
    metadataLockMessage = translate('open to edition');
  }


  const toggleMetadataEdition = () => {
    if (metadataOpen) {
      // leave metadata edition
      leaveBlock({
        storyId: id,
        userId,
        location: 'storyMetadata',
      });
    }
    else {
      // enter metadata edition
      enterBlock({
        storyId: id,
        userId,
        location: 'storyMetadata',
      });
    }
  };

  const onMetadataSubmit = ({payload: {metadata}}) => {
    const payload = {
      storyId: id,
      metadata
    };
    updateStoryMetadata(payload);
    toggleMetadataEdition();
  };

  const defaultSection = createDefaultSection();
  const defaultSectionMetadata = defaultSection.metadata;

  const onNewSectionSubmit = (metadata) => {
    const newSection = {
      ...defaultSection,
      metadata,
      id: genId()
    };

    setTempSectionToCreate(newSection);
    // get lock on sections order
    enterBlock({
      storyId: id,
      userId,
      location: 'sectionsOrder',
    });
  };

  const onSectionDelete = sectionId => {
    // make sure that section is not edited by another user to prevent bugs and inconsistencies
    // (in UI delete button should be disabled when section is edited, this is a supplementary safety check)
    if (!reverseSectionLockMap[sectionId]) {
      // store section to be deleted
      setTempSectionIdToDelete(sectionId);
      // get lock on sections order
      enterBlock({
        storyId: id,
        userId,
        location: 'sectionsOrder',
      });
    }
  };

  const onSortEnd = ({oldIndex, newIndex}) => {
    const sectionsIds = sectionsList.map(section => section.id);
    const newSectionsOrder = arrayMove(sectionsIds, oldIndex, newIndex);
    setTempSectionsOrder(newSectionsOrder);
    // get lock on sections order
    enterBlock({
      storyId: id,
      userId,
      location: 'sectionsOrder',
    });
  };

  return (
    <Container>
      <Columns>
        <Column isSize={'1/3'}>
          <Level>
            <Collapsable isCollapsed={metadataOpen}>
              <Title isSize={2}>
                {title}
              </Title>
              {subtitle && <Title isSize={5}>
                <i>{subtitle}</i>
                </Title>}
              {
                  authors.map((author, index) => (
                    <Level key={index}>
                      <LevelLeft>
                        <LevelItem>
                          <Icon isSize="small" isAlign="left">
                            <span className="fa fa-user" aria-hidden="true" />
                          </Icon>
                        </LevelItem>
                        <LevelItem>
                          {author}
                        </LevelItem>
                      </LevelLeft>
                    </Level>
                  ))
                }
              <Content>
                <i>{abstract}</i>
              </Content>
            </Collapsable>
          </Level>

          <Level isFullWidth>
            <Button
              isColor={metadataOpen ? 'primary' : 'info'}
              disabled={metadataLockStatus === 'locked'}
              onClick={toggleMetadataEdition}>
              <StatusMarker
                lockStatus={metadataLockStatus}
                statusMessage={metadataLockMessage} />
              {metadataOpen ?
                <Columns>
                  <Column>{translate('Close story settings')}</Column>
                  <Column><Delete onClick={toggleMetadataEdition} /></Column>
                </Columns>
                : translate('Edit story settings')
              }
            </Button>
          </Level>
          <Collapsable isCollapsed={!metadataOpen}>
            {metadataOpen && <MetadataForm
              story={editedStory}
              onSubmit={onMetadataSubmit}
              onCancel={toggleMetadataEdition} />}
          </Collapsable>
          <Level />
          <Level />
          <Level />
          {
            activeAuthors.length > 1 &&
              <Title isSize={4}>
                {translate('What are other authors doing ?')}
              </Title>
          }
          {
                activeAuthors
                .filter(a => a.userId !== userId)
                .map((author, authorIndex) => {
                  return (
                    <Level key={authorIndex}>
                      <LevelLeft>
                        <LevelItem>
                          <Image isRounded isSize="32x32" src={require(`../../../sharedAssets/avatars/${author.avatar}`)} />
                        </LevelItem>
                        <LevelItem>
                          <Help>
                            {buildAuthorMessage(author)}
                          </Help>
                        </LevelItem>
                      </LevelLeft>
                    </Level>
                  );
                })
              }
        </Column>
        {
          newSectionOpen ?
            <Column isSize={'2/3'}>
              <Title isSize={2}>
                <Columns>
                  <Column isSize={12}>
                    {translate('New section')}
                  </Column>
                  <Column>
                    <Delete onClick={() => setNewSectionOpen(false)} />
                  </Column>
                </Columns>
                <Level>
                  <NewSectionForm
                    metadata={{...defaultSectionMetadata}}
                    onSubmit={onNewSectionSubmit}
                    onCancel={() => setNewSectionOpen(false)} />
                </Level>
              </Title>

            </Column>
            :
            <Column isSize={'2/3'}>
              <Title isSize={2}>
                {translate('Summary')}
              </Title>
              <Level>
                <Column>
                  <Button onClick={() => setNewSectionOpen(true)} isFullWidth isColor="primary">
                    {translate('New section')}
                  </Button>
                </Column>
              </Level>
              <SortableSectionsList
                items={sectionsList}
                onSortEnd={onSortEnd}
                goToSection={goToSection}
                onDelete={onSectionDelete}
                reverseSectionLockMap={reverseSectionLockMap} />
            </Column>
        }

      </Columns>


    </Container>
    );
};

SummaryViewLayout.contextTypes = {
  t: PropTypes.func,
};

export default SummaryViewLayout;
