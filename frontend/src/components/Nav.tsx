import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const TABS = [
  { path:'/dashboard', label:'Dashboard' },
  { path:'/bias',      label:'Bias Report' },
  { path:'/simulator', label:'Simulator' },
  { path:'/fraud',     label:'Fraud Shield' },
  { path:'/mentor',    label:'AI Mentor' },
  { path:'/leaderboard', label:'Leaderboard' },
  { path:'/profile',   label:'Profile' },
]

export default function Nav() {
  const nav = useNavigate()
  const loc = useLocation()
  const { user, logout } = useAuth()
  const initials = user?.full_name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) ?? 'U'

  return (
    <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:'rgba(10,10,15,0.9)',backdropFilter:'blur(16px)',borderBottom:'1px solid #2A2A3E',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',height:56}}>
      <div style={{fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:800,background:'linear-gradient(135deg,#6C47FF,#00D4AA)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',cursor:'pointer'}} onClick={()=>nav('/')}>FinanciaX</div>
      <div style={{display:'flex',gap:4}}>
        {TABS.map(t=>(
          <button key={t.path} onClick={()=>nav(t.path)}
            style={{background: loc.pathname===t.path?'#1A1A26':'none', border: loc.pathname===t.path?'1px solid #6C47FF44':'1px solid transparent', color: loc.pathname===t.path?'#F0F0FF':'#9090B0', padding:'6px 14px', borderRadius:8, cursor:'pointer', fontSize:13, transition:'all .2s'}}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{background:'rgba(255,107,53,0.15)',border:'1px solid rgba(255,107,53,0.3)',borderRadius:20,padding:'4px 12px',fontSize:12,color:'#FF6B35',fontWeight:600}}>🔥 23 days</div>
        <div title="Sign out" onClick={logout} style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#6C47FF,#00D4AA)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,cursor:'pointer'}}>{initials}</div>
      </div>
    </nav>
  )
}
