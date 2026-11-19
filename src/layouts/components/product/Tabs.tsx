import Accordion from "@/shortcodes/Accordion";
import FieldDetails from "./FieldDetails";

export default function Tabs({descriptionHtml, fields = []}: {descriptionHtml: string; fields?: {title:string; value:string}[]}) {
 const parts = descriptionHtml.split("--- split content ---");
 return <div className="border-t border-border bg-white">{parts[0]?.trim() && <Accordion title="Produktbeskrivning"><div className="content" dangerouslySetInnerHTML={{__html:parts[0]}} /></Accordion>}{parts[1]?.trim() && <Accordion title="Mer information"><div className="content" dangerouslySetInnerHTML={{__html:parts[1]}} /></Accordion>}{fields.map((field,index)=><Accordion key={field.title+index} title={field.title}><FieldDetails value={field.value}/></Accordion>)}</div>;
}
