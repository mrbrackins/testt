import _ from 'lodash';
import { isRSAA, RSAA } from 'redux-api-middleware';
import URI from 'urijs';

import { UPDATE_SUCCESS } from '@shoutem/redux-io';
import { priorities, setPriority, before } from 'shoutem-core';

import { getExtensionSettings, RESTART_APP } from 'shoutem.application';
import { isUserUpdateAction, getUser, LOGOUT, getAccessToken } from './redux';
import { clearSession, getSession, saveSession } from './session.js';

function getAuthHeader(state) {
  return `Bearer ${getAccessToken(state)}`;
}

const APPLICATION_EXTENSION = 'shoutem.application';
const AUTH_HEADERS = 'headers.Authorization';

/**
 * Listens to user profile changes and updates the saved session.
 * When the app is restarted and we restore the session, it will have the updates.
 */
export const userUpdatedMiddleware = store => next => action => {
  if (action.type === UPDATE_SUCCESS && isUserUpdateAction(action)) {
    getSession().then((session = {}) => {
      const user = getUser(store.getState());

      const newSession = { ...JSON.parse(session), user };
      saveSession(JSON.stringify(newSession));
    });
  }
  return next(action);
};

let legacyApiDomain;

/**
 * Sets header Authorization value for every network request to endpoints registered
 * in shoutem.application that doesn't already include any Authorization header
 */
export const networkRequestMiddleware = setPriority(
  store => next => action => {
    if (isRSAA(action)) {
      const state = store.getState();

      if (!legacyApiDomain) {
        const appSettings = getExtensionSettings(state, APPLICATION_EXTENSION);

        const { legacyApiEndpoint } = appSettings;

        legacyApiDomain =
          legacyApiEndpoint && new URI(legacyApiEndpoint).domain();
      }

      const endpointDomain = new URI(action[RSAA].endpoint).domain();

      if (
        legacyApiDomain === endpointDomain &&
        !_.has(action[RSAA], AUTH_HEADERS)
      ) {
        _.set(action[RSAA], AUTH_HEADERS, getAuthHeader(state));
      }
    }

    return next(action);
  },
  before(priorities.NETWORKING),
);

export const logoutMiddleware = setPriority(
  store => next => action => {
    const actionType = _.get(action, 'type');

    if (actionType === LOGOUT) {
      clearSession().then(
        () => store.dispatch({ type: RESTART_APP }),
        reason => console.warn(reason),
      );
    }
    return next(action);
  },
  priorities.AUTH,
);
