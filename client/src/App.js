import React from 'react';
import {Route, Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

import './css/App.css'; // global CSS
import FrontPage from './pages/FrontPage';

export default function App() {
  return (
    <div>
      <Routes>
        <Route element={<FrontPage/>} path='/'/>
      </Routes>
    </div>
  );
}