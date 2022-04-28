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
import Thread from './pages/Thread';

function isValidShortName(shortName) {
  const MAX_SHORT_NAME_LENGTH = 5;
  return shortName.length <= MAX_SHORT_NAME_LENGTH;
}

/** Returns true if and only if threadId is composed of all digits. */
function isValidThreadId(threadId) { return /^\d+$/.test(threadId); }

function ValidateShortNameRoute() {
  const {shortName} = useParams();
  
  if (!isValidShortName(shortName)) return <NotFound />;
  else return <BoardCatalog shortName={shortName} />;
}

function ValidateThreadIdRoute() {
  const {shortName, threadId} = useParams();

  if (!isValidShortName(shortName)) return <NotFound />;
  else if (!isValidThreadId(threadId)) return <NotFound />;
  else return <Thread shortName={shortName} threadId={threadId} />;
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
      
        <Route path='/board/:shortName' element={<ValidateShortNameRoute />} />
        <Route path='/board/:shortName/:threadId' element={<ValidateThreadIdRoute />} />
        
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}