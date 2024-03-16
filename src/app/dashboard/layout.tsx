"use client";

import Navbar from "@/components/Navbar";
import useAuthStore from "@/store/authStore";
import { usePathname, useRouter } from "next/navigation";
import { FC, PropsWithChildren, useEffect, useState } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const authStore = useAuthStore();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    getUser();
  }, [pathname, authStore]);

  const getUser = () => {
    setLoading(true);

    if (authStore?.data?.token) {
      if (authStore?.data?.user?.status === "pending") {
        router.replace("/dashboard/user-verify");
      } else {
        router.replace("/dashboard/profile");
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
      <div className="pt-8 px-4 md:px-[16.5rem]">{children}</div>
      <div className="text-primary text-subtitle-3 absolute bottom-6 flex justify-center w-full">
        <div>© 2024 by sewarna creative</div>
      </div>
    </div>
  );
};

export default Layout;
