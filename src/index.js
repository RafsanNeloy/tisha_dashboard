import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from './store/configureStore';

const store = configureStore();

store.subscribe(() => {
  console.log('State updated', store.getState());
});

// React Router v6 future flags configuration
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

// Create root and render
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter future={router}>
      <App />
    </BrowserRouter>
  </Provider>
);
