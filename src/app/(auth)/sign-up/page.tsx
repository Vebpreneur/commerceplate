"use client";

import { CustomerError } from "@/lib/shopify/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";

export interface FormData {
  firstName?: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
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

  const handleSignUp = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/customer/sign-up", {
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
      console.error("Error during sign-up:", error);
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
              <h1 className="mb-3">Skapa konto</h1>
              <p className="text-neutral-600">
                Fyll i dina uppgifter för att skapa ett kundkonto hos Pawlira.
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Namn</label>
                <input
                  name="firstName"
                  className="form-input border border-neutral-300 rounded-xl bg-white px-4 py-3.5"
                  placeholder="Ditt namn"
                  type="text"
                  required
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">E-postadress</label>
                <input
                  name="email"
                  className="form-input border border-neutral-300 rounded-xl bg-white px-4 py-3.5"
                  placeholder="namn@exempel.se"
                  type="email"
                  required
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Lösenord</label>
                <input
                  name="password"
                  className="form-input border border-neutral-300 rounded-xl bg-white px-4 py-3.5"
                  placeholder="••••••••"
                  type="password"
                  required
                  onChange={handleChange}
                />
              </div>

              {errorMessages.map((error: CustomerError) => (
                <p
                  key={error.code}
                  className="font-medium text-red-600 text-sm mt-2"
                >
                  *{error.message}
                </p>
              ))}

              <button
                type="submit"
                className="btn btn-primary rounded-full w-full mt-4"
              >
                {loading ? (
                  <BiLoaderAlt className="animate-spin mx-auto" size={22} />
                ) : (
                  "Skapa konto"
                )}
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-x-1.5 text-sm mt-6">
              <p className="text-neutral-600">
                Genom att skapa ett konto godkänner du våra
              </p>
              <Link
                className="underline font-medium text-black"
                href="/terms-services"
              >
                köpvillkor
              </Link>
            </div>

            <div className="flex justify-center gap-x-2 text-sm mt-3">
              <p className="text-neutral-600">
                Har du redan ett konto?
              </p>
              <Link
                className="underline font-medium text-black"
                href="/login"
              >
                Logga in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
