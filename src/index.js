import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from './store/configureStore';

const store = configureStore();

store.subscribe(() => {
  console.log('State updated', store.getState());
});

const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter future={router}>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
