import React from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import './index.css';
import App from './App';

const store = configureStore()

store.subscribe(() => {
  console.log('State updated', store.getState())
})

const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
}

const root = createRoot(document.getElementById('root'))
root.render(
    <Provider store={store}>
      <BrowserRouter future={router}>
        <App />
      </BrowserRouter>
    </Provider>
)
