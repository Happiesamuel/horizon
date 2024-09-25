import AuthForm from "@/components/AuthForm";
import React from "react";

const Signout = () => {
  // const loggedInUser = await getLoggedInUser();
  // console.log(loggedInUser, "dsffdjydjy");

  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type="sign-up" />
    </section>
  );
};

export default Signout;
