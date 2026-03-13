import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth(); const nav = useNavigate()
  const [email,setEmail] = useState('demo@financiax.app')
  const [password,setPassword] = useState('demo1234')
  const [error,setError] = useState(''); const [loading,setLoading] = useState(false)
  const submit = async(e:FormEvent)=>{e.preventDefault();setError('');setLoading(true);try{await login(email,password);nav('/dashboard')}catch{setError('Invalid credentials')}finally{setLoading(false)}}
  const inp:React.CSSProperties={width:'100%',background:'#1E1E2E',border:'1px solid #2A2A3E',color:'#F0F0FF',padding:'12px 16px',borderRadius:12,fontSize:14,outline:'none',fontFamily:'Space Grotesk,sans-serif'}
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0A0A0F',padding:24}}>
      <div style={{position:'fixed',inset:0,background:'radial-gradient(ellipse at 20% 20%,rgba(108,71,255,0.12),transparent 60%),radial-gradient(ellipse at 80% 80%,rgba(0,212,170,0.08),transparent 60%)',pointerEvents:'none'}}/>
      <div style={{width:'100%',maxWidth:400,position:'relative',zIndex:1}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:32,fontWeight:800,background:'linear-gradient(135deg,#6C47FF,#00D4AA)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:8}}>FinanciaX</div>
          <p style={{color:'#9090B0',fontSize:14}}>Beat your financial blind spots</p>
        </div>
        <div style={{background:'#12121A',border:'1px solid #2A2A3E',borderRadius:20,padding:28}}>
          {error&&<div style={{background:'rgba(255,77,109,.1)',border:'1px solid rgba(255,77,109,.3)',borderRadius:10,padding:'10px 14px',marginBottom:16,fontSize:13,color:'#FF4D6D'}}>{error}</div>}
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:14}}>
            <div><label style={{fontSize:11,color:'#555570',display:'block',marginBottom:6,textTransform:'uppercase',letterSpacing:'.08em'}}>Email</label><input style={inp} type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
            <div><label style={{fontSize:11,color:'#555570',display:'block',marginBottom:6,textTransform:'uppercase',letterSpacing:'.08em'}}>Password</label><input style={inp} type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></div>
            <button type="submit" disabled={loading} style={{background:'#6C47FF',color:'#fff',border:'none',padding:'13px',borderRadius:12,fontSize:15,fontWeight:600,cursor:'pointer',marginTop:4}}>
              {loading?'Signing in…':'Sign In →'}
            </button>
          </form>
          <p style={{textAlign:'center',fontSize:13,color:'#555570',marginTop:16}}>No account? <Link to="/register" style={{color:'#6C47FF',textDecoration:'none'}}>Register free</Link></p>
        </div>
        <p style={{textAlign:'center',fontSize:11,color:'#555570',marginTop:12,fontFamily:'JetBrains Mono,monospace'}}>demo@financiax.app / demo1234</p>
      </div>
    </div>
  )
}
