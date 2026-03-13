import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const ACHIEVEMENTS = [
  {icon:'🔥',name:'Streak Warrior',desc:'Maintained 20+ day streak',earned:true},
  {icon:'🧠',name:'Bias Aware',desc:'Completed first bias report',earned:true},
  {icon:'🛡️',name:'Fraud Fighter',desc:'Correctly identified 10 scams',earned:true},
  {icon:'📈',name:'First Trade',desc:'Executed first simulator trade',earned:true},
  {icon:'💎',name:'Diamond Hands',desc:'Held during 10% market drop',earned:false},
  {icon:'🏆',name:'Top 10',desc:'Reached top 10 on leaderboard',earned:false},
]
const SNAPSHOTS = [
  {label:'Monthly Income',val:'₹65,000',color:'#00D4AA'},
  {label:'Monthly Expenses',val:'₹42,000',color:'#FF6B35'},
  {label:'Current Savings',val:'₹2.4L',color:'#6C47FF'},
  {label:'Investments',val:'₹1.08L',color:'#54A0FF'},
  {label:'Emergency Fund',val:'3.2 mo.',color:'#FFD700'},
  {label:'Net Worth',val:'₹3.48L',color:'#00D4AA'},
]

export default function ProfilePage() {
  const { user } = useAuth()
  const [lifeStage, setLifeStage] = useState('💼 First Job')
  const [toast, setToast] = useState('')
  const initials = user?.full_name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) ?? 'AP'

  const showToast = (msg: string) => { setToast(msg); setTimeout(()=>setToast(''),2500) }

  return (
    <div style={{maxWidth:1100,margin:'0 auto',padding:24}}>
      {toast&&<div style={{position:'fixed',bottom:24,right:24,background:'rgba(0,212,170,.08)',border:'1px solid rgba(0,212,170,.3)',borderRadius:12,padding:'14px 18px',fontSize:13,zIndex:9999,color:'#F0F0FF'}}>{toast}</div>}
      <div style={{display:'grid',gridTemplateColumns:'340px 1fr',gap:16}}>
        {/* Left col */}
        <div>
          <div style={{background:'#12121A',border:'1px solid #2A2A3E',borderRadius:20,padding:24,textAlign:'center',marginBottom:16}}>
            <div style={{width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,#6C47FF,#00D4AA)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:700,margin:'0 auto 16px'}}>{initials}</div>
            <div style={{fontSize:20,fontWeight:700}}>{user?.full_name ?? 'Abhay Puri'}</div>
            <div style={{fontSize:13,color:'#9090B0',marginTop:4}}>{user?.email ?? 'abhay@example.com'}</div>
            <div style={{marginTop:16}}>
              <div style={{fontSize:12,color:'#9090B0',marginBottom:6}}>Life Stage</div>
              <select value={lifeStage} onChange={e=>{setLifeStage(e.target.value);showToast('Life stage updated!')}}
                style={{background:'#1A1A26',border:'1px solid #2A2A3E',color:'#F0F0FF',padding:'8px 14px',borderRadius:8,fontSize:13,width:'100%',fontFamily:'Space Grotesk,sans-serif',cursor:'pointer',outline:'none'}}>
                {['🎓 Student','💼 First Job','🏠 Own Home','👨‍👩‍👧 Family','📈 Wealth Building','🌴 Retirement'].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{marginTop:20}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:6}}><span style={{color:'#9090B0'}}>Level 7</span><span style={{fontFamily:'JetBrains Mono,monospace',color:'#6C47FF'}}>4,280 / 5,000 XP</span></div>
              <div style={{height:8,background:'#1A1A26',borderRadius:4,overflow:'hidden'}}><div style={{height:'100%',borderRadius:4,background:'linear-gradient(90deg,#6C47FF,#00D4AA)',width:'85.6%',transition:'width 1s ease'}}/></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginTop:20}}>
              {[['23','Streak','#FF6B35'],['724','Score','#00D4AA'],['14','Rank','#FFD700']].map(([val,label,color])=>(
                <div key={label} style={{textAlign:'center',background:'#1A1A26',borderRadius:8,padding:10}}>
                  <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:18,color:color as string}}>{val}</div>
                  <div style={{fontSize:11,color:'#9090B0',marginTop:2}}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div>
          <div style={{background:'#12121A',border:'1px solid #2A2A3E',borderRadius:20,padding:20,marginBottom:16}}>
            <div style={{fontSize:12,textTransform:'uppercase',letterSpacing:'.08em',color:'#555570',marginBottom:16,fontWeight:600}}>Achievements</div>
            {ACHIEVEMENTS.map(a=>(
              <div key={a.name} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid #2A2A3E',opacity:a.earned?1:.4}}>
                <div style={{fontSize:24}}>{a.icon}</div>
                <div><div style={{fontSize:13,fontWeight:500}}>{a.name}{a.earned?' ✓':' 🔒'}</div><div style={{fontSize:11,color:'#9090B0',marginTop:2}}>{a.desc}</div></div>
              </div>
            ))}
          </div>

          <div style={{background:'#12121A',border:'1px solid #2A2A3E',borderRadius:20,padding:20}}>
            <div style={{fontSize:12,textTransform:'uppercase',letterSpacing:'.08em',color:'#555570',marginBottom:16,fontWeight:600}}>Financial Snapshot</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {SNAPSHOTS.map(s=>(
                <div key={s.label} style={{background:'#1A1A26',borderRadius:8,padding:12}}>
                  <div style={{fontSize:11,color:'#9090B0'}}>{s.label}</div>
                  <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:18,marginTop:6,color:s.color}}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
