"use client";

import Navbar from "@/components/Navbar";
import { extractToken } from "@/config/axios";
import useAuthStore from "@/store/authStore";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, PropsWithChildren, useEffect, useState } from "react";

const HEADER_ROUTES = [
  {
    title: "Profile",
    path: "/dashboard/profile",
    iconActive: "/icons/IcUserWhite.svg",
    iconInactive: "/icons/IcUserBlack.svg",
  },
  {
    title: "Abstract",
    path: "/dashboard/abstract",
    iconActive: "/icons/IcFileWhite.svg",
    iconInactive: "/icons/IcFileBlack.svg",
  },
  {
    title: "Register",
    path: "/dashboard/registration",
    iconActive: "/icons/IcCalendarWhite.svg",
    iconInactive: "/icons/IcCalendarBlack.svg",
  },
];

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const authStore = useAuthStore();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    getUser();
  }, [pathname, authStore?.data]);

  const getUser = () => {
    setLoading(true);
    if (extractToken()) {
      if (authStore?.data && authStore?.data?.user?.status === "pending") {
        router.replace("/user-verify");
      }
      setLoading(false);
    } else {
      router.replace("/login");
    }
  };

  if (loading) return <></>;
  return (
    <div className="min-h-[100vh]">
      <Navbar />
      <div className="pt-8 px-4 md:px-[8rem] 2xl:px-[16.5rem]">
        <div className="p-8 border border-primary-white rounded-2xl z-20 bg-white-06 min-h-[82.5vh] flex flex-col">
          <div className="flex items-center gap-6 border-b-2 border-primary mb-6">
            {HEADER_ROUTES.map((val) => {
              return (
                <Link key={val?.path} href={val?.path}>
                  <div
                    className={clsx(
                      "flex items-center gap-2 py-2 px-3",
                      pathname?.includes(val?.path)
                        ? "bg-primary rounded-tl-lg rounded-tr-lg"
                        : ""
                    )}
                  >
                    <Image
                      src={
                        pathname.includes(val?.path)
                          ? val?.iconActive
                          : val?.iconInactive
                      }
                      alt=""
                      height={24}
                      width={24}
                    />
                    <p
                      className={clsx(
                        pathname.includes(val?.path)
                          ? "text-white"
                          : "text-black-text"
                      )}
                    >
                      {val?.title}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="flex flex-col flex-1">{children}</div>
        </div>
        <div className="text-primary text-subtitle-3 flex justify-center w-full mt-6 pb-4">
          <div>© 2024 by sewarna creative</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
