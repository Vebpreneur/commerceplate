import Link from "next/link";
import type {ReactNode} from "react";
import {LuChevronRight} from "react-icons/lu";

type Crumb={label:string;href?:string};
export default function PawliraPageHero({title,description,breadcrumbs=[],children,className=""}:{title:string;description:string;breadcrumbs?:Crumb[];children?:ReactNode;className?:string}){
 const trail:Crumb[]=[{label:"Hem",href:"/"},...breadcrumbs,{label:title}];
 return <section className={"pawlira-catalog-intro pawlira-content-hero "+className}><div className="container">
  <nav aria-label="Brödsmulor" className="pawlira-catalog-breadcrumb">{trail.map((item,index)=><span className="pawlira-breadcrumb-part" key={item.label+index}>{index>0&&<LuChevronRight aria-hidden="true" strokeWidth={1.5}/>}{item.href?<Link href={item.href}>{item.label}</Link>:<span aria-current="page">{item.label}</span>}</span>)}</nav>
  <h1>{title}</h1><p>{description}</p>{children}
 </div></section>;
}
