import Image from "next/image";
import Link from "next/link";

export default function Logo({src,variant="black",width=176,className="",onClick}:{src?:string;variant?:"black"|"white";width?:number;className?:string;onClick?:()=>void}){
 const logo=src||`/images/pawlira-logo-${variant}.svg`;
 return <Link href="/" className={`pawlira-logo inline-flex shrink-0 items-center ${className}`} aria-label="Pawlira – startsida" onClick={onClick}>
 <Image src={logo} alt="Pawlira – Smart Pet Care" width={width} height={Math.round(width*(variant==="white"?493/1650:485/1635))} unoptimized className="block h-auto max-w-full" style={{width,height:"auto"}}/>
 </Link>;
}
