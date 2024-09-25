"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { authformSchema } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";
import PlaidLink from "./PlaidLink";

const AuthForm = ({ type }: { type: string }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = authformSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });
        if (response) router.push("/");
      }
      if (type === "sign-up") {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address: data.address!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          dob: data.dob!,
          ssn: data.ssn!,
          email: data.email,
          password: data.password,
        };
        const newUser = await signUp(userData);
        setUser(newUser);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer items-center flex gap-1 ">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "sign-in" : "sign-up"}
          </h1>{" "}
          <p className="text-16 font-normal text-gray-600">
            {user
              ? "Link Your account to get started"
              : "Please enter your details"}{" "}
          </p>
        </div>
      </header>

      {user ? (
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant="primary" />
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      placeholder="Enter your first name"
                      name="firstName"
                      label="First Name"
                      control={form.control}
                    />
                    <CustomInput
                      placeholder="Enter your last name"
                      name="lastName"
                      label="Last Name"
                      control={form.control}
                    />
                  </div>
                  <CustomInput
                    placeholder="Enter your specific address"
                    name="address"
                    label="Address"
                    control={form.control}
                  />
                  <CustomInput
                    placeholder="Enter your city"
                    name="city"
                    label="City"
                    control={form.control}
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      placeholder="Example: NY"
                      name="state"
                      label="State"
                      control={form.control}
                    />
                    <CustomInput
                      placeholder="Example: 11101"
                      name="postalCode"
                      label="Postal Code"
                      control={form.control}
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      placeholder="YYYY-MM-DD"
                      name="dob"
                      label="Date of Birth"
                      control={form.control}
                    />
                    <CustomInput
                      placeholder="Example: 1234"
                      name="ssn"
                      label="SSN"
                      control={form.control}
                    />
                  </div>
                </>
              )}
              <CustomInput
                placeholder="Enter your email"
                name="email"
                label="Email"
                control={form.control}
              />
              <CustomInput
                placeholder="Enter your password"
                name="password"
                label="Password"
                control={form.control}
              />

              <div className="flex flex-col gap-4">
                <Button className="form-btn" type="submit">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      &nbsp;Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign in"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p className="font-normal text-14 text-gray-600">
              {type === "sign-in"
                ? "Don't have an account"
                : "Already have an account"}
            </p>
            <Link
              className="form-link"
              href={type === "sign-in" ? "/sign-up" : "sign-in"}
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
