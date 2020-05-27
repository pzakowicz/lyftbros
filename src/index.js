import React from "react";
import ReactDOM from "react-dom";
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider } from 'react-redux';
import { configureStore } from './redux/store';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from '../src/components/login-and-logout/login';
import HeaderNotLoggedIn from '../src/components/header/header-not-logged-in';
import LoggedIn from '../src/components/logged-in';


const store = configureStore();
const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate 
      loading={<div>Loading...</div>}
      persistor={persistor}>

      <BrowserRouter>
        <Route exact path="/">
          <HeaderNotLoggedIn />
          <Login />
        </Route>
        <Route path="/feed">
        <LoggedIn />
        </Route>
        <Route path="/workouts/:workout_id">
        <LoggedIn />
        </Route>
        <Route path="/users/:user_id">
        <LoggedIn />
        </Route>
        <Route path="/account">
        <LoggedIn />
        </Route>
        <Route path="/log-workout">
        <LoggedIn />
        </Route>
      </BrowserRouter>

    </PersistGate>


  </Provider>,
  document.getElementById('root'),
);

