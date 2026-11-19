"use client";

import Link from "next/link";
import { useState } from "react";
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ImageFallback from "@/helpers/ImageFallback";

const CollectionsSlider = ({ collections }: { collections: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [prevEl, setPrevEl] = useState<HTMLDivElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLDivElement | null>(null);
  const collectionsData = (collections ?? []).filter((item:any) => !["frontpage","home-page","homepage","featured-products"].includes(item.handle) && !item.handle.startsWith("hidden-") && item.title.toLowerCase() !== "home page");

  if (!collectionsData.length) {
    return null;
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Swiper
        modules={[Pagination, Navigation]}
        // navigation={true}
        slidesPerView={Math.min(2,collectionsData.length)}
        spaceBetween={10}
        breakpoints={{
          640: {
            slidesPerView: Math.min(2,collectionsData.length),
            spaceBetween: 20,
          },
          768: {
            slidesPerView: Math.min(3, collectionsData.length),
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: Math.min(3,collectionsData.length),
            spaceBetween: 24,
          },
        }}
        navigation={{
          prevEl,
          nextEl,
        }}
      >
        {collectionsData?.map((item: any) => {
          const { title, handle, image } = item;
          return (
            <SwiperSlide key={handle}>
              <Link href={`/products?c=${encodeURIComponent(handle)}`} className="pawlira-card pawlira-category-card">
                {image?.url && <div className="pawlira-card-image"><ImageFallback
                  src={image?.url}
                  width={424}
                  height={306}
                  alt={title}
                  className="w-full aspect-[4/3] object-contain bg-white rounded-lg"
                /></div>}
                <div className="pt-6 pb-2 flex items-center justify-between gap-3">
                  <h3 className="font-medium text-xl">{title}</h3><span className="pawlira-category-arrow" aria-hidden="true"><HiOutlineArrowNarrowRight size={22}/></span>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}

        <div
          className={`hidden md:block w-full absolute top-[33%] z-10 px-4 text-text-dark ${isHovered
            ? "opacity-100 transition-opacity duration-300 ease-in-out"
            : "opacity-0 transition-opacity duration-300 ease-in-out"
            }`}
        >
          <div
            ref={setPrevEl}
            className="p-2 lg:p-3 rounded-md bg-body cursor-pointer shadow-sm absolute left-4"
          >
            <HiOutlineArrowNarrowLeft size={24} />
          </div>
          <div
            ref={setNextEl}
            className="p-2 lg:p-3 rounded-md bg-body cursor-pointer shadow-sm absolute right-4"
          >
            <HiOutlineArrowNarrowRight size={24} />
          </div>
        </div>
      </Swiper>
    </div>
  );
};

export default CollectionsSlider;
