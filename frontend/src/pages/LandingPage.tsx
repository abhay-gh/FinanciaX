import { useNavigate } from 'react-router-dom'

const FEATURES = [
  {icon:'🧠',color:'rgba(255,77,109,.12)',title:'Bias Intelligence Report',desc:'AI diagnoses 6 cognitive biases costing you money — with your personal score on each axis.',to:'bias'},
  {icon:'🔥',color:'rgba(255,107,53,.12)',title:'Daily Habit Streak',desc:'5 micro-tasks per day. Log spending, take a quiz, review your portfolio. Earn XP. Stay consistent.',to:'dashboard'},
  {icon:'📈',color:'rgba(0,212,170,.12)',title:'Investment Simulator',desc:'Trade real NSE stocks and crypto with ₹1,00,000 virtual cash. Weekly AI autopsy of your decisions.',to:'simulator'},
  {icon:'🕵️',color:'rgba(84,160,255,.12)',title:'Fraud Detection Training',desc:'RBI/SEBI-style scam scenarios daily. Spot red flags before real money is at risk.',to:'fraud'},
  {icon:'🤖',color:'rgba(108,71,255,.12)',title:'AI Finance Mentor',desc:'Claude-powered mentor who knows your biases, portfolio, and habits. Answers in real time.',to:'mentor'},
  {icon:'💎',color:'rgba(255,215,0,.12)',title:'Financial Health Score',desc:'Your 0–850 CIBIL-style score tracking savings, investing, consistency, and bias improvement.',to:'dashboard'},
]
const TICKER = ['Rahul gained 840 XP today','Priya\'s streak: 47 days 🔥','Arnav avoided a ₹50,000 scam','NIFTY 50: +1.2% today','Sneha leveled up to Level 9','BTC: ₹68,24,300 · +2.4%','Vikas\'s health score: 812/850','Meera completed 30-day streak']

export default function LandingPage() {
  const nav = useNavigate()
  return (
    <div style={{position:'relative',overflow:'hidden',minHeight:'100vh'}}>
      {/* Orbs */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',overflow:'hidden'}}>
        <div style={{position:'absolute',width:500,height:500,borderRadius:'50%',background:'#6C47FF',top:-200,left:-100,filter:'blur(80px)',opacity:.35,animation:'float 8s ease-in-out infinite'}}/>
        <div style={{position:'absolute',width:400,height:400,borderRadius:'50%',background:'#00D4AA',top:100,right:-150,filter:'blur(80px)',opacity:.35,animation:'float 8s ease-in-out 3s infinite'}}/>
        <div style={{position:'absolute',width:300,height:300,borderRadius:'50%',background:'#FF6B35',bottom:0,left:'40%',filter:'blur(80px)',opacity:.35,animation:'float 8s ease-in-out 5s infinite'}}/>
      </div>
      <style>{`@keyframes float{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-30px) scale(1.05)}}@keyframes scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>

      {/* Hero */}
      <div style={{position:'relative',zIndex:1,textAlign:'center',padding:'80px 24px 60px'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(108,71,255,.1)',border:'1px solid #6C47FF44',borderRadius:20,padding:'6px 16px',fontSize:12,color:'#6C47FF',marginBottom:24}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:'#00D4AA',animation:'pulse 1.5s infinite'}}/> Live — 4,821 users active now
        </div>
        <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'clamp(36px,6vw,72px)',fontWeight:800,lineHeight:1.1,marginBottom:16,background:'linear-gradient(135deg,#fff 30%,#6C47FF 70%,#00D4AA)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
          Your Brain Is Costing<br/>You Money
        </h1>
        <p style={{fontSize:18,color:'#9090B0',maxWidth:520,margin:'0 auto 32px',lineHeight:1.6}}>
          FinanciaX uses AI to find your financial blind spots — then trains you out of them, one daily habit at a time.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:56}}>
          <button onClick={()=>nav('/bias')} style={{background:'#6C47FF',color:'#fff',border:'none',padding:'14px 28px',borderRadius:12,fontSize:15,fontWeight:600,cursor:'pointer'}}>Start Free Bias Report →</button>
          <button onClick={()=>nav('/dashboard')} style={{background:'transparent',color:'#F0F0FF',border:'1px solid #2A2A3E',padding:'14px 28px',borderRadius:12,fontSize:15,cursor:'pointer'}}>See How It Works</button>
        </div>
        <div style={{display:'flex',gap:24,justifyContent:'center',flexWrap:'wrap',marginBottom:60}}>
          {[['₹2.3L','avg money lost to biases'],['6','cognitive patterns tracked'],['93%','improve in 30 days']].map(([num,label])=>(
            <div key={label} style={{textAlign:'center'}}>
              <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:28,fontWeight:500,color:'#00D4AA'}}>{num}</div>
              <div style={{fontSize:12,color:'#9090B0',marginTop:4}}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticker */}
      <div style={{background:'#12121A',borderTop:'1px solid #2A2A3E',borderBottom:'1px solid #2A2A3E',padding:'10px 0',overflow:'hidden',marginBottom:60}}>
        <div style={{display:'flex',gap:40,animation:'scroll 25s linear infinite',width:'max-content'}}>
          {[...TICKER,...TICKER].map((t,i)=>(
            <span key={i} style={{whiteSpace:'nowrap',fontSize:13,color:'#9090B0'}}>{t}</span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{padding:'60px 24px',maxWidth:1100,margin:'0 auto'}}>
        <h2 style={{fontFamily:'Syne,sans-serif',fontSize:32,textAlign:'center',marginBottom:8}}>Everything you need to win with money</h2>
        <p style={{textAlign:'center',color:'#9090B0',marginBottom:40}}>Six powerful modules, one daily habit. Built for Indian Gen Z & millennials.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
          {FEATURES.map(f=>(
            <div key={f.title} onClick={()=>nav('/'+f.to)} style={{background:'#12121A',border:'1px solid #2A2A3E',borderRadius:20,padding:24,cursor:'pointer',transition:'all .3s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='#6C47FF44';(e.currentTarget as HTMLElement).style.transform='translateY(-4px)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='#2A2A3E';(e.currentTarget as HTMLElement).style.transform='translateY(0)'}}>
              <div style={{width:44,height:44,borderRadius:12,background:f.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,marginBottom:16}}>{f.icon}</div>
              <div style={{fontSize:16,fontWeight:600,marginBottom:8}}>{f.title}</div>
              <div style={{fontSize:13,color:'#9090B0',lineHeight:1.6}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{background:'linear-gradient(135deg,rgba(108,71,255,.2),rgba(0,212,170,.1))',borderTop:'1px solid #6C47FF44',borderBottom:'1px solid #6C47FF44',padding:'60px 24px',textAlign:'center'}}>
        <h2 style={{fontFamily:'Syne,sans-serif',fontSize:36,marginBottom:12}}>Start Your Free Bias Report →</h2>
        <p style={{color:'#9090B0',marginBottom:24}}>10 questions. 3 minutes. A lifetime of better financial decisions.</p>
        <button onClick={()=>nav('/bias')} style={{background:'#6C47FF',color:'#fff',border:'none',padding:'16px 36px',borderRadius:12,fontSize:16,fontWeight:600,cursor:'pointer'}}>Get Started — It's Free</button>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.5)}}`}</style>
    </div>
  )
}
