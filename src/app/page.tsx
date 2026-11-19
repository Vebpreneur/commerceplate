export const dynamic = "force-dynamic";

import CollectionsSlider from "@/components/CollectionsSlider";
import HeroSlider from "@/components/HeroSlider";
import SkeletonCategory from "@/components/loadings/skeleton/SkeletonCategory";
import SkeletonFeaturedProducts from "@/components/loadings/skeleton/SkeletonFeaturedProducts";
import config from "@/config/config.json";
import { getCollectionProducts, getCollections, getProducts } from "@/lib/shopify";
import FeaturedProducts from "@/partials/FeaturedProducts";
import SeoMeta from "@/partials/SeoMeta";
import { Suspense } from "react";

const { collections } = config.shopify;

const ShowHeroSlider = async () => {
  const sliderImages = await getCollectionProducts({
    collection: collections.hero_slider,
  });
  const { products } = sliderImages;
  const featured = products.length ? products : (await getProducts({})).products.filter((product) => product.availableForSale && product.featuredImage).slice(0, 3);
  return featured.length ? <HeroSlider products={featured} /> : null;
};

const ShowCollections = async () => {
  const collections = await getCollections();
  return <CollectionsSlider collections={collections} />;
};

const ShowFeaturedProducts = async () => {
  const { products } = await getCollectionProducts({
    collection: collections.featured_products,
    reverse: false,
  });
  const featured = products.length ? products : (await getProducts({})).products.slice(0, 8);
  return <FeaturedProducts products={featured} />;
};

const Home = () => {

  return (
    <>
      <SeoMeta />
      <section>
        <div className="container">
          <div className="bg-light py-10 lg:py-16 rounded-xl">
            <Suspense>
              <ShowHeroSlider />
            </Suspense>
          </div>
        </div>
      </section>

      {/* category section  */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-6 md:mb-14">
            <h2>Upptäck sortimentet</h2>
          </div>
          <Suspense fallback={<SkeletonCategory />}>
            <ShowCollections />
          </Suspense>
        </div>
      </section>

      {/* Featured Products section  */}
      <section>
        <div className="container">
          <div className="text-center mb-6 md:mb-14">
            <h2 className="mb-2">Utvalda produkter</h2>
            <p className="md:h5">Smartare vardag för dig och din katt.</p>
          </div>
          <Suspense fallback={<SkeletonFeaturedProducts />}>
            <ShowFeaturedProducts />
          </Suspense>
        </div>
      </section>


    </>
  );
};

export default Home;
