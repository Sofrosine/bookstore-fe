"use client";

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
      router.replace("/home");
    } else {
      setLoading(false);
    }
  };

  if (loading) return <></>;
  return <div>{children}</div>;
};

export default Layout;
