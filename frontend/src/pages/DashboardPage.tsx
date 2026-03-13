import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMonthlySummary, getSpendingByCat, getNetWorth, getTransactions } from '../lib/api'
import { fmt, currentYM } from '../lib/utils'
import type { MonthlySummary, SpendingByCat, NetWorth } from '../types'

const BIAS_SCORES = {loss:82,over:45,herd:38,present:67,anchor:55,mental:30}
const BIAS_LABELS = ['Loss Aversion','Overconfidence','Herd Mentality','Present Bias','Anchoring','Mental Accounting']
const BIAS_COLORS = ['#FF4D6D','#FF9F43','#54A0FF','#5F27CD','#00D2D3','#1DD1A1']
const MARKET = [
  {name:'NIFTY 50',val:'24,612',chg:'+0.94%',pos:true},
  {name:'SENSEX',val:'81,248',chg:'+0.87%',pos:true},
  {name:'BTC',val:'₹68.2L',chg:'+2.41%',pos:true},
  {name:'ETH',val:'₹3.63L',chg:'+1.87%',pos:true},
  {name:'RELIANCE',val:'₹2,848',chg:'+1.24%',pos:true},
  {name:'TCS',val:'₹3,622',chg:'-0.48%',pos:false},
]
const TASKS_DATA = [
  {icon:'📝',name:"Log Today's Spending",xp:20,type:'spend'},
  {icon:'🧠',name:'Finance Quiz',xp:30,type:'quiz'},
  {icon:'📊',name:'Portfolio Review',xp:20,type:'review'},
  {icon:'🕵️',name:'Fraud Scenario',xp:40,type:'fraud'},
  {icon:'📰',name:'Market Insight',xp:10,type:'insight'},
]
const LEADERBOARD = [
  {rank:1,name:'Priya S.',initials:'PS',color:'#FFD700',ret:'+18.4%'},
  {rank:2,name:'Rahul M.',initials:'RM',color:'#C0C0C0',ret:'+15.2%'},
  {rank:3,name:'Sneha K.',initials:'SK',color:'#CD7F32',ret:'+14.8%'},
  {rank:14,name:'You (Abhay P.)',initials:'AP',color:'#6C47FF',ret:'+11.3%',me:true},
]

function drawRadar(canvas: HTMLCanvasElement, scores: number[], animated = false) {
  const ctx = canvas.getContext('2d')!
  const w = canvas.width, h = canvas.height, cx = w/2, cy = h/2, r = Math.min(w,h)*0.38
  const axes = 6
  function draw(p: number) {
    ctx.clearRect(0,0,w,h)
    for (let ring=1;ring<=4;ring++) {
      ctx.beginPath()
      for (let i=0;i<axes;i++){const a=(Math.PI*2*i/axes)-Math.PI/2;const rr=r*ring/4;ctx.lineTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a))}
      ctx.closePath();ctx.strokeStyle='rgba(255,255,255,.05)';ctx.lineWidth=1;ctx.stroke()
    }
    for (let i=0;i<axes;i++){const a=(Math.PI*2*i/axes)-Math.PI/2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));ctx.strokeStyle='rgba(255,255,255,.08)';ctx.stroke()}
    ctx.beginPath()
    for (let i=0;i<axes;i++){const a=(Math.PI*2*i/axes)-Math.PI/2;const val=(scores[i]/100)*r*p;ctx.lineTo(cx+val*Math.cos(a),cy+val*Math.sin(a))}
    ctx.closePath()
    const grad = ctx.createRadialGradient(cx,cy,0,cx,cy,r)
    grad.addColorStop(0,'rgba(108,71,255,0.4)');grad.addColorStop(1,'rgba(0,212,170,0.15)')
    ctx.fillStyle=grad;ctx.fill()
    ctx.strokeStyle='rgba(108,71,255,0.8)';ctx.lineWidth=2;ctx.stroke()
    BIAS_COLORS.forEach((c,i)=>{
      const a=(Math.PI*2*i/axes)-Math.PI/2;const val=(scores[i]/100)*r*p
      ctx.beginPath();ctx.arc(cx+val*Math.cos(a),cy+val*Math.sin(a),4,0,Math.PI*2);ctx.fillStyle=c;ctx.fill()
      ctx.font='10px Space Grotesk,sans-serif';ctx.fillStyle='rgba(144,144,176,0.9)';ctx.textAlign='center'
      ctx.fillText(BIAS_LABELS[i].split(' ')[0],cx+r*1.2*Math.cos(a),cy+r*1.2*Math.sin(a)+4)
    })
  }
  if (animated){let s:number|null=null;function anim(ts:number){if(!s)s=ts;const p=Math.min((ts-s)/1200,1);draw(p);if(p<1)requestAnimationFrame(anim)};requestAnimationFrame(anim)}
  else draw(1)
}

function drawGauge(canvas: HTMLCanvasElement, score: number) {
  const ctx = canvas.getContext('2d')!
  const w=canvas.width,h=canvas.height,cx=w/2,cy=h*0.82,r=h*0.72
  ctx.clearRect(0,0,w,h)
  ctx.beginPath();ctx.arc(cx,cy,r,Math.PI,0);ctx.strokeStyle='rgba(42,42,62,1)';ctx.lineWidth=16;ctx.stroke()
  const pct=score/850;const color=score>600?'#00D4AA':score>400?'#FF9F43':'#FF4D6D'
  ctx.beginPath();ctx.arc(cx,cy,r,Math.PI,Math.PI+(Math.PI*pct));ctx.strokeStyle=color;ctx.lineWidth=16;ctx.lineCap='round';ctx.stroke()
  ctx.font='bold 40px JetBrains Mono,monospace';ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle'
  ctx.fillText(String(score),cx,cy-16)
  ctx.font='12px Space Grotesk,sans-serif';ctx.fillStyle='rgba(144,144,176,0.8)';ctx.fillText('/ 850',cx,cy+14)
  ctx.font='10px Space Grotesk,sans-serif';ctx.fillStyle='rgba(85,85,112,1)';ctx.fillText('0',cx-r-4,cy+8);ctx.fillText('850',cx+r+4,cy+8)
}

const C: React.CSSProperties = {background:'#12121A',border:'1px solid #2A2A3E',borderRadius:20,padding:20}
const CT: React.CSSProperties = {fontSize:12,textTransform:'uppercase',letterSpacing:'.08em',color:'#555570',marginBottom:16,fontWeight:600}

export default function DashboardPage() {
  const nav = useNavigate()
  const gaugeRef = useRef<HTMLCanvasElement>(null)
  const radarRef = useRef<HTMLCanvasElement>(null)
  const [tasks, setTasks] = useState<Set<number>>(new Set([0,1]))
  const [xp, setXp] = useState(340)
  const [toast, setToast] = useState('')
  const [summary, setSummary] = useState<MonthlySummary|null>(null)
  const [nw, setNw] = useState<NetWorth|null>(null)
  const {year,month} = currentYM()

  useEffect(()=>{
    getMonthlySummary(year,month).then(r=>setSummary(r.data)).catch(()=>{})
    getNetWorth().then(r=>setNw(r.data)).catch(()=>{})
  },[])

  useEffect(()=>{
    if (!gaugeRef.current) return
    let score = 400
    const iv = setInterval(()=>{score+=12;if(score>=724){score=724;clearInterval(iv)};drawGauge(gaugeRef.current!,score)},16)
    return ()=>clearInterval(iv)
  },[])

  useEffect(()=>{
    if (radarRef.current) drawRadar(radarRef.current, Object.values(BIAS_SCORES))
  },[])

  const showToast = (msg: string) => { setToast(msg); setTimeout(()=>setToast(''),3000) }

  const completeTask = (i: number, e: React.MouseEvent) => {
    if (tasks.has(i)) return
    const newTasks = new Set(tasks); newTasks.add(i); setTasks(newTasks)
    setXp(x => x + TASKS_DATA[i].xp)
    showToast(`+${TASKS_DATA[i].xp} XP earned! Task complete! ✓`)
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const fl = document.createElement('div')
    fl.style.cssText=`position:fixed;left:${rect.left}px;top:${rect.top}px;font-family:JetBrains Mono,monospace;color:#FFD700;font-size:16px;font-weight:500;pointer-events:none;z-index:999;animation:floatUp 1.2s ease forwards`
    fl.textContent=`+${TASKS_DATA[i].xp} XP`
    document.body.appendChild(fl); setTimeout(()=>fl.remove(),1300)
  }

  const scores = Object.values(BIAS_SCORES)

  return (
    <div>
      <style>{`@keyframes floatUp{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-60px)}}.toast{position:fixed;bottom:24px;right:24px;background:#1A1A26;border:1px solid #2A2A3E;border-radius:12px;padding:14px 18px;font-size:13px;z-index:9999;transform:translateY(80px);opacity:0;transition:all .3s;max-width:300px}.toast.show{transform:translateY(0);opacity:1;border-color:rgba(0,212,170,.3);background:rgba(0,212,170,.08)}`}</style>
      {toast && <div className="toast show">{toast}</div>}

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:16,padding:24,maxWidth:1200,margin:'0 auto'}}>

        {/* Stat pills */}
        {[
          {icon:'🔥',val:23,label:'Day Streak',color:'#F0F0FF'},
          {icon:'⚡',val:xp,label:'XP Today',color:'#F0F0FF'},
          {icon:'💎',val:724,label:'Health Score / 850',color:'#00D4AA'},
          {icon:'📅',val:`${tasks.size}/5`,label:'Tasks Done',color:'#F0F0FF'},
        ].map(p=>(
          <div key={p.label} style={{background:'#1A1A26',border:'1px solid #2A2A3E',borderRadius:12,padding:'16px 20px',display:'flex',alignItems:'center',gap:14}}>
            <div style={{fontSize:20}}>{p.icon}</div>
            <div><div style={{fontFamily:'JetBrains Mono,monospace',fontSize:22,fontWeight:500,color:p.color}}>{p.val}</div><div style={{fontSize:11,color:'#9090B0',marginTop:2}}>{p.label}</div></div>
          </div>
        ))}

        {/* Health score */}
        <div style={{...C,gridColumn:'span 2'}}>
          <div style={CT}>Financial Health Score</div>
          <canvas ref={gaugeRef} width={280} height={160} style={{display:'block',margin:'0 auto 16px'}}/>
          {[['Savings Rate',72,'#00D4AA'],['Investment Consistency',65,'#6C47FF'],['Streak Score',88,'#FF6B35'],['Quiz Performance',80,'#54A0FF'],['Bias Improvement',55,'#FF4D6D']].map(([label,val,color])=>(
            <div key={label as string} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
              <span style={{fontSize:12,color:'#9090B0',width:180,flexShrink:0}}>{label}</span>
              <div style={{flex:1,height:6,background:'#1A1A26',borderRadius:3,overflow:'hidden'}}><div style={{height:'100%',borderRadius:3,background:color as string,width:`${val}%`,transition:'width 1s ease'}}/></div>
              <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:12,color:'#F0F0FF',marginLeft:'auto',flexShrink:0}}>{val}</span>
            </div>
          ))}
        </div>

        {/* Net worth projection */}
        <div style={{...C,gridColumn:'span 2'}}>
          <div style={CT}>Financial Snapshot</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
            {[
              ['Monthly Income', summary ? fmt(summary.income) : '—', '#00D4AA'],
              ['Monthly Expenses', summary ? fmt(summary.expense) : '—', '#FF6B35'],
              ['Total Assets', nw ? fmt(nw.total_assets) : '—', '#6C47FF'],
              ['Net Worth', nw ? fmt(nw.net_worth) : '—', '#00D4AA'],
            ].map(([label,val,color])=>(
              <div key={label} style={{background:'#1A1A26',borderRadius:8,padding:12}}>
                <div style={{fontSize:11,color:'#9090B0'}}>{label}</div>
                <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:18,marginTop:6,color:color as string}}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:13,color:'#9090B0'}}>Projected gap at 45: <span style={{fontFamily:'JetBrains Mono,monospace',color:'#00D4AA',fontSize:16}}>₹47.2L</span></div>
        </div>

        {/* Today's tasks */}
        <div style={{...C,gridColumn:'span 2'}}>
          <div style={CT}>Today's Tasks</div>
          {TASKS_DATA.map((task,i)=>{
            const done = tasks.has(i)
            return (
              <div key={i} style={{background:done?'rgba(0,212,170,.06)':'#1A1A26',border:`1px solid ${done?'rgba(0,212,170,.3)':'#2A2A3E'}`,borderRadius:12,padding:'14px 16px',display:'flex',alignItems:'center',gap:12,marginBottom:8,cursor:'pointer'}}>
                <div style={{fontSize:18,width:36,height:36,borderRadius:8,background:'#0A0A0F',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{task.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:500}}>{task.name}</div>
                  <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'#FFD700'}}>+{task.xp} XP</div>
                </div>
                <button onClick={(e)=>completeTask(i,e)} style={{background:done?'#00D4AA':'#6C47FF',border:'none',color:'#fff',padding:'6px 14px',borderRadius:8,fontSize:12,cursor:done?'default':'pointer',fontFamily:'Space Grotesk,sans-serif'}}>
                  {done?'✓ Done':'Complete'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Bias snapshot */}
        <div style={C}>
          <div style={CT}>Bias Snapshot</div>
          <div style={{display:'flex',justifyContent:'center'}}>
            <canvas ref={radarRef} width={180} height={160}/>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:12}}>
            {BIAS_LABELS.map((l,i)=>{
              const s=scores[i];const risk=s>70?'high':s>40?'med':'low'
              const colors={high:'rgba(255,77,109,.15)',med:'rgba(255,159,67,.15)',low:'rgba(0,212,170,.12)'}
              const tc={high:'#FF4D6D',med:'#FF9F43',low:'#00D4AA'}
              return <span key={l} style={{fontSize:11,padding:'3px 10px',borderRadius:12,fontWeight:500,background:colors[risk],color:tc[risk],border:`1px solid ${tc[risk]}33`}}>{l.split(' ')[0]} {s}</span>
            })}
          </div>
          <div style={{marginTop:12,fontSize:12,color:'#9090B0'}}>Your biases cost you ~<span style={{fontFamily:'JetBrains Mono,monospace',color:'#FF4D6D'}}>₹2,400/mo</span></div>
        </div>

        {/* Streak */}
        <div style={C}>
          <div style={CT}>Streak</div>
          <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:48,fontWeight:500,color:'#FF6B35',textAlign:'center'}}>23</div>
          <div style={{textAlign:'center',fontSize:12,color:'#9090B0',marginTop:4}}>days in a row</div>
          <div style={{display:'flex',gap:6,justifyContent:'center',marginTop:12}}>
            {['#00D4AA','#00D4AA','#00D4AA','#FF6B35','#00D4AA','#555570','#00D4AA'].map((c,i)=>(
              <div key={i} style={{width:10,height:10,borderRadius:'50%',background:c}}/>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:14,fontSize:13,color:'#9090B0'}}>🛡️ <span style={{fontFamily:'JetBrains Mono,monospace',color:'#F0F0FF'}}>3</span> shields available</div>
        </div>

        {/* AI Mentor nudge */}
        <div style={C}>
          <div style={CT}>AI Mentor</div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#6C47FF,#00D4AA)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🤖</div>
            <div><div style={{fontSize:13,fontWeight:600}}>Arjun AI</div><div style={{fontSize:11,color:'#00D4AA'}}>● Online</div></div>
          </div>
          <div style={{background:'#1A1A26',borderRadius:8,padding:12,fontSize:13,color:'#9090B0',lineHeight:1.6,marginBottom:12}}>"Your SIP date is in 2 days 💡 Your portfolio has 68% in large-cap — want me to suggest a rebalancing strategy?"</div>
          <button onClick={()=>nav('/mentor')} style={{background:'#6C47FF',border:'none',color:'#fff',width:'100%',padding:10,borderRadius:8,fontSize:13,cursor:'pointer',fontFamily:'Space Grotesk,sans-serif'}}>Open Mentor Chat</button>
        </div>

        {/* Leaderboard preview */}
        <div style={C}>
          <div style={CT}>Weekly Leaderboard</div>
          {LEADERBOARD.map(u=>(
            <div key={u.rank} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid #2A2A3E',background:u.me?'rgba(108,71,255,.08)':'transparent',borderRadius:u.me?8:0,paddingLeft:u.me?8:0,paddingRight:u.me?8:0,marginLeft:u.me?-8:0,marginRight:u.me?-8:0}}>
              <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:13,color:'#555570',width:20}}>{u.rank}</div>
              <div style={{width:28,height:28,borderRadius:'50%',background:`${u.color}22`,color:u.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,flexShrink:0}}>{u.initials}</div>
              <div style={{flex:1,fontSize:13}}>{u.name}</div>
              <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:12,color:'#00D4AA'}}>{u.ret}</div>
            </div>
          ))}
          <div style={{marginTop:12,fontSize:12,color:'#6C47FF',cursor:'pointer'}} onClick={()=>nav('/leaderboard')}>See Full Leaderboard →</div>
        </div>

        {/* Live market */}
        <div style={{...C,gridColumn:'span 4'}}>
          <div style={{...CT,display:'flex',alignItems:'center',gap:8}}>Live Market <div style={{width:6,height:6,borderRadius:'50%',background:'#00D4AA',animation:'pulse 1.5s infinite'}}/></div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12}}>
            {MARKET.map(m=>(
              <div key={m.name} style={{background:'#1A1A26',borderRadius:8,padding:'10px 14px'}}>
                <div style={{fontSize:11,color:'#555570'}}>{m.name}</div>
                <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:15,marginTop:4}}>{m.val}</div>
                <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:m.pos?'#00D4AA':'#FF4D6D',marginTop:2}}>{m.chg}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.5)}}`}</style>
    </div>
  )
}
