import { Fragment } from 'react';
import Routes from './router';
import './App.css';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <Fragment>
        <BrowserRouter>
           <Routes />
        </BrowserRouter>
    </Fragment>
  );
}

export default App;
