import { legacy_createStore as createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {thunk} from 'redux-thunk'; // You may also want to add middleware like Redux Thunk

// Import your reducers
import {LoginReducer} from './Store'; // Update with the correct pathS
const persistConfig = {
    key: 'root', // Change this key as needed
    storage,
};
const persistedReducer = persistReducer(persistConfig, LoginReducer);

const composeEnhancers =  compose;

const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);

const persistor = persistStore(store);
export { store, persistor };
// const persistedReducer = persistReducer(persistConfig, LoginReducer);
// const store = createStore(persistedReducer, applyMiddleware(thunk),(window).__REDUX_DEVTOOLS_EXTENSION__ && (window).__REDUX_DEVTOOLS_EXTENSION__()); // Add middleware as needed

// const persistor = persistStore(store);
// export { store, persistor };
