import Input from "@/components/Input";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CardForgotPassword from "../(fragments)/CardForgotPassword";

const ForgotPassword = () => {
  return (
    <div className="flex justify-center items-center h-[100vh] px-4">
      <CardForgotPassword />
      <div className="text-primary text-subtitle-3 absolute bottom-6">
        © 2024 by sewarna creative
      </div>
    </div>
  );
};

export default ForgotPassword;
