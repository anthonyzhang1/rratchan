import React from 'react';
import {Route, Routes} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css'; // bootstrap CSS
import './css/App.css'; // global CSS
import FrontPage from './pages/FrontPage';
import Navigation from './components/Navigation';

export default function App() {
  return (
    <div>
      <Navigation />
      <Routes>
        <Route element={<FrontPage/>} path='/' />
      </Routes>
    </div>
  );
}