"use client";

import Button from "@/components/Button";
import PopupOk from "@/components/Popup/PopupOk";
import APICall from "@/config/axios";
import { API_URL } from "@/constants/api";
import useAuthStore from "@/store/authStore";
import { useErrorStore } from "@/store/errorStore";
import Image from "next/image";
import React, { useState } from "react";

const UserVerify = () => {
  const errorStore = useErrorStore();
  const authData = useAuthStore((state) => state.data);
  const [showPopup, setShowPopup] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendVerify = async () => {
    setLoading(true);
    try {
      const response = await APICall.post(API_URL.REGISTER_RESEND_VERIFY, {
        email: authData?.user?.email,
      });
      if (response.status === 200) {
        setShowPopup(true);
        setBtnDisable(true);
      }
    } catch (error: any) {
      errorStore?.setMessage(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white-06 border-2 border-primary-white rounded-2xl p-8 text-center flex flex-col items-center">
      <p className="text-primary font-bold text-subtitle-3">
        Welcome to IBHC 2024
      </p>
      <p className="py-6 text-grey text-body-1">Hi {authData?.user?.name},</p>
      <p className="text-grey text-body-1 mb-6">
        We need to verify that this is your email address to complete your
        registration for IBHC 2024.
        <br />
        Once this is complete, we can process your application.
      </p>
      <Button disabled={btnDisable} loading={loading} onClick={sendVerify}>
        Verify Now
      </Button>
      <p className="py-6 text-grey text-body-1">
        If you are having any issues with your account, please contact us
      </p>
      <div className="flex items-center text-primary text-body-2 gap-1">
        <Image
          src={"/icons/IcLocationGreen.svg"}
          height={24}
          width={24}
          alt=""
        />
        <span>
          Jl. Medika, Sendowo, Sinduadi, Kec. Mlati, Kabupaten Sleman, Daerah
          Istimewa Yogyakarta 55281
        </span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <div className="flex items-center text-primary text-body-2 gap-1">
          <Image src={"/icons/IcCallGreen.svg"} height={24} width={24} alt="" />
          <span>+62 8232 5601 925</span>
        </div>
        <div className="flex items-center text-primary text-body-2 gap-1">
          <Image
            src={"/icons/IcEmailGreen.svg"}
            height={24}
            width={24}
            alt=""
          />
          <span>admin@ibhc2024.id | cbmhfkugm@ugm.ac.id</span>
        </div>
      </div>
      {showPopup && (
        <PopupOk
          title="Verify link has been sent"
          description="Please check your email"
          onClose={() => {
            setShowPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default UserVerify;
