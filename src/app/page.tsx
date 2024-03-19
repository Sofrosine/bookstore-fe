"use client";

import useAuthStore from "@/store/authStore";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const authStore = useAuthStore();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    getUser();
  }, [pathname, authStore]);

  const getUser = () => {
    if (authStore?.data?.token) {
      if (authStore?.data?.user?.status === "pending") {
        router.replace("/user-verify");
      } else {
        router.replace("/dashboard/profile");
      }
    } else {
      router.replace("/login");
    }
  };

  return (
    <div>
      <div className="circular-progress" />
    </div>
  );
};

export default Home;
