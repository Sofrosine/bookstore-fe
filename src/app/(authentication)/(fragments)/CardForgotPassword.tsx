"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import PopupOk from "@/components/Popup/PopupOk";
import APICall from "@/config/axios";
import { API_URL } from "@/constants/api";
import { useErrorStore } from "@/store/errorStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TypeOf, z } from "zod";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(1, { message: "Email is required" }),
});

type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>;
const CardForgotPassword = () => {
  const errorStore = useErrorStore();
  const router = useRouter();

  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const methods = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const { handleSubmit, setValue, watch } = methods;

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await APICall.post(API_URL.RESET_PASSWORD, {
        email: data?.email,
      });
      if (response.status === 200) {
        setShowPopup(true);
      }
    } catch (error: any) {
      errorStore?.setMessage(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white-06 rounded-2xl border-2 border-primary-white px-8 pt-8 pb-10 shadow-xl w-full md:w-1/2 xl:w-1/3 2xl:w-1/4 z-50">
      <div className="flex items-center justify-center gap-2 px-12 mb-8">
        <span className="text-subtitle-3 font-bold text-primary">
          Reset Password
        </span>
        <Image src={"/logos/logo.png"} alt="" height={56} width={140} />
      </div>
      <div className="text-body-1 text-grey text-center mb-8">
        {
          "Enter the email associated with your account and we'll send an email with instructions to reset your password."
        }
      </div>
      <FormProvider {...methods}>
        <form
          autoComplete="off"
          className="flex flex-col gap-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Email"
            placeholder="Input email"
            type="email"
            name="email"
            id="email"
            icon={
              <Image
                src={"/icons/IcEnvelope.svg"}
                height={24}
                width={24}
                alt="envelope"
              />
            }
            setValue={setValue}
          />
          <Button loading={loading} type="submit" className="w-full">
            Send Instructions
          </Button>
        </form>
      </FormProvider>
      {showPopup && (
        <PopupOk
          onClose={() => {
            router.push("/login");
          }}
          title="Check your email"
          description="We have sent a password recover instructions to your email."
        />
      )}
    </div>
  );
};

export default CardForgotPassword;
