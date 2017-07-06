import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducer'
import thunk from 'redux-thunk';

export default function configureStore () {
  const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
  const store = createStoreWithMiddleware(rootReducer);

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('../reducer/index').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
