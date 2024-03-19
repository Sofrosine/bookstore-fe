"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import Button from "../Button";
import useAuthStore from "@/store/authStore";

const Navbar = () => {
  const authStore = useAuthStore();

  const { logout } = authStore || {};

  return (
    <header className="flex items-center justify-between navbar-gradient-background px-[4rem] py-2">
      <Link href={"/"} className="relative w-[153px] h-[54px]">
        <Image fill alt="logo" src={"/logos/logo-white.png"} />
      </Link>
      <Button
        onClick={() => logout()}
        className="bg-white text-primary py-3 px-8 hover:bg-white"
      >
        Logout
      </Button>
    </header>
  );
};

export default Navbar;
