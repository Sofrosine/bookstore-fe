"use client";

import useAuthStore from "@/store/authStore";
import Button from "../Button";
import Link from "next/link";

const Navbar = () => {
  const authStore = useAuthStore();

  const { logout } = authStore || {};

  return (
    <header className="flex items-center  justify-between navbar-gradient-background px-[1rem] py-2">
      <div>
        <p className="text-white text-subtitle-3 font-bold">
          {authStore?.data?.user?.name}
        </p>
        <p className="text-white text-body-1">
          Points: {authStore?.data?.user?.points}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Link href={"/orders"} className="text-white font-bold">My Orders</Link>
        <Button
          onClick={() => logout()}
          className="bg-white text-primary py-2 px-8 hover:bg-white"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
