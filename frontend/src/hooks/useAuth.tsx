import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { login as apiLogin, getMe } from '../lib/api'
import type { User } from '../types'
interface Ctx { user:User|null; loading:boolean; login:(e:string,p:string)=>Promise<void>; logout:()=>void }
const C = createContext<Ctx>({} as Ctx)
export const useAuth = () => useContext(C)
export function AuthProvider({ children }:{ children:ReactNode }) {
  const [user,setUser] = useState<User|null>(null)
  const [loading,setLoading] = useState(true)
  useEffect(()=>{
    const t=localStorage.getItem('token')
    if(t) getMe().then(r=>setUser(r.data)).catch(()=>localStorage.removeItem('token')).finally(()=>setLoading(false))
    else setLoading(false)
  },[])
  const login=async(email:string,password:string)=>{
    const r=await apiLogin(email,password)
    localStorage.setItem('token',r.data.access_token)
    const me=await getMe(); setUser(me.data)
  }
  const logout=()=>{localStorage.removeItem('token');setUser(null)}
  return <C.Provider value={{user,loading,login,logout}}>{children}</C.Provider>
}
