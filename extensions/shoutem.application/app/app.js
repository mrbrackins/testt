import { AppState } from 'react-native';
import * as _ from 'lodash';
import rio, { checkExpiration } from '@shoutem/redux-io';
import { applyToAll } from '@shoutem/redux-composers';
import { Image, Html } from '@shoutem/ui';

import { NavigationStacks } from 'shoutem.navigation';
import { I18n } from 'shoutem.i18n';

import SubscriptionMissingScreen from './screens/SubscriptionMissingScreen';
import { isRelease } from './shared/isRelease';
import { extractAppActions } from './shared/extractAppActions';
import { resolveAppEndpoint } from './shared/resolveAppEndpoint';
import { isConfigurationLoaded } from './shared/isConfigurationLoaded';
import { resizeImageSource } from './services/resizeImageSource';
import {
  loadLocalConfiguration,
  fetchConfiguration,
  fetchAppSubscriptionStatus,
  setQueueTargetComplete,
} from './redux';
import {
  CONFIGURATION_SCHEMA,
  ACTIVE_APP_STATE,
  APP_SUBSCRIPTION_SCHEMA,
  ext,
} from './const';
import { AppInitQueue } from './services';
import { SeAttachment } from './html';
import buildConfig from './buildConfig.json';

export const appActions = {};

AppInitQueue.addExtension(ext());

const AUTH_HEADER = `Bearer ${buildConfig.authorization}`;

let appStateChangeHandler; // Dynamically created handler;
let appState = ACTIVE_APP_STATE;

let application;
let unsubscribeFromConfigurationLoaded;

Html.registerElement('se-attachment', SeAttachment);
Html.registerElement('attachment', SeAttachment);

export const getAppId = () => {
  if (_.isEmpty(application)) {
    console.warn('You called getAppId before appWillMount has finished.');
  }

  return _.get(application, 'props.appId') || buildConfig.appId;
};

export const initializeApp = () => {
  Image.setPropsTransformer(resizeImageSource);
};

function loadConfiguration(app) {
  const store = app.getStore();
  const { dispatch } = store;
  return new Promise(resolve => {
    // resolve Promise from appWillMount when configuration is available in state
    unsubscribeFromConfigurationLoaded = store.subscribe(() => {
      if (isConfigurationLoaded(store.getState())) {
        resolve();
      }
    });
    if (isRelease()) {
      dispatch(loadLocalConfiguration());
    } else {
      const appId = getAppId(app);
      dispatch(fetchConfiguration(appId));
    }
  });
}

function registerConfigurationSchema() {
  rio.registerResource({
    schema: CONFIGURATION_SCHEMA,
    request: {
      // appId is RIO url variable because it can be changed when fetching configuration
      // in preview mode depending on provided appId in deeplink
      endpoint: resolveAppEndpoint('configurations/current', '{appId}'),
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: AUTH_HEADER,
      },
    },
  });
}

rio.registerResource({
  schema: APP_SUBSCRIPTION_SCHEMA,
  request: {
    method: 'GET',
    endpoint: resolveAppEndpoint('subscription-status', '{appId}'),
    headers: {
      Authorization: AUTH_HEADER,
      Accept: 'application/vnd.api+json',
    },
  },
});

function dispatchCheckExpiration(app) {
  app.getStore().dispatch(applyToAll(checkExpiration()));
}

function createAppStateChangeHandler(app) {
  return newAppState => {
    if (appState !== newAppState && newAppState === ACTIVE_APP_STATE) {
      dispatchCheckExpiration(app);
    }
    appState = newAppState;
  };
}

export function appWillMount(app) {
  application = app;
  registerConfigurationSchema();
  extractAppActions(app, appActions);

  NavigationStacks.registerNavigationStack({
    name: ext(),
    screens: [
      {
        name: ext('SubscriptionMissingScreen'),
        component: SubscriptionMissingScreen,
      },
    ],
    screenOptions: {
      headerShown: false,
    },
  });

  // Handler is saved into variable so it can be removed on unmount
  appStateChangeHandler = createAppStateChangeHandler(app);
  AppState.addEventListener('change', appStateChangeHandler);

  // When app is started first "AppState change" is skipped but we still
  // want to check expiration of local content (AppState is active).gst
  dispatchCheckExpiration(app);

  return loadConfiguration(app);
}

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();
  const appId = getAppId();
  if (!isConfigurationLoaded(state)) {
    throw new Error(I18n.t(ext('configurationLoadErrorMessage')));
  }
  unsubscribeFromConfigurationLoaded();

  return store
    .dispatch(fetchAppSubscriptionStatus(appId))
    .then(() => store.dispatch(setQueueTargetComplete(ext())));
}

/**
 * Returns true if environment is development, false otherwise.
 */
export const isDevelopment = () => process.env.NODE_ENV === 'development';

export function appWillUnmount() {
  AppState.removeEventListener('change', appStateChangeHandler);
}
