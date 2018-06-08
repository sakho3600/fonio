/**
 * Fonio Reducers Endpoint
 * ===================================
 *
 * Combining the app's reducers.
 */
import {combineReducers} from 'redux';

import {i18nState} from 'redux-i18n';

import {loadingBarReducer} from 'react-redux-loading-bar';

import home from '../features/HomeView/duck';
import summary from '../features/SummaryView/duck';
import section from '../features/SectionView/duck';

import connections from '../features/ConnectionsManager/duck';
import userInfo from '../features/UserInfoManager/duck';
import auth from '../features/AuthManager/duck';
import editionUiWrapper from '../features/EditionUiWrapper/duck';
import editedStory from '../features/StoryManager/duck';

const saveLang = (state = {}, action) => {
  if (action.type === 'REDUX_I18N_SET_LANGUAGE') {
    localStorage.setItem('fonio-lang', action.lang);
    return state;
  }
 else return state;
};

export default combineReducers({
  i18nState,
  saveLang,
  loadingBar: loadingBarReducer,
  connections,
  userInfo,
  auth,
  editionUiWrapper,
  editedStory,


  home,
  summary,
  section,
});
