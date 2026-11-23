"use client";
import {useState,type FormEvent} from "react";
type State="idle"|"sending"|"success"|"error";
export default function ContactForm({supportEmail}:{supportEmail:string|null}){
 const [status,setStatus]=useState<State>("idle");
 const [feedback,setFeedback]=useState("");
 const [values,setValues]=useState({name:"",email:"",topic:"Produktfråga",order:"",message:"",website:""});
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(status==="sending")return;setStatus("sending");setFeedback("");
  try{
   const result=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(values)});
   const data=await result.json();
   if(result.ok&&data.ok){setStatus("success");setValues({name:"",email:"",topic:"Produktfråga",order:"",message:"",website:""});return;}
   if(data.fallback&&supportEmail){
    const subject=encodeURIComponent("Pawlira: "+values.topic);
    const body=encodeURIComponent("Namn: "+values.name+"\nE-post: "+values.email+(values.order?"\nOrdernummer: "+values.order:"")+"\n\n"+values.message);
    window.location.href="mailto:"+supportEmail+"?subject="+subject+"&body="+body;
    setStatus("idle");setFeedback("Ditt e-postprogram öppnas med meddelandet ifyllt. Skicka det därifrån.");
    return;
   }
   setStatus("error");setFeedback(data.message||"Meddelandet kunde inte skickas.");
  }catch{setStatus("error");setFeedback("Anslutningen misslyckades. Försök igen.");}
 }
 const change=(key:keyof typeof values,value:string)=>setValues(old=>({...old,[key]:value}));
 const field="pawlira-contact-input";
 return <form className="pawlira-contact-form" onSubmit={submit} aria-label="Kontaktformulär">
  <div className="pawlira-contact-form-fields">
   <label>Fullständigt namn <span aria-hidden="true">*</span><input className={field} autoComplete="name" value={values.name} maxLength={120} required minLength={2} onChange={e=>change("name",e.target.value)} placeholder="Ditt namn"/></label>
   <label>E-postadress <span aria-hidden="true">*</span><input className={field} type="email" autoComplete="email" value={values.email} maxLength={254} required onChange={e=>change("email",e.target.value)} placeholder="namn@exempel.se"/></label>
   <label>Vad gäller ditt ärende? <span aria-hidden="true">*</span><select className={field} value={values.topic} required onChange={e=>change("topic",e.target.value)}><option>Produktfråga</option><option>Beställning</option><option>Leverans</option><option>Retur eller reklamation</option><option>Övrigt</option></select></label>
   <label>Ordernummer (valfritt)<input className={field} value={values.order} maxLength={100} onChange={e=>change("order",e.target.value)} placeholder="Om frågan gäller en beställning"/></label>
  </div>
  <label>Meddelande <span aria-hidden="true">*</span><textarea className={field} value={values.message} required minLength={10} maxLength={5000} rows={6} onChange={e=>change("message",e.target.value)} placeholder="Beskriv hur vi kan hjälpa dig"/></label>
  <div className="pawlira-contact-honeypot" aria-hidden="true"><label>Webbplats<input tabIndex={-1} autoComplete="off" value={values.website} onChange={e=>change("website",e.target.value)}/></label></div>
  <div className="pawlira-contact-form-submit"><button type="submit" className="btn btn-primary rounded-full" disabled={status==="sending"}>{status==="sending"?"Skickar…":"Skicka meddelande"}</button><p>Vi använder dina uppgifter för att besvara din förfrågan. <a href="/privacy-policy">Integritetspolicy</a>.</p></div>
  {status==="success"&&<p role="status" className="pawlira-contact-success">Tack! Ditt meddelande har skickats.</p>}
  {feedback&&<p role={status==="error"?"alert":"status"} className={status==="error"?"pawlira-contact-error":"pawlira-contact-notice"}>{feedback}</p>}
 </form>;
}
