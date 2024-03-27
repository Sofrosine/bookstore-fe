"use client";

import Navbar from "@/components/Navbar";
import { extractToken } from "@/config/axios";
import { API_URL } from "@/constants/api";
import { useFetch } from "@/hooks/useFetch";
import useAuthStore from "@/store/authStore";
import { usePathname, useRouter } from "next/navigation";
import { FC, PropsWithChildren, useEffect, useState } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const {
    data: profileData,
    loading: profileLoading,
    fetchData,
  } = useFetch<{ data: User }>(API_URL.PROFILE, false);
  const [loading, setLoading] = useState(true);

  const authStore = useAuthStore();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [pathname]);

  useEffect(() => {
    if (profileData?.data) {
      authStore.setData({
        token: extractToken(),
        user: profileData?.data,
      });
    }
  }, [profileData]);

  useEffect(() => {
    getUser();
  }, [authStore?.data]);

  const getUser = () => {
    setLoading(true);
    if (extractToken()) {
      setLoading(false);
    } else {
      router.replace("/login");
    }
  };

  if (loading || profileLoading) return <></>;
  return (
    <div className="min-h-[100vh] grid grid-cols-12">
      <div className="hidden md:block md:col-span-3 2xl:col-span-4" />
      <div className="col-span-12 md:col-span-6 2xl:col-span-4">
        <Navbar />
        <div className="mt-0">{children}</div>
      </div>
      <div className="hidden md:block md:col-span-3 2xl:col-span-4" />
    </div>
  );
};

export default Layout;
