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
  } = useFetch(API_URL.PROFILE, false);
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
    if (authStore?.data?.token) {
      if (authStore?.data?.user?.status === "pending") {
        setLoading(false);
      } else {
        router.replace("/dashboard/profile");
      }
    } else {
      router.replace("/login");
    }
  };

  if (loading || profileLoading) return <></>;
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
