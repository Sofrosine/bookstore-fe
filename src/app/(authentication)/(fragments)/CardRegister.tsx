"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import PopupOk from "@/components/Popup/PopupOk";
import APICall from "@/config/axios";
import { API_URL } from "@/constants/api";
import { useErrorStore } from "@/store/errorStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TypeOf, z } from "zod";

const registerSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(1, { message: "Email is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type RegisterInput = TypeOf<typeof registerSchema>;
const CardRegister = () => {
  const errorStore = useErrorStore();

  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });
  const { handleSubmit, setValue, watch } = methods;

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await APICall.post(API_URL.REGISTER, {
        email: data?.email,
        name: data?.name,
        password: data?.password,
      });
      if (response.status === 201) {
        setShowPopup(true);
        setValue("email", "");
        setValue("name", "");
        setValue("password", "");
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
        <span className="text-subtitle-3 font-bold text-primary">Sign up</span>
      </div>
      <FormProvider {...methods}>
        <form
          autoComplete="off"
          className="flex flex-col gap-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-8">
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
            <Input
              label="Name"
              placeholder="Input name"
              name="name"
              id="name"
              icon={
                <Image
                  src={"/icons/IcUser.svg"}
                  height={24}
                  width={24}
                  alt="envelope"
                />
              }
              setValue={setValue}
            />
            <Input
              label="Password"
              placeholder="Input password"
              type={showPassword ? "text" : "password"}
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
                  src={
                    showPassword
                      ? "/icons/IcEyeOpen.svg"
                      : "/icons/IcEyeClose.svg"
                  }
                  height={24}
                  width={24}
                  alt="envelope"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:cursor-pointer"
                />
              }
              setValue={setValue}
            />
            <Button type="submit" loading={loading}>
              Register
            </Button>
          </div>
        </form>
      </FormProvider>
      {showPopup && (
        <PopupOk
          onClose={() => {
            router.push("/login");
          }}
          title="Registration Completed Successfully"
          description="Please login"
        />
      )}
    </div>
  );
};

export default CardRegister;
