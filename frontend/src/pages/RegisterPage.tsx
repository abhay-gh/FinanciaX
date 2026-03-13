import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register as apiReg } from '../lib/api'
import { useAuth } from '../hooks/useAuth'

export default function RegisterPage() {
  const { login } = useAuth(); const nav = useNavigate()
  const [f,setF] = useState({email:'',password:'',full_name:''})
  const [error,setError] = useState(''); const [loading,setLoading] = useState(false)
  const submit=async(e:FormEvent)=>{e.preventDefault();setError('');setLoading(true);try{await apiReg(f.email,f.password,f.full_name);await login(f.email,f.password);nav('/dashboard')}catch(err:any){setError(err.response?.data?.detail??'Registration failed')}finally{setLoading(false)}}
  const set=(k:string)=>(e:React.ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,[k]:e.target.value}))
  const inp:React.CSSProperties={width:'100%',background:'#1E1E2E',border:'1px solid #2A2A3E',color:'#F0F0FF',padding:'12px 16px',borderRadius:12,fontSize:14,outline:'none',fontFamily:'Space Grotesk,sans-serif'}
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0A0A0F',padding:24}}>
      <div style={{position:'fixed',inset:0,background:'radial-gradient(ellipse at 20% 20%,rgba(108,71,255,0.12),transparent 60%)',pointerEvents:'none'}}/>
      <div style={{width:'100%',maxWidth:400,position:'relative',zIndex:1}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:32,fontWeight:800,background:'linear-gradient(135deg,#6C47FF,#00D4AA)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:8}}>FinanciaX</div>
          <p style={{color:'#9090B0',fontSize:14}}>Start your free bias report</p>
        </div>
        <div style={{background:'#12121A',border:'1px solid #2A2A3E',borderRadius:20,padding:28}}>
          {error&&<div style={{background:'rgba(255,77,109,.1)',border:'1px solid rgba(255,77,109,.3)',borderRadius:10,padding:'10px 14px',marginBottom:16,fontSize:13,color:'#FF4D6D'}}>{error}</div>}
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:14}}>
            {[['full_name','Full Name','text'],['email','Email','email'],['password','Password','password']].map(([k,label,type])=>(
              <div key={k}><label style={{fontSize:11,color:'#555570',display:'block',marginBottom:6,textTransform:'uppercase',letterSpacing:'.08em'}}>{label}</label><input style={inp} type={type} value={(f as any)[k]} onChange={set(k)} required/></div>
            ))}
            <button type="submit" disabled={loading} style={{background:'#6C47FF',color:'#fff',border:'none',padding:13,borderRadius:12,fontSize:15,fontWeight:600,cursor:'pointer',marginTop:4}}>
              {loading?'Creating…':'Create Account →'}
            </button>
          </form>
          <p style={{textAlign:'center',fontSize:13,color:'#555570',marginTop:16}}>Have an account? <Link to="/login" style={{color:'#6C47FF',textDecoration:'none'}}>Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}
