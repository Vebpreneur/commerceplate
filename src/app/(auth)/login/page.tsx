"use client";

import { CustomerError } from "@/lib/shopify/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { FormData } from "../sign-up/page";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/customer/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setErrorMessages([]);
        const data = responseData;
        localStorage.setItem("user", JSON.stringify(data));
        router.push("/");
      } else {
        const errors = responseData.errors || [];
        setErrorMessages(errors);
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="row">
          <div className="col-11 sm:col-9 md:col-7 lg:col-5 mx-auto">
            <div className="mb-10 text-center">
              <h1 className="mb-3">Logga in</h1>
              <p className="text-neutral-600">
                Ange din e-postadress och ditt lösenord för att logga in.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">E-postadress</label>
                <input
                  className="form-input border border-neutral-300 rounded-xl bg-white px-4 py-3.5"
                  placeholder="namn@exempel.se"
                  type="email"
                  required
                  onChange={handleChange}
                  name="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Lösenord</label>
                <input
                  className="form-input border border-neutral-300 rounded-xl bg-white px-4 py-3.5"
                  placeholder="••••••••"
                  type="password"
                  required
                  onChange={handleChange}
                  name="password"
                />
              </div>

              {errorMessages.map((error: CustomerError) => (
                <p
                  key={error.code}
                  className="font-medium text-red-600 text-sm mt-2"
                >
                  *
                  {error.code === "UNIDENTIFIED_CUSTOMER"
                    ? "Felaktig e-postadress eller lösenord."
                    : error.message || "Felaktig e-postadress eller lösenord."}
                </p>
              ))}

              <button
                type="submit"
                className="btn btn-primary rounded-full w-full mt-4"
              >
                {loading ? (
                  <BiLoaderAlt className="animate-spin mx-auto" size={22} />
                ) : (
                  "Logga in"
                )}
              </button>
            </form>

            <div className="flex justify-center gap-x-2 text-sm mt-6">
              <p className="text-neutral-600">
                Har du inget konto?
              </p>
              <Link
                className="underline font-medium text-black"
                href="/sign-up"
              >
                Skapa konto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
