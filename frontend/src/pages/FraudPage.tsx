import { useState } from 'react'

const SCENARIOS = [
  {id:1,type:'SMS',title:'Urgent: KYC Update Required',difficulty:'easy',answer:'scam',
   content:'Dear Customer, Your bank account will be BLOCKED in 24 hours due to incomplete KYC. Click here immediately: bit.ly/kyc-update-now to avoid suspension. Call 9876543210 for help. -SBI BANK',
   flags:['Urgency language','Shortened URL','Generic greeting','Unofficial number'],
   explanation:"Legitimate banks never ask for KYC via SMS links. The shortened URL and urgency are classic scam tactics. SBI's official site is sbi.co.in."},
  {id:2,type:'WhatsApp',title:'₹50,000/month work from home',difficulty:'medium',answer:'scam',
   content:'🌟 EXCLUSIVE OPPORTUNITY 🌟\n\nWork from home! Earn ₹50,000/month by liking YouTube videos. No investment needed! Just register with ₹999 one-time fee.\n\nLimited slots! Contact: +91 98765 43210\nRef: WFH-2024-PREMIUM',
   flags:['Too good to be true','Upfront fee','No verifiable company'],
   explanation:"Legitimate jobs never require upfront registration fees. The 'like YouTube videos' model is a well-documented advance-fee fraud pattern."},
  {id:3,type:'Investment',title:'SEBI-Registered 45% Annual Returns',difficulty:'hard',answer:'suspicious',
   content:'Shri Capital Advisory (SEBI Reg: INH000001234)\n\nOur proprietary algorithm has delivered 45% CAGR for 3 years straight. Minimum investment: ₹25,000. Your capital is 100% safe. Withdraw anytime.',
   flags:['Unrealistic returns','"100% safe" claim','Verify SEBI reg independently'],
   explanation:'While SEBI registration is mentioned, 45% CAGR with "100% safe capital" is impossible. Always verify SEBI numbers at sebi.gov.in.'},
]

export default function FraudPage() {
  const [current, setCurrent] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [chosen, setChosen] = useState('')
  const [score, setScore] = useState(78)
  const [toast, setToast] = useState('')

  const scenario = SCENARIOS[current % SCENARIOS.length]
  const showToast = (msg: string) => { setToast(msg); setTimeout(()=>setToast(''),3000) }

  const answer = (choice: string) => {
    if (answered) return
    setAnswered(true); setChosen(choice)
    const correct = choice === scenario.answer
    setScore(s => correct ? Math.min(100,s+3) : Math.max(0,s-5))
    showToast(correct ? '+3 Safety Score! Good instincts 🛡️' : 'Missed this one. Review the red flags.')
  }

  const next = () => { setCurrent(c=>c+1); setAnswered(false); setChosen('') }

  const btnStyle = (opt: string): React.CSSProperties => {
    const base: React.CSSProperties = {border:'1px solid #2A2A3E',background:'#1A1A26',color:'#F0F0FF',padding:12,borderRadius:12,cursor:'pointer',fontSize:13,fontWeight:500,transition:'all .2s',fontFamily:'Space Grotesk,sans-serif'}
    if (!answered) return base
    if (opt === scenario.answer) return {...base,borderColor:'#00D4AA',background:'rgba(0,212,170,.1)',color:'#00D4AA'}
    if (opt === chosen && opt !== scenario.answer) return {...base,borderColor:'#FF4D6D',background:'rgba(255,77,109,.1)',color:'#FF4D6D'}
    return {...base,opacity:.5}
  }

  return (
    <div style={{maxWidth:700,margin:'0 auto'}}>
      {toast&&<div style={{position:'fixed',bottom:24,right:24,background:'#1A1A26',border:'1px solid rgba(0,212,170,.3)',borderRadius:12,padding:'14px 18px',fontSize:13,zIndex:9999,color:'#F0F0FF'}}>{toast}</div>}

      <div style={{padding:24,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h2 style={{fontFamily:'Syne,sans-serif',fontSize:24}}>Fraud Shield Training</h2>
          <p style={{color:'#9090B0',fontSize:13,marginTop:4}}>Daily scenario · Sharpen your scam radar</p>
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:48,color:'#00D4AA'}}>{score}</div>
          <div style={{fontSize:11,color:'#9090B0'}}>Safety Score</div>
        </div>
      </div>

      <div style={{background:'#12121A',border:'1px solid #2A2A3E',borderRadius:20,padding:24,margin:'0 24px 24px'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
          <div style={{background:'rgba(255,107,53,.12)',color:'#FF6B35',fontSize:11,padding:'4px 10px',borderRadius:10,fontWeight:600}}>{scenario.type}</div>
          <div style={{background:'rgba(84,160,255,.1)',color:'#54A0FF',fontSize:11,padding:'4px 10px',borderRadius:10,fontWeight:600}}>{scenario.difficulty.toUpperCase()}</div>
        </div>
        <h3 style={{fontSize:18,fontWeight:600,marginBottom:4}}>{scenario.title}</h3>
        <div style={{fontSize:12,color:'#9090B0',marginBottom:12}}>Is this message legitimate, suspicious, or a scam?</div>
        <div style={{background:'#1A1A26',borderRadius:12,padding:16,margin:'16px 0',fontSize:13,lineHeight:1.7,color:'#9090B0',borderLeft:'3px solid #FF6B35',whiteSpace:'pre-line'}}>{scenario.content}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginTop:16}}>
          <button onClick={()=>answer('legitimate')} style={btnStyle('legitimate')}>✅ Legitimate</button>
          <button onClick={()=>answer('suspicious')} style={btnStyle('suspicious')}>⚠️ Suspicious</button>
          <button onClick={()=>answer('scam')} style={btnStyle('scam')}>🚨 Scam!</button>
        </div>
        {answered && (
          <div style={{marginTop:20,padding:16,background:'#1A1A26',borderRadius:12}}>
            <div style={{fontWeight:600,color:chosen===scenario.answer?'#00D4AA':'#FF4D6D',marginBottom:8}}>
              {chosen===scenario.answer?'✓ Correct! +3 Safety Score':'✗ Incorrect. -5 Safety Score'}
            </div>
            <div style={{fontSize:13,color:'#9090B0',marginBottom:10}}>{scenario.explanation}</div>
            <div style={{fontSize:12,color:'#555570'}}>Red flags: {scenario.flags.join(' · ')}</div>
          </div>
        )}
        <div style={{marginTop:16,textAlign:'right'}}>
          <button onClick={next} style={{background:'transparent',color:'#F0F0FF',border:'1px solid #2A2A3E',padding:'8px 16px',borderRadius:12,fontSize:13,cursor:'pointer',fontFamily:'Space Grotesk,sans-serif'}}>Next Scenario →</button>
        </div>
      </div>

      <div style={{padding:'0 24px 24px'}}>
        <div style={{fontSize:12,textTransform:'uppercase',letterSpacing:'.08em',color:'#555570',marginBottom:12,fontWeight:600}}>Past Scenarios</div>
        {SCENARIOS.map(s=>(
          <div key={s.id} style={{background:'#1A1A26',borderRadius:8,padding:'10px 14px',marginBottom:8,display:'flex',alignItems:'center',gap:12}}>
            <div style={{fontSize:20}}>{s.answer==='scam'?'🚨':'⚠️'}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{s.title}</div><div style={{fontSize:11,color:'#9090B0'}}>{s.type} · {s.difficulty}</div></div>
            <div style={{fontSize:11,padding:'3px 10px',borderRadius:10,background:'rgba(255,77,109,.12)',color:'#FF4D6D',fontWeight:600}}>{s.answer.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
