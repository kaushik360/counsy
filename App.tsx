import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Journal from './pages/Journal';
import Counselor from './pages/Counselor';
import Streaks from './pages/Streaks';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Insights from './pages/Insights';
import Focus from './pages/Focus';
import About from './pages/About';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/counselor" element={<Counselor />} />
          <Route path="/streaks" element={<Streaks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;