import React from 'react';
import {Route, Routes} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css'; // bootstrap CSS
import './css/App.css'; // shared CSS
import './css/BecomeAMod.css';
import './css/CreateBoard.css';
import './css/FrontPage.css';

import BecomeAMod from './pages/BecomeAMod';
import CreateBoard from './pages/CreateBoard';
import FrontPage from './pages/FrontPage';
import Navigation from './components/Navigation';
import Register from './pages/Register';

export default function App() {
  return (
    <div>
      <Navigation />
      <Routes>
        <Route element={<BecomeAMod />} path='/become-a-mod' />
        <Route element={<CreateBoard />} path='/create-board' />
        <Route element={<FrontPage />} path='/' />
        <Route element={<Register />} path='/register' />
      </Routes>
    </div>
  );
}