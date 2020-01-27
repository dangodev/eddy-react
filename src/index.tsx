import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from './components/Eddy';
import PageDetail from './components/PageDetail';
import PageHome from './components/PageHome';
import './styles/app.css';

const App = () => (
  <Provider>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={PageHome} />
        <Route path="/home/:id" component={PageDetail} />
      </Switch>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(<App />, document.querySelector('#root'));
