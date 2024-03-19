"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import PopupOk from "@/components/Popup/PopupOk";
import APICall from "@/config/axios";
import { API_URL } from "@/constants/api";
import { useErrorStore } from "@/store/errorStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TypeOf, z } from "zod";

const resetPasswordSchema = z
  .object({
    password: z.string().min(1, { message: "Password is required" }),
    confirm_password: z
      .string()
      .min(1, { message: "Confirmation password is required" }),
  })
  .refine((data) => data?.confirm_password === data?.password, {
    message: "Password do not match",
    path: ["confirm_password"],
  });

type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
const CardResetPassword = () => {
  const methods = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });
  const { handleSubmit, setValue, watch } = methods;

  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const errorStore = useErrorStore();
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      const response = await APICall.get(
        API_URL.RESET_PASSWORD_VERIFY + `/${params.get("token")}`
      );
      setLoading(false);
    } catch (error: any) {
      errorStore?.setMessage(error?.response?.data?.message);
      router.replace("/login");
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitLoading(true);
    try {
      const response = await APICall.post(API_URL.RESET_PASSWORD_CHANGE, {
        password: data?.password,
        token: params.get("token"),
      });
      if (response.status === 200) {
        setShowPopup(true);
      }
    } catch (error: any) {
      errorStore?.setMessage(error?.response?.data?.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return loading ? (
    <div
      className="circular-progress"
      style={{
        border: "3px solid #55A605",
        borderTop: "3px solid transparent",
        height: "40px",
        width: "40px",
      }}
    />
  ) : (
    <div className="bg-white-06 rounded-2xl border-2 border-primary-white px-8 pt-8 pb-10 shadow-xl w-full md:w-1/2 xl:w-1/3 2xl:w-1/4 z-50">
      <div className="flex items-center justify-center gap-2 px-12 mb-8">
        <span className="text-subtitle-3 font-bold text-primary">
          New Password
        </span>
        <Image src={"/logos/logo.png"} alt="" height={56} width={140} />
      </div>
      <div className="text-body-1 text-grey text-center mb-8">
        {"Your new password must be different from previous used passwords."}
      </div>
      <FormProvider {...methods}>
        <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Password"
            placeholder="Input password"
            type="password"
            name="password"
            id="password"
            icon={
              <Image
                src={"/icons/IcLock.svg"}
                height={24}
                width={24}
                alt="envelope"
              />
            }
            iconRight={
              <Image
                src={"/icons/IcEyeClose.svg"}
                height={24}
                width={24}
                alt="envelope"
              />
            }
            setValue={setValue}
          />
          <Input
            label="Confirm Password"
            placeholder="Input confirm password"
            type="password"
            name="confirm_password"
            id="confirm_password"
            icon={
              <Image
                src={"/icons/IcLock.svg"}
                height={24}
                width={24}
                alt="envelope"
              />
            }
            iconRight={
              <Image
                src={"/icons/IcEyeClose.svg"}
                height={24}
                width={24}
                alt="envelope"
              />
            }
            setValue={setValue}
          />
          <Button type="submit" loading={submitLoading}>
            Reset Password
          </Button>
        </form>
      </FormProvider>
      {showPopup && (
        <PopupOk
          onClose={() => {
            router.replace("/login");
          }}
          title="Success"
          description="Your new password has been created successfully"
        />
      )}
    </div>
  );
};

export default CardResetPassword;
