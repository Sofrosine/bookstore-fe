"use client";

import PopupOk from "@/components/Popup/PopupOk";
import APICall from "@/config/axios";
import { API_URL } from "@/constants/api";
import useAuthStore from "@/store/authStore";
import { useErrorStore } from "@/store/errorStore";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Verify = () => {
  const errorStore = useErrorStore();
  const authStore = useAuthStore();
  const { setData } = authStore || {};

  const [showPopup, setShowPopup] = useState(false);

  const searchParams = useSearchParams();

  const router = useRouter();

  useEffect(() => {
    const userState = localStorage.getItem("@user_data");
    if (!userState) {
      verifyUser();
    } else {
      const userParse = JSON.parse(userState ?? "");
      const { token } = userParse?.state?.data || {};

      verifyUser(token);
    }
  }, []);

  const verifyUser = async (token?: string) => {
    try {
      const response = await APICall.post(API_URL.REGISTER_VERIFY, {
        token: searchParams.get("token"),
      });
      if (response.status === 200) {
        setData({ token: token || "", user: response?.data?.data });
        setShowPopup(true);
      }
    } catch (error: any) {
      errorStore?.setMessage(error?.response?.data?.message);
      router.replace("/login");
    }
  };

  return (
    <div className="flex items-center justify-center h-[100vh] w-[100vw]">
      <div className="circular-progress" />
      {showPopup && (
        <PopupOk
          imageSrc="/icons/IcOkCircle.svg"
          title="Verify Success"
          description="Your account has been verified"
          onClose={() => {
            router.replace("/login");
          }}
        />
      )}
      <div className="text-primary text-subtitle-3 absolute bottom-6 flex justify-center w-full">
        <div>© 2024 by sewarna creative</div>
      </div>
    </div>
  );
};

export default Verify;
