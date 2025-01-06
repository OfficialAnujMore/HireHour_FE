import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store'; // Assuming store is defined in src/store.ts
import RootNavigator from './src/navigation/RootNavigator';

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </PersistGate>
  </Provider>
);

export default App;
