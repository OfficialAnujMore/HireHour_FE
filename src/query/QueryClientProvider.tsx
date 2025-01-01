import React from 'react';
import { QueryClient, QueryClientProvider as Provider } from 'react-query';

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

const QueryClientProvider: React.FC<Props> = ({ children }) => (
  <Provider client={queryClient}>{children}</Provider>
);

export default QueryClientProvider;
