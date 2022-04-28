import React from 'react';
import {Route, Routes, useParams} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css'; // bootstrap CSS
import './css/App.css'; // shared CSS
import './css/BecomeAMod.css';
import './css/BoardCatalog.css';
import './css/CreateBoard.css';
import './css/FrontPage.css';

import NotFound from './pages/NotFound';
import BecomeAMod from './pages/BecomeAMod';
import BoardCatalog from './pages/BoardCatalog';
import CreateBoard from './pages/CreateBoard';
import FrontPage from './pages/FrontPage';
import Navigation from './components/Navigation';
import Register from './pages/Register';

function ValidateBoardName() {
  const {shortName} = useParams();
  const MAX_SHORT_NAME_LENGTH = 5;

  // a board's URL can only be at most MAX_SHORT_NAME_LENGTH chars long
  if (shortName.length > MAX_SHORT_NAME_LENGTH) return <NotFound />;
  else return <BoardCatalog shortName={shortName} />
}

export default function App() {
  return (
    <div>
      <Navigation />
      <Routes>
        <Route path='/become-a-mod' element={<BecomeAMod />} />
        <Route path='/create-board' element={<CreateBoard />} />
        <Route path='/' element={<FrontPage />} />
        <Route path='/register' element={<Register />} />

        <Route path='/board/:shortName' element={<ValidateBoardName />} />
        
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}