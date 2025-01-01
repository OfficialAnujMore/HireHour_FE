import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import QueryClientProvider from './src/query/QueryClientProvider';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => (
  <SafeAreaProvider>
    <QueryClientProvider>
      <RootNavigator />
    </QueryClientProvider>
  </SafeAreaProvider>
);

export default App;
