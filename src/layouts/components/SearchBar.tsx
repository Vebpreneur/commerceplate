"use client";

import { createUrl } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoClose, IoSearch } from "react-icons/io5";

const SearchBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");

  useEffect(() => { setInputValue(searchParams.get("q") || ""); }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    // Search when submitted, not on every keystroke.
  };

  const handleClear = () => {
    setInputValue("");

    const newParams = new URLSearchParams(pathname === "/products" ? searchParams.toString() : "");
    newParams.delete("q");

    if(pathname === "/products" && searchParams.has("q")) router.push(createUrl("/products", newParams));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const search = inputValue.trim();
    const newParams = new URLSearchParams();

    if (search) {
      newParams.set("q", search);
    } else {
      newParams.delete("q");
    }

    router.push(createUrl("/products", newParams));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="pawlira-search-field border border-border rounded-full flex bg-white text-black pl-4 relative"
    >
      <input
        id="searchInput"
        className="bg-transparent border-none search-input focus:ring-transparent p-2 w-full min-w-0"
        aria-label="Sök produkter"
        type="search"
        name="search"
        placeholder="Sök produkter"
        autoComplete="off"
        value={inputValue}
        onChange={handleChange}
      />
      {inputValue && (
        <button
          type="button" aria-label="Rensa sökfält"
          className="p-2 m-1 rounded-full"
          onClick={handleClear}
        >
          <IoClose size={20} />
        </button>
      )}
      <button type="submit" aria-label="Sök" className="search-icon !bg-black !text-white p-2 m-1 rounded-full shrink-0 flex items-center justify-center">
        <IoSearch size={20} style={{color:"#fff",fill:"#fff"}} />
      </button>
    </form>
  );
};

export default SearchBar;
