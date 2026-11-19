"use client";
import {motion,useReducedMotion} from "framer-motion";
import type {ReactNode} from "react";
export default function FadeInSection({children,className=""}:{children:ReactNode;className?:string}){
 const reduced=useReducedMotion();
 return <motion.div className={className} initial={reduced?false:{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}} transition={{duration:reduced?0:.55,ease:[.22,1,.36,1]}}>{children}</motion.div>;
}
