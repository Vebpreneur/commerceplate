"use client";
import {motion,useReducedMotion} from "framer-motion";
import type {ReactNode} from "react";
// Content is readable before hydration and when JavaScript or motion is disabled.
export default function FadeInSection({children,className=""}:{children:ReactNode;className?:string}){
 const reduced=useReducedMotion();
 return <motion.div className={className} initial={false} whileInView={reduced?undefined:{y:[8,0],opacity:[.94,1]}} viewport={{once:true,margin:"-60px"}} transition={{duration:reduced?0:.55,ease:[.22,1,.36,1]}}>{children}</motion.div>;
}
