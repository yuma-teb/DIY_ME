import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store.jsx';
import { QueryClient, QueryClientProvider } from 'react-query';

const client = new QueryClient({ defaultOptions: { queries: { suspense: true } } });

ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense fallback="..loading">
    <BrowserRouter>
      <React.StrictMode>
        <Provider store={store}>
          <QueryClientProvider client={client}>
            <App />
          </QueryClientProvider>
        </Provider>
      </React.StrictMode>
    </BrowserRouter>
  </Suspense>,
);
