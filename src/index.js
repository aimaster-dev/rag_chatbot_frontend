import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from "react-helmet-async";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Suspense>
        <App />
      </Suspense>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
