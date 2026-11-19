import Accordion from "@/shortcodes/Accordion";

export default function Tabs({descriptionHtml, fields = []}: {descriptionHtml: string; fields?: {title:string; value:string}[]}) {
 const parts = descriptionHtml.split("--- split content ---");
 return <div className="border-t border-border bg-white">{parts[0]?.trim() && <Accordion title="Produktbeskrivning"><div className="content" dangerouslySetInnerHTML={{__html:parts[0]}} /></Accordion>}{parts[1]?.trim() && <Accordion title="Mer information"><div className="content" dangerouslySetInnerHTML={{__html:parts[1]}} /></Accordion>}{fields.map(field=><Accordion key={field.title} title={field.title}><div className="whitespace-pre-wrap leading-relaxed">{field.value}</div></Accordion>)}</div>;
}
