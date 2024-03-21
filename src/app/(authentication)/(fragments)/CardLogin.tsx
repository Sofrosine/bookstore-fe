"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import APICall from "@/config/axios";
import { API_URL } from "@/constants/api";
import useAuthStore from "@/store/authStore";
import { useErrorStore } from "@/store/errorStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TypeOf, z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  remember_me: z.boolean(),
});

type LoginInput = TypeOf<typeof loginSchema>;

const CardLogin = () => {
  const errorStore = useErrorStore();
  const authStore = useAuthStore();
  const router = useRouter();
  const { setData } = authStore || {};

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember_me: false,
    },
  });
  const { handleSubmit, setValue, watch } = methods;

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await APICall.post(API_URL.LOGIN, {
        email: data?.email,
        password: data?.password,
      });
      if (response.status === 200) {
        setData(response?.data?.data);
        if (response?.data?.data?.user?.status === "pending") {
          router.replace("/user-verify");
        } else {
          router.replace("/");
        }
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
          Sign in to
        </span>
        <Image src={"/logos/logo.png"} alt="" height={56} width={140} />
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
            label="Password"
            placeholder="Input password"
            type={showPassword ? "text" : "password"}
            name="password"
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
          <div className="flex items-center justify-between">
            <Input
              label="Remember me"
              type="checkbox"
              name="remember_me"
              setValue={setValue}
            />
            <Link
              href={"/forgot-password"}
              className="text-body-2 hover:text-primary hover:cursor-pointer"
            >
              Forgot Password
            </Link>
          </div>
          <Button type="submit" loading={loading}>
            Sign In
          </Button>
          <div className="flex flex-col gap-2 text-body-1 text-center">
            <p className="text-grey-2">Don’t have account?</p>
            <Link href={"/register"} className="self-center">
              <p className="hover:text-primary">Sign Up</p>
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CardLogin;
