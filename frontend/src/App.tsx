import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Nav from './components/Nav'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import BiasPage from './pages/BiasPage'
import SimulatorPage from './pages/SimulatorPage'
import FraudPage from './pages/FraudPage'
import MentorPage from './pages/MentorPage'
import LeaderboardPage from './pages/LeaderboardPage'
import ProfilePage from './pages/ProfilePage'

function Guard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{display:'flex',height:'100vh',alignItems:'center',justifyContent:'center',background:'#0A0A0F',color:'#6C47FF',fontFamily:'JetBrains Mono,monospace'}}>Loading…</div>
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/*" element={
        <Guard>
          <div style={{paddingTop:56}}>
            <Nav />
            <Routes>
              <Route index element={<LandingPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="bias" element={<BiasPage />} />
              <Route path="simulator" element={<SimulatorPage />} />
              <Route path="fraud" element={<FraudPage />} />
              <Route path="mentor" element={<MentorPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Guard>
      } />
    </Routes>
  )
}

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>
}
