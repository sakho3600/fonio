import React from 'react';
import PropTypes from 'prop-types';

import Textarea from 'react-textarea-autosize';

import {translateNameSpacer} from '../../../helpers/translateUtils';

import BigSelect from '../../../components/BigSelect/BigSelect';
import HelpPin from '../../../components/HelpPin/HelpPin';
import Toaster from '../../../components/Toaster/Toaster';
import DropZone from '../../../components/DropZone/DropZone';
import AssetPreview from '../../../components/AssetPreview/AssetPreview';
import BibRefsEditor from '../../../components/BibRefsEditor/BibRefsEditor';
import OptionSelect from '../../../components/OptionSelect/OptionSelect';

import './ResourceConfigurationDialog.scss';

const ResourceDataInput = ({
  type,
  submitResourceData,
  resourceCandidate
}, context) => {
  const translate = translateNameSpacer(context.t, 'Features.Editor');
  switch (type) {
    case 'table':
      const onCsvSubmit = (files) => submitResourceData('csvFile', files[0]);
      return (
        <DropZone
          onDrop={onCsvSubmit}>
          <div>
            <p>{translate('drop-a-csv-file-here')}</p>
          </div>
        </DropZone>
      );
    case 'video':
      const onVideoUrlSubmit = (e) => submitResourceData('videoUrl', e.target.value);
      return (
        <div className="input-group">
          <label htmlFor="title">{translate('url-of-the-video')}</label>
          <input
            onChange={onVideoUrlSubmit}
            type="text"
            name="url"
            placeholder={translate('url-of-the-video')}
            value={resourceCandidate.metadata.videoUrl} />
        </div>
      );
    case 'image':
      const onImageSubmit = (files) => submitResourceData('imageFile', files[0]);
      return (
        <DropZone
          onDrop={onImageSubmit}>
          <div>
            <p>{translate('drop-a-file-here')}</p>
          </div>
        </DropZone>
      );
    case 'data-presentation':
      const onPresentationSubmit = (files) => submitResourceData('dataPresentationFile', files[0]);
      return (
        <DropZone
          onDrop={onPresentationSubmit}>
          <div>
            <p>{translate('drop-a-file-here')}</p>
          </div>
        </DropZone>
      );
    case 'bib':
      const onBibTeXFileSubmit = (files) => submitResourceData('bibTeXFile', files[0]);

      const onRefsChange = refs => {
        submitResourceData('cslJSON', refs);
      };
      return (
        <div>
          <DropZone
            onDrop={onBibTeXFileSubmit}>
            <div>
              <p>{translate('drop-bibtex-here')}</p>
            </div>
          </DropZone>
          <BibRefsEditor
            references={resourceCandidate.data}
            onChange={onRefsChange} />
        </div>
      );
    case 'embed':
      const onEmbedSubmit = (evt) => submitResourceData('htmlCode', evt.target.value);
      return (
        <Textarea
          onChange={onEmbedSubmit}
          type="text"
          name="description"
          placeholder={translate('paste-embed-code')}
          style={{flex: 1, width: '100%'}}
          value={resourceCandidate.data || ''} />
      );
    case 'glossary':
      const onNameChange = e => submitResourceData('glossaryName', e.target.value, resourceCandidate.data);
      const onTypeChange = value => submitResourceData('glossaryType', value, resourceCandidate.data);
      return (
        <div className="input-group">
          <label htmlFor="title">{translate('name-of-the-glossary-entry')}</label>
          <input
            onChange={onNameChange}
            type="text"
            name="url"
            placeholder={translate('name-of-the-glossary-entry')}
            value={resourceCandidate.data && resourceCandidate.data.name || ''} />
          <OptionSelect
            activeOptionId={resourceCandidate && resourceCandidate.data && resourceCandidate.data.glossaryType}
            options={[
              {
                value: 'person',
                label: translate('person')
              },
              {
                value: 'place',
                label: translate('place')
              },
              {
                value: 'notion',
                label: translate('notion')
              },
              {
                value: 'other',
                label: translate('other-glossary')
              },
            ]}
            title={translate('glossary-type')}
            onChange={onTypeChange} />
        </div>
      );
    default:
      return null;
  }
};
ResourceDataInput.contextTypes = {
  t: PropTypes.func.isRequired
};

const LoadingStateToaster = ({
  loadingState
}, context) => {
  const translate = translateNameSpacer(context.t, 'Features.Editor');
  let log;
  switch (loadingState) {
    case 'processing':
      log = translate('loading-resource-data');
      break;
    case 'success':
      log = translate('loading-resource-data-success');
      break;
    case 'fail':
      log = translate('loading-resource-data-fail');
      break;
    default:
      break;
  }
  return <Toaster status={loadingState} log={log} />;
};
LoadingStateToaster.contextTypes = {
  t: PropTypes.func.isRequired
};

const ResourceConfigurationDialog = ({
  resourceCandidate,
  resourceCandidateId,
  resourceCandidateType,
  setResourceCandidateType,
  resourceDataLoadingState,
  setResourceCandidateMetadataValue,
  submitResourceData,
  onClose,
  createResource,
  updateResource
}, context) => {
  const translate = translateNameSpacer(context.t, 'Features.Editor');

  const resourcesTypes = [
    {
      id: 'table',
      icon: require('../assets/table.svg'),
      label: (<span>{translate('resource-type-table')} <HelpPin>
        {translate('resource-type-table-help')}
      </HelpPin></span>),
      possible: true
    },
    {
      id: 'data-presentation',
      icon: require('../assets/data-presentation.svg'),
      label: (<span>{translate('resource-type-data-presentation')} <HelpPin>
        {translate('resource-type-data-presentation-help')}
      </HelpPin></span>),
      possible: true
    },
    {
      id: 'image',
      icon: require('../assets/image.svg'),
      label: (<span>{translate('resource-type-image')} <HelpPin>
        {translate('resource-type-image-help')}
      </HelpPin></span>),
      possible: true
    },
    {
      id: 'video',
      icon: require('../assets/video.svg'),
      label: (<span>{translate('resource-type-video')} <HelpPin>
        {translate('resource-type-video-help')}
      </HelpPin></span>),
      possible: true
    },
    {
      id: 'embed',
      icon: require('../assets/embed.svg'),
      label: (<span>{translate('resource-type-embed')} <HelpPin position="left">
        {translate('resource-type-embed-help')}
      </HelpPin></span>),
      possible: true
    },
    {
      id: 'bib',
      icon: require('../assets/bib.svg'),
      label: (<span>{translate('resource-type-bib')} <HelpPin position="left">
        {translate('resource-type-bib-help')}
      </HelpPin></span>),
      possible: true
    },
    {
      id: 'glossary',
      icon: require('../assets/glossary.svg'),
      label: (<span>{translate('resource-type-glossary')} <HelpPin position="left">
        {translate('resource-type-glossary-help')}
      </HelpPin></span>),
      possible: true
    }

  ];
  const onApplyChange = () => {
    if (resourceCandidateId) {
      updateResource(resourceCandidateId, resourceCandidate);
    }
    else {
      // special case of batch references
      if (resourceCandidate.metadata.type === 'bib') {
        resourceCandidate.data.forEach(bib => {
          const resource = {
            metadata: {
              ...bib,
              // title: bib.title,
              type: 'bib'
            },
            data: [bib]
          };
          createResource(resource);
        });

      }
 else {
        createResource(resourceCandidate);
      }
    }
  };
  const onResourceTypeSelect = (resource) => setResourceCandidateType(resource.id);
  const setResourceTitle = (e) => setResourceCandidateMetadataValue('title', e.target.value);
  const setResourceDescription = (e) => setResourceCandidateMetadataValue('description', e.target.value);
  const setResourceSource = (e) => setResourceCandidateMetadataValue('source', e.target.value);
  return (
    <div className="fonio-resource-configuration-dialog">
      <h1 className="modal-header">
        {resourceCandidateId ? translate('edit-resource') : translate('create-resource')}
      </h1>
      <section className="modal-content">
        {resourceCandidateId === undefined ?
          <section className="modal-row">
            <BigSelect
              options={resourcesTypes}
              activeOptionId={resourceCandidateType}
              onOptionSelect={onResourceTypeSelect} />
          </section> : null}
        {resourceCandidateType ?
          <section className="modal-row">
            <h2>{translate('resource-data')}
              <HelpPin>
                {translate('resource-data-help')}
              </HelpPin>
            </h2>
            <div className="data-row">
              <div className="modal-column">
                <ResourceDataInput
                  type={resourceCandidateType}
                  resourceCandidate={resourceCandidate}
                  submitResourceData={submitResourceData} />
                <LoadingStateToaster loadingState={resourceDataLoadingState} />
              </div>
              {
                resourceCandidate.data && resourceCandidate.metadata.type !== 'glossary' ?
                (<div className="modal-column preview-container">
                  <h4>{translate('preview-title')}</h4>
                  <AssetPreview
                    type={resourceCandidateType}
                    data={resourceCandidate.data} />
                </div>)
                : null
              }
            </div>
          </section>
          : null}
        {resourceCandidateType && (resourceCandidateType !== 'glossary' && resourceCandidateType !== 'bib') ?
          <section className="modal-row">
            <h2>{translate('resource-metadata')}
              <HelpPin>
                {translate('resource-metadata-help')}
              </HelpPin>
            </h2>
            <form className="modal-columns-container">
              <div className="modal-column">
                <div className="input-group">
                  <label htmlFor="title">{translate('title-of-the-resource')}</label>
                  <input
                    onChange={setResourceTitle}
                    type="text"
                    name="title"
                    placeholder={translate('title-of-the-resource')}
                    value={resourceCandidate.metadata.title} />
                </div>

                <div className="input-group">
                  <label htmlFor="source">{translate('source-of-the-resource')}</label>
                  <input
                    onChange={setResourceSource}
                    type="text"
                    name="source"
                    placeholder={translate('source-of-the-resource')}
                    value={resourceCandidate.metadata.source} />
                </div>
              </div>

              <div className="modal-column">
                <div className="input-group" style={{flex: 1}}>
                  <label htmlFor="description">{translate('description-of-the-resource')}</label>
                  <Textarea
                    onChange={setResourceDescription}
                    type="text"
                    name="description"
                    placeholder={translate('description-of-the-resource')}
                    style={{flex: 1}}
                    value={resourceCandidate.metadata.description} />
                </div>
              </div>
            </form>
          </section> : null}


      </section>
      <section className="modal-footer">
        {
          resourceCandidate &&
          resourceCandidate.metadata &&
          resourceCandidate.metadata.type &&
          resourceCandidate.data
          ?
            <button
              className="valid-btn"
              onClick={onApplyChange}>{resourceCandidateId ? translate('update-resource') : translate('create-resource')}</button>
          : ''
        }
        <button
          onClick={onClose}>
          {translate('close')}
        </button>
      </section>
    </div>
  );
};

ResourceConfigurationDialog.contextTypes = {
  t: PropTypes.func.isRequired
};

export default ResourceConfigurationDialog;
