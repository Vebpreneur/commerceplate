export function categoryEditorial(title:string,handle:string){
 const value=(title+" "+handle).toLowerCase();
 if(/kattlå|kattla|litter|toalett/.test(value))return {heading:"En plats för kattens egna rutiner.",description:"Utforska självrengörande modeller och jämför storlek, rengöringsfunktioner och vilka strötyper som passar.",label:"Toalett och rengöring"};
 if(/foder|mat|feed/.test(value))return {heading:"En vardag med regelbundna måltider.",description:"Jämför foderautomater utifrån kapacitet, portionsinställningar och kattens dagliga måltider.",label:"Mat och måltider"};
 if(/vatten|fontän|fontan|water|fountain/.test(value))return {heading:"Vatten som en naturlig del av hemmet.",description:"Hitta vattenfontäner och jämför behållare, filter, material och hur de rengörs.",label:"Vatten och drickvanor"};
 return {heading:title,description:"Utforska modeller och välj funktioner som passar din katt och ditt hem.",label:"Livet med katt"};
}
