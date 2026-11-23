import {NextRequest,NextResponse} from "next/server";
export const runtime="nodejs";
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean=(value:unknown,max:number)=>typeof value==="string"?value.trim().slice(0,max):"";
export async function POST(request:NextRequest){
 try{
  if(Number(request.headers.get("content-length")||0)>18000)return NextResponse.json({message:"Meddelandet är för långt."},{status:413});
  const data=await request.json();
  if(data.website)return NextResponse.json({ok:true});
  const name=clean(data.name,120),email=clean(data.email,254),topic=clean(data.topic,100),order=clean(data.order,100),message=clean(data.message,5000);
  if(name.length<2||!emailPattern.test(email)||message.length<10||!topic)return NextResponse.json({message:"Fyll i namn, giltig e-postadress, ärende och meddelande."},{status:400});
  const recipient=process.env.PAWLIRA_SUPPORT_EMAIL?.trim()||"";
  const sender=process.env.PAWLIRA_CONTACT_FROM_EMAIL?.trim()||"";
  const key=process.env.RESEND_API_KEY?.trim()||"";
  if(!emailPattern.test(recipient)||!emailPattern.test(sender)||!key)return NextResponse.json({message:"Formulärleverans är inte aktiverad.",fallback:true},{status:503});
  const safe=(value:string)=>value.replace(/[<>\r\n]/g," ");
  const plain=[`Ärende: ${topic}`,`Namn: ${name}`,`E-post: ${email}`,order?`Ordernummer: ${order}`:"", "",message].filter(Boolean).join("\n");
  const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({from:sender,to:[recipient],reply_to:email,subject:`Pawlira kontakt – ${safe(topic)}`,text:plain}),cache:"no-store"});
  if(!response.ok){console.error("Pawlira contact email delivery error",response.status);return NextResponse.json({message:"Det gick inte att skicka meddelandet. Försök igen eller använd e-post."},{status:502});}
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({message:"Det gick inte att behandla meddelandet."},{status:400});}
}
