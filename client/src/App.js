import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import RupeesChatbot from './components/chatbot/ChatWindow';
import Home from './pages/Home';
import Results from './pages/Results';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import PriceHistory from './pages/PriceHistory';
import PriceAlerts from './pages/PriceAlerts';
import About from './pages/About';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_relativeSplatPath: true }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/price-history" element={<PriceHistory />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/alerts"
            element={
              <PrivateRoute>
                <PriceAlerts />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <RupeesChatbot />
      </Router>
    </AuthProvider>
  );
}

export default App;
