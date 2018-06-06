/**
 * This module exports logic-related elements for the fonio global ui
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module fonio/features/HomeView
 */

import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';

import {get/*, put, post, delete as del*/} from 'axios';

/**
 * ===================================================
 * ACTION NAMES
 * ===================================================
 */
/**
 * ui
 */
const SET_TAB_MODE = 'SET_TAB_MODE';
const SET_NEW_STORY_OPEN = 'SET_NEW_STORY_OPEN';
const SET_NEW_STORY_TAB_MODE = 'SET_NEW_STORY_TAB_MODE';
const SET_SEARCH_STRING = 'SET_SEARCH_STRING';
const SET_SORTING_MODE = 'SET_SORTING_MODE';
const SET_IDENTIFICATION_MODAL_SWITCH = 'SET_IDENTIFICATION_MODAL_SWITCH';
const SET_PREVIEWED_STORY_ID = 'SET_PREVIEWED_STORY_ID';

const FETCH_STORIES = 'FETCH_STORIES';

/**
 * data
 */
const SET_NEW_STORY_METADATA = 'NEW_STORY_METADATA';


/**
 * ===================================================
 * ACTION CREATORS
 * ===================================================
 */
export const setTabMode = payload => ({
  type: SET_TAB_MODE,
  payload
});
export const setNewStoryOpen = payload => ({
  type: SET_NEW_STORY_OPEN,
  payload
});
export const setNewStoryTabMode = payload => ({
  type: SET_NEW_STORY_TAB_MODE,
  payload
});
export const setSearchString = payload => ({
  type: SET_SEARCH_STRING,
  payload
});
export const setSortingMode = payload => ({
  type: SET_SORTING_MODE,
  payload
});
export const setIdentificationModalSwitch = payload => ({
  type: SET_IDENTIFICATION_MODAL_SWITCH,
  payload
});
export const setPreviewedStoryId = payload => ({
  type: SET_PREVIEWED_STORY_ID,
  payload
});

export const setNewStoryMetadata = payload => ({
  type: SET_NEW_STORY_METADATA,
  payload
});

export const fetchStories = () => ({
  type: FETCH_STORIES,
  promise: () => {
    const serverRequestUrl = `${CONFIG.serverUrl}/stories/`;/* eslint no-undef: 0 */
    return get(serverRequestUrl);
  },
});

/**
 * ===================================================
 * REDUCERS
 * ===================================================
 */
/**
 * Default/fallback state of the ui state
 */
const UI_DEFAULT_STATE = {
  /**
   * Tab of the main view
   */
  tabMode: 'stories',
  /**
   * Whether a new story is being edited
   */
  newStoryOpen: false,
  /**
   * Mode for the story creation interface (['form', 'file'])
   */
  newStoryTabMode: 'form',
  /**
   * string for searching the stories
   */
  searchString: '',
  /**
   * sorting mode of the stories (['last modification', 'creation date', 'title'])
   */
  sortingMode: 'title',
  /**
   * Whether identification modal is opened
   */
  identificationModalOpen: false,
  /**
   * id of a story to display as a resume/readonly way
   */
  previewedStoryId: undefined,
};

const getStatePropFromActionSet = actionName => {
  return actionName.replace('SET_', '').toLowerCase().replace(/(_[a-z])/gi, (a, b) => b.substr(1).toUpperCase());
};

/**
 * This redux reducer handles the global ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function ui(state = UI_DEFAULT_STATE, action) {
  const {payload} = action;
  switch (action.type) {
    case SET_TAB_MODE:
    case SET_NEW_STORY_OPEN:
    case SET_NEW_STORY_TAB_MODE:
    case SET_SEARCH_STRING:
    case SET_SORTING_MODE:
    case SET_IDENTIFICATION_MODAL_SWITCH:
    case SET_PREVIEWED_STORY_ID:
      const propName = getStatePropFromActionSet(action.type);
      return {
        ...state,
        [propName]: payload
      };
    default:
      return state;
  }
}

const DATA_DEFAULT_STATE = {
  /**
   * temp data of the new story form
   */
  newStoryMetadata: {},
  /**
   * list of stories metadata
   */
  stories: {}
};

/**
 * This redux reducer handles the global ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function data(state = DATA_DEFAULT_STATE, action) {
  const {payload} = action;
  switch (action.type) {
    case SET_NEW_STORY_TAB_MODE:
      return {
        ...state,
        newStoryMetadata: payload
      };
    case `${FETCH_STORIES}_SUCCESS`:
      const {data: thatData} = action.result;
      return {
        ...state,
        stories: thatData
      };
    default:
      return state;
  }
}

/**
 * The module exports a reducer connected to pouchdb thanks to redux-pouchdb
 */
export default combineReducers({
  ui,
  data
});

/**
 * ===================================================
 * SELECTORS
 * ===================================================
 */

const tabMode = state => state.ui.tabMode;
const newStoryOpen = state => state.ui.newStoryOpen;
const newStoryTabMode = state => state.ui.newStoryTabMode;
const searchString = state => state.ui.searchString;
const sortingMode = state => state.ui.sortingMode;
const identificationModalOpen = state => state.ui.identificationModalOpen;

const newStoryMetadata = state => state.data.newStoryMetadata;
const stories = state => state.data.stories;

/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  tabMode,
  newStoryOpen,
  newStoryTabMode,
  searchString,
  sortingMode,
  identificationModalOpen,
  newStoryMetadata,
  stories
});