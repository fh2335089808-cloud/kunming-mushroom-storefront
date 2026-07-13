"use client";
import { useState } from "react";
export function Button({children,className="",onClick}:{children:React.ReactNode;className?:string;onClick?:()=>void}){return <button onClick={onClick} className={`rounded-xl bg-forest-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-900 ${className}`}>{children}</button>}
export function ToastButton({children}:{children:React.ReactNode}){const [ok,setOk]=useState(false);return <Button onClick={()=>setOk(true)}>{ok?"已加入购物车":children}</Button>}
