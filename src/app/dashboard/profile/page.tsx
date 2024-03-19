"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import InputDropdown from "@/components/Input/InputDropdown";
import APICall from "@/config/axios";
import { API_URL } from "@/constants/api";
import { FOOD_PREFERENCES, TITLES } from "@/constants/data";
import useAuthStore from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TypeOf, z } from "zod";

const updateProfileSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(1, { message: "Email is required" }),
  title: z.string(),
  name: z.string().min(1, { message: "Name is required" }),
  country: z.string(),
  province: z.string(),
  city: z.string(),
  address: z.string(),
  phone_number: z.string(),
  food_preference: z.string(),
});

type UpdateProfileInput = TypeOf<typeof updateProfileSchema>;
const Profile = () => {
  const authStore = useAuthStore();

  const methods = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      email: "",
      address: "",
      city: "",
      country: "",
      food_preference: "non_vegetarian",
      name: "",
      phone_number: "",
      province: "",
      title: "mr",
    },
  });
  const { handleSubmit, setValue, watch } = methods;

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      getProfile();
    }
  }, [useAuthStore.persist.hasHydrated]);

  useEffect(() => {
    if (authStore?.data?.user) {
      const {
        email,
        address,
        city,
        country,
        province,
        name,
        phone_number,
        food_preference,
        title,
      } = authStore?.data?.user || {};
      setValue("email", email);
      setValue("address", address);
      setValue("city", city);
      setValue("country", country);
      setValue("province", province);
      setValue("name", name);
      setValue("phone_number", phone_number);
      setValue("food_preference", food_preference);
      setValue("title", title);
    }
  }, [authStore.data?.user]);

  const getProfile = async () => {
    setLoading(true);
    try {
      const response = await APICall.get(API_URL.PROFILE);
      if (response.status === 200) {
        authStore.setData({
          token: authStore.data?.token ?? "",
          user: response?.data?.data,
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitLoading(true);
    try {
      const response = await APICall.put(API_URL.PROFILE, {
        ...data,
      });
      if (response.status === 200) {
        const responseProfile = await APICall.get(API_URL.PROFILE);
        if (responseProfile.status === 200) {
          authStore.setData({
            token: authStore.data?.token ?? "",
            user: responseProfile?.data?.data,
          });
        }
      }
    } catch (error) {
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="">
      {loading ? (
        <div className="flex justify-center w-full">
          <div className="circular-progress" />
        </div>
      ) : (
        <div className="flex items-start gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-[144px] h-[144px] border border-primary-white rounded-lg p-2">
              <div className="bg-primary-white h-full w-full" />
            </div>
            <p className="text-black-text mt-2 hover:cursor-pointer">
              Upload Photo
            </p>
          </div>
          <div className="flex flex-1 flex-col">
            <FormProvider {...methods}>
              <form
                autoComplete="off"
                className="flex flex-col h-full justify-between gap-8"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex flex-col gap-6">
                  <Input
                    label="Email"
                    placeholder="Input email"
                    type="email"
                    name="email"
                    setValue={setValue}
                    disabled
                  />
                  <div className="grid grid-cols-12 gap-4">
                    <InputDropdown
                      options={TITLES}
                      label="Title"
                      name="title"
                      setValue={setValue}
                      containerClassName="col-span-4"
                    />
                    <Input
                      label="Name"
                      placeholder="Input name"
                      name="name"
                      setValue={setValue}
                      containerClassName="col-span-8"
                    />
                  </div>
                  <div className="grid grid-cols-12 gap-4">
                    <InputDropdown
                      options={TITLES}
                      label="Country"
                      name="title"
                      setValue={setValue}
                      containerClassName="col-span-4"
                    />
                    <InputDropdown
                      options={TITLES}
                      label="Province"
                      name="title"
                      setValue={setValue}
                      containerClassName="col-span-4"
                    />
                    <InputDropdown
                      options={TITLES}
                      label="City"
                      name="title"
                      setValue={setValue}
                      containerClassName="col-span-4"
                    />
                  </div>
                  <Input
                    label="Address"
                    placeholder="Input address"
                    name="address"
                    setValue={setValue}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="Input phone number"
                    name="phone_number"
                    setValue={setValue}
                  />
                  <div className="grid grid-cols-12 gap-4">
                    <InputDropdown
                      options={FOOD_PREFERENCES}
                      label="Food Preference"
                      name="food_preference"
                      setValue={setValue}
                      containerClassName="col-span-4"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" loading={submitLoading} className="px-8">
                    Save
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
