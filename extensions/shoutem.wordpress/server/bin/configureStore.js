import _ from 'lodash';
import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import '@shoutem/react-web-ui/lib/styles/index.scss';
import { apiStateMiddleware, enableRio } from '@shoutem/redux-io';
import {
  syncStateEngineMiddleware,
  enableStateSync,
} from '@shoutem/redux-sync-state-engine';
import * as extension from '../src/index';
import { createRootReducer } from './reducers';

export default function configureStore(context, initialState, syncStateEngine) {
  const middlewareList = [
    thunk,
    apiMiddleware,
    apiStateMiddleware,
    syncStateEngineMiddleware(syncStateEngine),
  ];
  const middleware = compose(applyMiddleware(...middlewareList));

  const extensionName = context.ownExtensionName;
  const reducer = _.get(extension, 'reducer');
  const rootReducer = enableRio(createRootReducer(extensionName, reducer));
  const syncRootReducer = enableStateSync(rootReducer, syncStateEngine);
  const store = middleware(createStore)(syncRootReducer, initialState);

  return store;
}
