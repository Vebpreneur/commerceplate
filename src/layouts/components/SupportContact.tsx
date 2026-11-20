"use client";
import {useState} from "react";
import Link from "next/link";
import {LuArrowUpRight} from "react-icons/lu";
export default function SupportContact({email,product}:{email?:string|null;product?:string}){
 const [name,setName]=useState(""),[reply,setReply]=useState(""),[message,setMessage]=useState(""),[opened,setOpened]=useState(false);
 return <aside className="pawlira-faq-contact-panel"><h3>Hittade du inte svaret?</h3><p>Kontakta kundservice.</p>{email?<form onSubmit={e=>{e.preventDefault();const subject=product?"Produktfråga: "+product:"Fråga till Pawlira";const body="Namn: "+name+"\nE-post: "+reply+"\n\n"+message;window.location.href="mailto:"+email+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);setOpened(true)}}><label>Namn<input autoComplete="name" required maxLength={100} value={name} onChange={e=>setName(e.target.value)}/></label><label>E-post<input type="email" autoComplete="email" required maxLength={254} value={reply} onChange={e=>setReply(e.target.value)}/></label><label>Meddelande<textarea required rows={4} maxLength={2000} value={message} onChange={e=>setMessage(e.target.value)}/></label><button type="submit" className="btn btn-inverse">Öppna e-post<LuArrowUpRight size={17} strokeWidth={1.5}/></button>{opened&&<p role="status">Skicka meddelandet från ditt e-postprogram.</p>}</form>:<Link href="/contact#kontakt" className="btn btn-inverse">Kontakta oss<LuArrowUpRight size={17} strokeWidth={1.5}/></Link>}</aside>
}
