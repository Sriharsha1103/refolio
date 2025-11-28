import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '@mantine/core/styles.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import { Provider } from 'react-redux';
// import Store from './components/Store';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './Service/ReduxStore';
import Footer from './components/Footer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store} >
    <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
