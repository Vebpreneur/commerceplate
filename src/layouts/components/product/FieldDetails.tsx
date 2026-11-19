type Entry={label:string;value:string};
function splitLine(line:string):Entry|null{
 const match=line.match(/^\s*[-•]?\s*([^:]{2,65}):\s*(.+)$/);
 if(!match||/https?$/i.test(match[1]))return null;
 return {label:match[1].trim(),value:match[2].trim()};
}
export default function FieldDetails({value}:{value:string}){
 const lines=value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
 const entries=lines.map(splitLine);
 if(lines.length>=2&&entries.every((e):e is Entry=>e!==null))return <dl className="pawlira-detail-values">{entries.map((e,i)=><div key={e.label+i}><dt>{e.label}</dt><dd>{e.value}</dd></div>)}</dl>;
 if(lines.length>=2&&lines.every(s=>/^[-•]\s/.test(s)))return <ul className="pawlira-detail-list">{lines.map((s,i)=><li key={i}>{s.replace(/^[-•]\s+/,"")}</li>)}</ul>;
 return <div className="pawlira-detail-paragraphs whitespace-pre-wrap leading-relaxed">{value}</div>;
}
