import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
 
// import './styles/index.css';
// import './styles/posts.css';
// import './styles/colors.css';

import Homepage from './pages/Homepage'
import Explore from './pages/Explore';
import Friends from './pages/Friends';
import Messages from './pages/Messages';
import Profile from './pages/Profile';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage />} />

      <Route path="/explore" element={<Explore />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/messages" element={<Messages />} />

      <Route path="/profile/:username" element={<Profile />} />
      <Route path="/create" element={<Homepage />} />
      <Route path="/settings" element={<Homepage />} />  
      
    </Routes>
  </BrowserRouter>
);