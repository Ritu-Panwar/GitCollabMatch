import React from 'react';
import './App.css';
import Aboutpage from './components/front/Aboutpage';
import HomePage from './components/Home/HomePage';
import Layout from './components/front/Layout';
import MatchingPage from './components/match/MatchingPage';
import AuthPage from './components/Auth/AuthPage';
import ContactPage from './components/front/ContactPage';
import Navbar from './components/NavbarandSidebar/Navbar';
import CommitPage from './components/commit/CommitPage';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Navbar />
      <Layout>
      <div className="container" style={{ maxWidth: '1590px', padding: '0', margin: '0' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<Aboutpage />} />
          <Route path='/auth' element={<AuthPage/>} />
          <Route path="/match" element={<MatchingPage />} />
          <Route path="/commit" element={<CommitPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
      </Layout>
    </Router>
  );
}

export default App;
