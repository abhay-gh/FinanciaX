import { useEffect, useRef } from 'react'

const SCORES = {loss:82,over:45,herd:38,present:67,anchor:55,mental:30}
const LABELS = ['Loss Aversion','Overconfidence','Herd Mentality','Present Bias','Anchoring','Mental Accounting']
const COLORS = ['#FF4D6D','#FF9F43','#54A0FF','#5F27CD','#00D2D3','#1DD1A1']
const DESCS = [
  'You feel losses ~2.3x more intensely than equivalent gains. This makes you hold losers too long and sell winners too early.',
  'You rate your financial knowledge higher than average. This leads to under-diversification and overtrading.',
  'You follow crowd sentiment more than your own research. You buy when others are buying, sell when others panic.',
  'You prefer smaller immediate rewards over larger future ones. Monthly savings feel painful despite long-term benefits.',
  'You use past prices as reference points for future value. A stock at ₹800 that was ₹500 still feels "expensive."',
  'You treat money differently based on its source. A tax refund feels spendable; salary feels for bills.',
]

function drawRadar(canvas: HTMLCanvasElement, scores: number[]) {
  const ctx = canvas.getContext('2d')!
  const w=canvas.width,h=canvas.height,cx=w/2,cy=h/2,r=Math.min(w,h)*0.36,axes=6
  let start: number|null = null
  function draw(p: number) {
    ctx.clearRect(0,0,w,h)
    for(let ring=1;ring<=4;ring++){ctx.beginPath();for(let i=0;i<axes;i++){const a=(Math.PI*2*i/axes)-Math.PI/2;const rr=r*ring/4;ctx.lineTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a))};ctx.closePath();ctx.strokeStyle='rgba(255,255,255,.05)';ctx.lineWidth=1;ctx.stroke()}
    for(let i=0;i<axes;i++){const a=(Math.PI*2*i/axes)-Math.PI/2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));ctx.strokeStyle='rgba(255,255,255,.08)';ctx.stroke()}
    ctx.beginPath()
    for(let i=0;i<axes;i++){const a=(Math.PI*2*i/axes)-Math.PI/2;const val=(scores[i]/100)*r*p;ctx.lineTo(cx+val*Math.cos(a),cy+val*Math.sin(a))}
    ctx.closePath()
    const grad=ctx.createRadialGradient(cx,cy,0,cx,cy,r);grad.addColorStop(0,'rgba(108,71,255,0.4)');grad.addColorStop(1,'rgba(0,212,170,0.15)')
    ctx.fillStyle=grad;ctx.fill();ctx.strokeStyle='rgba(108,71,255,0.8)';ctx.lineWidth=2;ctx.stroke()
    COLORS.forEach((c,i)=>{
      const a=(Math.PI*2*i/axes)-Math.PI/2;const val=(scores[i]/100)*r*p
      ctx.beginPath();ctx.arc(cx+val*Math.cos(a),cy+val*Math.sin(a),5,0,Math.PI*2);ctx.fillStyle=c;ctx.fill()
      ctx.font='11px Space Grotesk,sans-serif';ctx.fillStyle='rgba(144,144,176,0.9)';ctx.textAlign='center'
      ctx.fillText(LABELS[i].split(' ')[0],cx+r*1.22*Math.cos(a),cy+r*1.22*Math.sin(a)+4)
    })
  }
  function anim(ts: number){if(!start)start=ts;const p=Math.min((ts-start)/1200,1);draw(p);if(p<1)requestAnimationFrame(anim)}
  requestAnimationFrame(anim)
}

export default function BiasPage() {
  const radarRef = useRef<HTMLCanvasElement>(null)
  const scores = Object.values(SCORES)
  useEffect(()=>{ if(radarRef.current) drawRadar(radarRef.current, scores) },[])

  return (
    <div>
      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,rgba(108,71,255,.15),rgba(0,212,170,.08))',border:'1px solid #6C47FF44',borderRadius:28,padding:32,margin:24,textAlign:'center'}}>
        <div style={{fontSize:12,color:'#9090B0',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:8}}>Your Financial DNA</div>
        <div style={{fontFamily:'Syne,sans-serif',fontSize:40,fontWeight:800,color:'#FF4D6D'}}>Loss Aversion</div>
        <div style={{fontSize:14,color:'#9090B0',marginTop:8}}>Your #1 cognitive bias · Retake available in <span style={{fontFamily:'JetBrains Mono,monospace',color:'#00D4AA'}}>17 days</span></div>
        <canvas ref={radarRef} width={360} height={300} style={{margin:'24px auto 0',display:'block'}}/>
      </div>

      {/* Bias cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16,padding:'0 24px 24px'}}>
        {LABELS.map((label,i)=>{
          const s=scores[i];const risk=s>70?'High Risk':s>40?'Moderate':'Low Risk'
          const rc=s>70?'#FF4D6D':s>40?'#FF9F43':'#00D4AA'
          return (
            <div key={label} style={{background:'#12121A',border:'1px solid #2A2A3E',borderRadius:20,padding:20,transition:'all .3s'}}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform='translateY(-2px)'}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform='translateY(0)'}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                <div style={{fontSize:14,fontWeight:600}}>{label}</div>
                <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:32,fontWeight:500,color:rc}}>{s}</div>
              </div>
              <div style={{height:6,background:'#1A1A26',borderRadius:3,overflow:'hidden',marginBottom:10}}>
                <div style={{height:'100%',width:`${s}%`,background:rc,borderRadius:3,transition:'width 1.2s ease'}}/>
              </div>
              <div style={{display:'inline-block',fontSize:11,padding:'3px 10px',borderRadius:12,fontWeight:600,background:`${rc}1A`,color:rc}}>{risk}</div>
              <div style={{fontSize:12,color:'#9090B0',marginTop:10,lineHeight:1.6}}>{DESCS[i]}</div>
            </div>
          )
        })}
      </div>

      {/* AI Analysis */}
      <div style={{padding:'0 24px 24px'}}>
        <div style={{background:'#12121A',border:'1px solid #2A2A3E',borderRadius:20,padding:20}}>
          <div style={{fontSize:12,textTransform:'uppercase',letterSpacing:'.08em',color:'#555570',marginBottom:16,fontWeight:600}}>AI Analysis</div>
          <div style={{fontSize:14,color:'#9090B0',lineHeight:1.8}}>
            Your responses reveal a strong loss aversion pattern — you're approximately <span style={{color:'#F0F0FF',fontWeight:600}}>2.3× more sensitive to losses</span> than equivalent gains. This is a deeply human trait amplified by India's cultural relationship with financial security.
            <br/><br/>
            In practice, this means you're likely <span style={{color:'#FF4D6D'}}>holding underperforming assets too long</span> (not wanting to "lock in" a loss), and <span style={{color:'#FF4D6D'}}>exiting winners too early</span> (grabbing gains before they disappear). The estimated cost is <span style={{fontFamily:'JetBrains Mono,monospace',color:'#FF4D6D'}}>₹2,400/month</span> in suboptimal decisions.
            <br/><br/>
            The good news: awareness is the first step. The AI Mentor has crafted 3 custom missions to rewire this pattern over the next 21 days.
          </div>
        </div>
      </div>
    </div>
  )
}
