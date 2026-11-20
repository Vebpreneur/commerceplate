import Link from "next/link";
import { humanize } from "@/lib/utils/textConverter";
import { LuChevronRight } from "react-icons/lu";

const PageHeader = ({ title }: { title: string }) => {
  const cleanTitle = humanize(title);
  return (
    <section className="pawlira-catalog-intro" style={{ background: "#faf8f3" }}>
      <div className="container">
        <nav aria-label="Brödsmulor" className="pawlira-catalog-breadcrumb">
          <Link href="/">Hem</Link>
          <LuChevronRight strokeWidth={1.5} />
          <span aria-current="page">{cleanTitle}</span>
        </nav>
        <h1>{cleanTitle}</h1>
      </div>
    </section>
  );
};

export default PageHeader;
