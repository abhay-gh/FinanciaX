import { useState } from 'react'

const ASSETS = [
  {symbol:'RELIANCE',name:'Reliance Industries',type:'stock',price:2847.50,change:1.24},
  {symbol:'TCS',name:'Tata Consultancy Services',type:'stock',price:3621.80,change:-0.48},
  {symbol:'INFY',name:'Infosys Ltd',type:'stock',price:1498.30,change:0.83},
  {symbol:'HDFCBANK',name:'HDFC Bank',type:'stock',price:1623.15,change:0.21},
  {symbol:'BTC',name:'Bitcoin',type:'crypto',price:6824300,change:2.41},
  {symbol:'ETH',name:'Ethereum',type:'crypto',price:362800,change:1.87},
  {symbol:'SOL',name:'Solana',type:'crypto',price:14820,change:3.12},
  {symbol:'MIRAE_FLEXI',name:'Mirae Asset Flexi Cap',type:'mutual_fund',price:32.84,change:0.34},
  {symbol:'AXIS_SB',name:'Axis Small Cap Fund',type:'mutual_fund',price:87.21,change:0.58},
]
interface Holding { symbol:string; name:string; qty:number; avg:number; current:number; type:string }
const INITIAL_HOLDINGS: Holding[] = [
  {symbol:'RELIANCE',name:'Reliance',qty:5,avg:2710,current:2847.50,type:'stock'},
  {symbol:'TCS',name:'TCS',qty:2,avg:3540,current:3621.80,type:'stock'},
  {symbol:'ETH',name:'Ethereum',qty:0.15,avg:340000,current:362800,type:'crypto'},
  {symbol:'MIRAE_FLEXI',name:'Mirae Flexi',qty:250,avg:31.20,current:32.84,type:'mutual_fund'},
]

const fmtINR = (n: number) => '₹' + Math.abs(n).toLocaleString('en-IN',{maximumFractionDigits:2})

export default function SimulatorPage() {
  const [holdings, setHoldings] = useState<Holding[]>(INITIAL_HOLDINGS)
  const [cash, setCash] = useState(34210)
  const [selected, setSelected] = useState<typeof ASSETS[0]|null>(null)
  const [search, setSearch] = useState('')
  const [qty, setQty] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string, ok=true) => { setToast(msg); setTimeout(()=>setToast(''),3000) }

  const total = cash + holdings.reduce((s,h)=>s+h.current*h.qty, 0)
  const initTotal = 100000
  const pct = ((total-initTotal)/initTotal*100)

  const filtered = search ? ASSETS.filter(a=>a.symbol.toLowerCase().includes(search.toLowerCase())||a.name.toLowerCase().includes(search.toLowerCase())) : []

  const executeTrade = (type: 'buy'|'sell') => {
    if (!selected) { showToast('Select an asset first',false); return }
    const q = parseFloat(qty); if (!q||q<=0) { showToast('Enter a valid quantity',false); return }
    const total = q * selected.price
    if (type==='buy') {
      if (total>cash) { showToast('Insufficient cash!',false); return }
      setCash(c=>c-total)
      setHoldings(prev=>{
        const ex = prev.find(h=>h.symbol===selected.symbol)
        if (ex) return prev.map(h=>h.symbol===selected.symbol?{...h,avg:(h.avg*h.qty+total)/(h.qty+q),qty:h.qty+q}:h)
        return [...prev,{symbol:selected.symbol,name:selected.name,qty:q,avg:selected.price,current:selected.price,type:selected.type}]
      })
      showToast(`Bought ${q} ${selected.symbol} for ${fmtINR(total)} ✓`)
    } else {
      const ex = holdings.find(h=>h.symbol===selected.symbol)
      if (!ex||ex.qty<q) { showToast("You don't have enough to sell",false); return }
      setCash(c=>c+total)
      setHoldings(prev=>prev.map(h=>h.symbol===selected.symbol?{...h,qty:h.qty-q}:h).filter(h=>h.qty>0))
      showToast(`Sold ${q} ${selected.symbol} for ${fmtINR(total)} ✓`)
    }
    setQty('')
  }

  const inp: React.CSSProperties = {width:'100%',background:'#0A0A0F',border:'1px solid #2A2A3E',color:'#F0F0FF',padding:'10px 14px',borderRadius:8,fontSize:14,outline:'none',marginBottom:10,fontFamily:'Space Grotesk,sans-serif'}
  const C: React.CSSProperties = {background:'#12121A',border:'1px solid #2A2A3E',borderRadius:20,padding:20}

  return (
    <div>
      {toast&&<div style={{position:'fixed',bottom:24,right:24,background:'#1A1A26',border:'1px solid rgba(0,212,170,.3)',borderRadius:12,padding:'14px 18px',fontSize:13,zIndex:9999,color:'#F0F0FF'}}>{toast}</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:16,padding:24,maxWidth:1200,margin:'0 auto'}}>
        <div>
          {/* Portfolio header */}
          <div style={{...C,marginBottom:16}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:16}}>
              <div>
                <div style={{fontSize:12,textTransform:'uppercase',letterSpacing:'.08em',color:'#555570',marginBottom:4}}>Virtual Portfolio</div>
                <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:36,fontWeight:500}}>₹{Math.round(total).toLocaleString('en-IN')}</div>
                <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:14,marginTop:4,color:pct>=0?'#00D4AA':'#FF4D6D'}}>
                  {pct>=0?'+':''}{fmtINR(total-initTotal)} · {pct>=0?'+':''}{pct.toFixed(2)}% all time
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:12,color:'#9090B0'}}>Cash Available</div>
                <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:20,marginTop:4}}>₹{Math.round(cash).toLocaleString('en-IN')}</div>
              </div>
            </div>
            {/* Mini chart visual */}
            <div style={{height:4,background:'#1A1A26',borderRadius:2,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${Math.min(total/200000*100,100)}%`,background:'linear-gradient(90deg,#6C47FF,#00D4AA)',borderRadius:2}}/>
            </div>
          </div>

          {/* Holdings */}
          <div style={C}>
            <div style={{fontSize:12,textTransform:'uppercase',letterSpacing:'.08em',color:'#555570',marginBottom:16,fontWeight:600}}>Holdings</div>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
              <thead>
                <tr>{['Asset','Qty','Avg Buy','LTP','P&L','Action'].map(h=><th key={h} style={{fontSize:11,textTransform:'uppercase',letterSpacing:'.07em',color:'#555570',textAlign:'left',padding:'8px 12px',borderBottom:'1px solid #2A2A3E'}}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {holdings.map(h=>{
                  const pnlPct=(h.current-h.avg)/h.avg*100
                  const pnlAmt=(h.current-h.avg)*h.qty
                  return (
                    <tr key={h.symbol} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#1A1A26'} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}>
                      <td style={{padding:'10px 12px',borderBottom:'1px solid rgba(42,42,62,.5)'}}><div style={{fontWeight:600}}>{h.symbol}</div><div style={{fontSize:11,color:'#555570'}}>{h.name}</div></td>
                      <td style={{padding:'10px 12px',borderBottom:'1px solid rgba(42,42,62,.5)',fontFamily:'JetBrains Mono,monospace'}}>{h.qty}</td>
                      <td style={{padding:'10px 12px',borderBottom:'1px solid rgba(42,42,62,.5)',fontFamily:'JetBrains Mono,monospace'}}>₹{h.avg.toLocaleString('en-IN',{maximumFractionDigits:2})}</td>
                      <td style={{padding:'10px 12px',borderBottom:'1px solid rgba(42,42,62,.5)',fontFamily:'JetBrains Mono,monospace'}}>₹{h.current.toLocaleString('en-IN',{maximumFractionDigits:2})}</td>
                      <td style={{padding:'10px 12px',borderBottom:'1px solid rgba(42,42,62,.5)',fontFamily:'JetBrains Mono,monospace',color:pnlPct>=0?'#00D4AA':'#FF4D6D'}}>
                        {pnlPct>=0?'+':''}{pnlPct.toFixed(2)}%
                        <div style={{fontSize:11}}>{pnlAmt>=0?'+':''}{fmtINR(pnlAmt)}</div>
                      </td>
                      <td style={{padding:'10px 12px',borderBottom:'1px solid rgba(42,42,62,.5)'}}>
                        <button onClick={()=>{setSelected(ASSETS.find(a=>a.symbol===h.symbol)||null);setSearch(h.symbol);setShowSearch(false)}} style={{background:'rgba(255,77,109,.1)',border:'1px solid rgba(255,77,109,.25)',color:'#FF4D6D',padding:'4px 10px',borderRadius:8,cursor:'pointer',fontSize:11}}>Sell</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trade panel */}
        <div>
          <div style={{...C,marginBottom:16}}>
            <div style={{fontSize:12,textTransform:'uppercase',letterSpacing:'.08em',color:'#555570',marginBottom:12,fontWeight:600}}>Trade</div>
            <div style={{position:'relative'}}>
              <input style={inp} placeholder="Search stocks, crypto, MF..." value={search} onChange={e=>{setSearch(e.target.value);setShowSearch(true)}} onFocus={()=>setShowSearch(true)}/>
              {showSearch && filtered.length>0 && (
                <div style={{background:'#0A0A0F',border:'1px solid #2A2A3E',borderRadius:8,maxHeight:180,overflowY:'auto',marginBottom:10}}>
                  {filtered.map(a=>(
                    <div key={a.symbol} onClick={()=>{setSelected(a);setSearch(a.symbol);setShowSearch(false)}} style={{padding:'10px 14px',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:13,borderBottom:'1px solid rgba(42,42,62,.5)'}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#1A1A26'} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}>
                      <div><div style={{fontWeight:600}}>{a.symbol}</div><div style={{fontSize:11,color:'#555570'}}>{a.type}</div></div>
                      <div style={{fontFamily:'JetBrains Mono,monospace',color:a.change>=0?'#00D4AA':'#FF4D6D'}}>₹{a.price.toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{background:'#1A1A26',borderRadius:12,padding:16}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>{selected?`${selected.symbol} — ${selected.name}`:'Select an asset above'}</div>
              {selected&&<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}><span style={{fontSize:12,color:'#9090B0'}}>Current Price</span><span style={{fontFamily:'JetBrains Mono,monospace',fontSize:14}}>₹{selected.price.toLocaleString('en-IN')}</span></div>}
              <input style={inp} type="number" min="1" placeholder="Quantity" value={qty} onChange={e=>setQty(e.target.value)}/>
              {selected&&qty&&<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:12,color:'#9090B0',marginBottom:10}}><span>Total Amount</span><span style={{fontFamily:'JetBrains Mono,monospace'}}>₹{(parseFloat(qty)*selected.price).toLocaleString('en-IN',{maximumFractionDigits:0})}</span></div>}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                <button onClick={()=>executeTrade('buy')} style={{background:'rgba(0,212,170,.15)',border:'1px solid rgba(0,212,170,.3)',color:'#00D4AA',padding:10,borderRadius:8,cursor:'pointer',fontWeight:600,fontSize:13,fontFamily:'Space Grotesk,sans-serif'}}>▲ BUY</button>
                <button onClick={()=>executeTrade('sell')} style={{background:'rgba(255,77,109,.1)',border:'1px solid rgba(255,77,109,.25)',color:'#FF4D6D',padding:10,borderRadius:8,cursor:'pointer',fontWeight:600,fontSize:13,fontFamily:'Space Grotesk,sans-serif'}}>▼ SELL</button>
              </div>
            </div>
          </div>

          <div style={C}>
            <div style={{fontSize:12,textTransform:'uppercase',letterSpacing:'.08em',color:'#555570',marginBottom:12,fontWeight:600}}>Trending Today</div>
            {ASSETS.slice(0,5).map(a=>(
              <div key={a.symbol} onClick={()=>{setSelected(a);setSearch(a.symbol);setShowSearch(false)}} style={{display:'flex',alignItems:'center',padding:'8px 0',borderBottom:'1px solid #2A2A3E',cursor:'pointer'}}>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{a.symbol}</div><div style={{fontSize:11,color:'#555570'}}>{a.name}</div></div>
                <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:12,color:a.change>=0?'#00D4AA':'#FF4D6D'}}>{a.change>=0?'+':''}{a.change}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
