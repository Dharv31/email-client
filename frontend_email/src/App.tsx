import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home.tsx'
import Messages from './pages/Messages'
import ComposeMails from './pages/compose.tsx';
import ReplyToMail from './pages/repyToMail.tsx';
import ForwardMails from './pages/forwardmails.tsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route - no authentication required */}
          <Route path="/" element={<Home />} />
          
          {/* Protected routes - authentication required */}
          <Route 
            path="/messages" 
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/compose" 
            element={
              <ProtectedRoute>
                <ComposeMails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reply/:id" 
            element={
              <ProtectedRoute>
                <ReplyToMail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/forward/:id' 
            element={
              <ProtectedRoute>
                <ForwardMails />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
