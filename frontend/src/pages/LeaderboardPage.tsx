const LB = [
  {rank:1,name:'Priya S.',initials:'PS',color:'#FFD700',ret:'+18.4%',xp:2840,score:812},
  {rank:2,name:'Rahul M.',initials:'RM',color:'#C0C0C0',ret:'+15.2%',xp:2610,score:791},
  {rank:3,name:'Sneha K.',initials:'SK',color:'#CD7F32',ret:'+14.8%',xp:2480,score:779},
  {rank:4,name:'Vikram B.',initials:'VB',color:'#6C47FF',ret:'+13.1%',xp:2340,score:765},
  {rank:5,name:'Ananya R.',initials:'AR',color:'#00D4AA',ret:'+12.7%',xp:2200,score:754},
  {rank:8,name:'Dev P.',initials:'DP',color:'#9090B0',ret:'+10.1%',xp:1940,score:732},
  {rank:12,name:'Meera T.',initials:'MT',color:'#9090B0',ret:'+8.9%',xp:1720,score:708},
  {rank:14,name:'You (Abhay P.)',initials:'AP',color:'#6C47FF',ret:'+11.3%',xp:1580,score:724,me:true},
  {rank:15,name:'Arun S.',initials:'AS',color:'#9090B0',ret:'+9.8%',xp:1560,score:719},
  {rank:18,name:'Kavya L.',initials:'KL',color:'#9090B0',ret:'+7.2%',xp:1380,score:698},
]
const MEDAL: Record<number,string> = {1:'🥇',2:'🥈',3:'🥉'}

export default function LeaderboardPage() {
  return (
    <div style={{maxWidth:800,margin:'0 auto',padding:24}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <h2 style={{fontFamily:'Syne,sans-serif',fontSize:28}}>Weekly Leaderboard</h2>
        <div style={{width:8,height:8,borderRadius:'50%',background:'#00D4AA',animation:'pulse 1.5s infinite'}}/>
      </div>

      {/* Your rank */}
      <div style={{background:'#12121A',border:'1px solid #2A2A3E',borderRadius:20,marginBottom:24,display:'flex',alignItems:'center',gap:20,padding:'16px 20px'}}>
        <div style={{fontSize:12,color:'#9090B0'}}>Your Rank</div>
        <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:24,color:'#6C47FF'}}>#14</div>
        <div style={{flex:1}}/>
        <div style={{fontSize:12,color:'#9090B0'}}>Portfolio Return</div>
        <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:18,color:'#00D4AA'}}>+11.3%</div>
      </div>

      {LB.map(u=>(
        <div key={u.rank} style={{background:u.me?'rgba(108,71,255,.06)':'#12121A',border:`1px solid ${u.me?'#6C47FF44':'#2A2A3E'}`,borderRadius:12,padding:'14px 16px',display:'flex',alignItems:'center',gap:14,marginBottom:8,transition:'all .2s'}}
          onMouseEnter={e=>{if(!u.me)(e.currentTarget as HTMLElement).style.transform='translateX(3px)'}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateX(0)'}}>
          <div style={{width:28,height:28,borderRadius:'50%',background:(u.rank<=3?['#FFD70022','#C0C0C022','#CD7F3222'][u.rank-1]:'#1A1A26'),color:u.rank<=3?['#FFD700','#C0C0C0','#CD7F32'][u.rank-1]:'#9090B0',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'JetBrains Mono,monospace',fontSize:12,fontWeight:500,flexShrink:0}}>
            {MEDAL[u.rank] ?? u.rank}
          </div>
          <div style={{width:32,height:32,borderRadius:'50%',background:`${u.color}22`,color:u.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>{u.initials}</div>
          <div style={{flex:1,fontSize:14,fontWeight:500}}>{u.name}{u.me?' 👈':''}</div>
          <div style={{display:'flex',gap:16}}>
            <div style={{textAlign:'right'}}><div style={{fontFamily:'JetBrains Mono,monospace',fontSize:13,fontWeight:500,color:parseFloat(u.ret)>=0?'#00D4AA':'#FF4D6D'}}>{u.ret}</div><div style={{fontSize:10,color:'#555570',marginTop:1}}>Return</div></div>
            <div style={{textAlign:'right'}}><div style={{fontFamily:'JetBrains Mono,monospace',fontSize:13,fontWeight:500}}>{u.xp.toLocaleString()}</div><div style={{fontSize:10,color:'#555570',marginTop:1}}>XP</div></div>
            <div style={{textAlign:'right'}}><div style={{fontFamily:'JetBrains Mono,monospace',fontSize:13,fontWeight:500,color:'#00D4AA'}}>{u.score}</div><div style={{fontSize:10,color:'#555570',marginTop:1}}>Score</div></div>
          </div>
        </div>
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.5)}}`}</style>
    </div>
  )
}
