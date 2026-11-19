"use client";
import Image from "next/image";
import {useState} from "react";
export default function EditorialPhoto({src,alt,sizes="(max-width:767px) 90vw, 50vw"}:{src:string;alt:string;sizes?:string}){
 const [failed,setFailed]=useState(false);
 return <Image src={failed?"/images/hero.png":src} alt={failed?"Pawliras produktvärld":alt} fill sizes={sizes} className="object-cover" onError={()=>setFailed(true)}/>;
}
