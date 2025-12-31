
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Notifications from './pages/Notifications';
import Clubs from './pages/Clubs';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import PGRooms from './pages/PGRooms';
import PGDetail from './pages/PGDetail';
import DutyLeaves from './pages/DutyLeaves';
import Notes from './pages/Notes';
import SubjectNotes from './pages/SubjectNotes';
import FreeCourses from './pages/FreeCourses';
import Deals from './pages/Deals';
import AITools from './pages/AITools';
import Emergency from './pages/Emergency';
import YouTubeChannels from './pages/YouTubeChannels';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/pg-rooms" element={<PGRooms />} />
        <Route path="/pg-rooms/:id" element={<PGDetail />} />
        <Route path="/duty-leaves" element={<DutyLeaves />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/notes/:subjectName" element={<SubjectNotes />} />
        <Route path="/courses" element={<FreeCourses />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/ai-tools" element={<AITools />} />
        <Route path="/youtube" element={<YouTubeChannels />} />
        <Route path="/emergency" element={<Emergency />} />
      </Routes>
    </Layout>
  );
};

export default App;
