export const fmt=(n:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n)
export const fmtDate=(d:string)=>new Date(d).toLocaleDateString('en-IN',{month:'short',day:'numeric'})
export const currentYM=()=>{const n=new Date();return{year:n.getFullYear(),month:n.getMonth()+1}}
