import React from 'react';
import {Route, Routes, useParams} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css'; // bootstrap CSS
import './css/App.css'; // shared CSS
import './css/BecomeAMod.css';
import './css/BoardCatalog.css';
import './css/CreateBoard.css';
import './css/FrontPage.css';
import './css/Thread.css';

import NotFound from './pages/NotFound';
import BecomeAMod from './pages/BecomeAMod';
import BoardCatalog from './pages/BoardCatalog';
import CreateBoard from './pages/CreateBoard';
import FrontPage from './pages/FrontPage';
import Navigation from './components/Navigation';
import Register from './pages/Register';
import Thread from './pages/Thread';

function ValidateShortNameRoute() {
  const MAX_SHORT_NAME_LENGTH = 5;
  const {shortName} = useParams();
  
  if (shortName.length > MAX_SHORT_NAME_LENGTH) return <NotFound />;
  else return <BoardCatalog shortName={shortName} />;
}

function ValidateThreadIdRoute() {
  const {threadId} = useParams();

  // A valid thread id is composed of all digits
  if (/^\d+$/.test(threadId)) return <Thread threadId={threadId} />;
  else return <NotFound />;
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
        <Route path='/thread/:threadId' element={<ValidateThreadIdRoute />} />
        
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}