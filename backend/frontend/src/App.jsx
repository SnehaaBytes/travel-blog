import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home/Home';
import Destinations from './components/Destinations/Destinations';
import Chat from './components/Chat/Chat';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import About from './components/About/About';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
