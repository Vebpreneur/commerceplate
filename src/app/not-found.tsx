import SeoMeta from "@/partials/SeoMeta";
import Link from "next/link";

const NotFound = async () => {
  return (
    <>
      <SeoMeta title={"Sidan hittades inte"} />
      <section className="section-sm text-center">
        <div className="container">
          <div className="row justify-center">
            <div className="sm:col-10 md:col-8 lg:col-6">
              <span className="text-[8rem] block font-bold text-text-dark dark:text-darkmode-text-dark">
                404
              </span>
              <h1 className="h2 mb-4">Sidan hittades inte</h1>
              <div className="content">
                <p>
                  Sidan kan ha flyttats eller är tillfälligt otillgänglig.
                </p>
              </div>
              <Link href="/" className="btn btn-primary mt-8">
                Till startsidan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
