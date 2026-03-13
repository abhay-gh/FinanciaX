import { useState, useRef, useEffect } from 'react'
import { sendChat } from '../lib/api'

const MISSIONS = [
  {title:'Hold through volatility',desc:"Don't sell any holdings for 7 days, even if they drop",xp:150,status:'active',days:3},
  {title:'Dollar-cost average SIP',desc:'Set up a ₹1,000 weekly SIP in an index fund',xp:200,status:'active',days:0},
  {title:'Log spending 5 days straight',desc:'Complete the daily spend log for 5 consecutive days',xp:100,status:'completed',days:0},
]
const QUICK_QS = [
  'Why am I holding TCS at a loss?',
  'Should I invest in crypto right now?',
  'Explain ELSS vs PPF tax saving',
  "What's a good emergency fund size for me?",
  'Review my portfolio allocation',
]
interface Msg { role:'user'|'assistant'; content:string }

export default function MentorPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {role:'assistant',content:"Hey! 👋 I've analyzed your portfolio and bias profile. Your Loss Aversion score (82/100) is your biggest obstacle right now.\n\nI noticed you've been holding TCS even though your entry thesis changed. Want me to walk you through a decision framework for that?"}
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[messages])

  const send = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return
    setInput('')
    const newMsgs: Msg[] = [...messages, {role:'user',content}]
    setMessages(newMsgs); setLoading(true)
    try {
      const r = await sendChat(newMsgs)
      setMessages([...newMsgs, {role:'assistant',content:r.data.reply}])
    } catch {
      // fallback local responses
      const low = content.toLowerCase()
      const reply = low.includes('tcs') ? '"Holding an asset while its story has changed is a classic loss aversion trap. The loss already happened. Selling and reinvesting in a better opportunity is the rational move. Want me to create a decision checklist?'
        : low.includes('crypto') ? '"BTC and ETH show strong momentum, but your bias profile shows high overconfidence on trending assets. Cap crypto at 5-7% of your portfolio. Want me to calculate what that looks like?'
        : low.includes('sip') ? '"The biggest lever available to you right now is time in market. A ₹5,000/month SIP at 12% CAGR for 20 years = ₹49.4 lakh. Want to set up an SIP reminder mission?'
        : '"Based on your bias profile, focus on building consistency first. Your Loss Aversion score of 82 suggests fear-based decisions. Small, consistent actions over 90 days will rewire that pattern. Shall I create a custom 30-day mission?"'
      setMessages([...newMsgs, {role:'assistant',content:reply}])
    } finally { setLoading(false) }
  }

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:16,padding:24,height:'calc(100vh - 80px)',maxWidth:1200,margin:'0 auto'}}>
      {/* Chat */}
      <div style={{background:'#12121A',border:'1px solid #2A2A3E',borderRadius:20,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid #2A2A3E',display:'flex',alignItems:'center',gap:12,flexShrink:0}}>
          <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#6C47FF,#00D4AA)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🤖</div>
          <div><div style={{fontSize:14,fontWeight:600}}>Arjun AI</div><div style={{fontSize:11,color:'#00D4AA'}}>● Claude-Powered · Knows your biases</div></div>
          <div style={{marginLeft:'auto',fontSize:11,color:'#555570'}}>Context-aware</div>
        </div>

        <div style={{flex:1,overflowY:'auto',padding:16,display:'flex',flexDirection:'column',gap:12}}>
          {messages.map((m,i)=>(
            <div key={i} style={{maxWidth:'75%',padding:'10px 14px',borderRadius:12,fontSize:13,lineHeight:1.6,alignSelf:m.role==='user'?'flex-end':'flex-start',background:m.role==='user'?'#6C47FF':'#1A1A26',borderBottomRightRadius:m.role==='user'?4:12,borderBottomLeftRadius:m.role==='assistant'?4:12,whiteSpace:'pre-wrap'}}>
              {m.content}
            </div>
          ))}
          {loading && (
            <div style={{maxWidth:'75%',padding:'10px 14px',borderRadius:12,background:'#1A1A26',borderBottomLeftRadius:4,alignSelf:'flex-start'}}>
              <div style={{display:'inline-flex',gap:4,padding:'4px 0'}}>
                {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:'#9090B0',animation:'typeBounce .9s ease infinite',animationDelay:`${i*.2}s`}}/>)}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        <div style={{padding:'12px 16px',borderTop:'1px solid #2A2A3E',display:'flex',gap:10,flexShrink:0}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
            placeholder="Ask about investing, habits, biases..."
            disabled={loading}
            style={{flex:1,background:'#1A1A26',border:'1px solid #2A2A3E',color:'#F0F0FF',padding:'10px 14px',borderRadius:8,fontSize:13,outline:'none',fontFamily:'Space Grotesk,sans-serif'}}/>
          <button onClick={()=>send()} disabled={loading||!input.trim()} style={{background:'#6C47FF',border:'none',color:'#fff',width:36,height:36,borderRadius:8,cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center',opacity:loading||!input.trim()?.5:1}}>↑</button>
        </div>
      </div>

      {/* Sidebar */}
      <div style={{display:'flex',flexDirection:'column',gap:16,overflowY:'auto'}}>
        <div style={{background:'#12121A',border:'1px solid #2A2A3E',borderRadius:20,padding:20}}>
          <div style={{fontSize:12,textTransform:'uppercase',letterSpacing:'.08em',color:'#555570',marginBottom:16,fontWeight:600}}>Active Missions</div>
          {MISSIONS.map((m,i)=>(
            <div key={i} style={{background:'#1A1A26',border:'1px solid #2A2A3E',borderRadius:12,padding:14,marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>{m.title}</div>
              <div style={{fontSize:12,color:'#9090B0',marginTop:4}}>{m.desc}</div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginTop:8}}>
                <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'#FFD700'}}>+{m.xp} XP</div>
                <div style={{fontSize:10,padding:'2px 8px',borderRadius:10,fontWeight:600,background:m.status==='completed'?'rgba(0,212,170,.1)':'rgba(108,71,255,.1)',color:m.status==='completed'?'#00D4AA':'#6C47FF'}}>
                  {m.status==='completed'?'✓ Done':'Active'+(m.days?` · Day ${m.days}`:'')}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{background:'#12121A',border:'1px solid #2A2A3E',borderRadius:20,padding:20}}>
          <div style={{fontSize:12,textTransform:'uppercase',letterSpacing:'.08em',color:'#555570',marginBottom:16,fontWeight:600}}>Quick Questions</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {QUICK_QS.map(q=>(
              <button key={q} onClick={()=>send(q)} style={{background:'transparent',color:'#9090B0',border:'1px solid #2A2A3E',padding:'8px 12px',borderRadius:8,cursor:'pointer',textAlign:'left',fontSize:12,fontFamily:'Space Grotesk,sans-serif',transition:'all .2s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='#6C47FF44';(e.currentTarget as HTMLElement).style.color='#F0F0FF'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='#2A2A3E';(e.currentTarget as HTMLElement).style.color='#9090B0'}}>
                → {q}
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes typeBounce{0%,80%,100%{transform:scale(.8);opacity:.4}40%{transform:scale(1.2);opacity:1}}`}</style>
    </div>
  )
}
