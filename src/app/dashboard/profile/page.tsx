"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import InputDropdown from "@/components/Input/InputDropdown";
import APICall from "@/config/axios";
import { API_URL } from "@/constants/api";
import { FOOD_PREFERENCES, TITLES } from "@/constants/data";
import useAuthStore from "@/store/authStore";
import { useErrorStore } from "@/store/errorStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  image_url: z.string(),
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
      image_url: "",
    },
  });
  const { handleSubmit, setValue, watch } = methods;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);

  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

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
        image_url,
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
      setValue("image_url", image_url);
    }
  }, [authStore.data?.user]);

  useEffect(() => {
    getCountry();
  }, []);

  useEffect(() => {
    if (watch("country") && countries?.length > 0) {
      setCities([]);
      getProvince();
    }
  }, [watch("country"), countries]);

  useEffect(() => {
    if (watch("province") && provinces?.length > 0) {
      getCities();
    }
  }, [watch("province"), provinces]);

  const getCountry = async () => {
    try {
      var config = {
        method: "get",
        url: "https://api.countrystatecity.in/v1/countries",
        headers: {
          "X-CSCAPI-KEY": process.env.NEXT_PUBLIC_COUNTRY_KEY,
        },
      };
      const response = await axios(config);
      if (response.status === 200) {
        setCountries(
          response?.data?.map((item: any) => ({
            ...item,
            label: item?.name,
            value: item?.name?.toLowerCase(),
          }))
        );
      }
    } catch (error) {}
  };

  const getProvince = async () => {
    try {
      const selectedCountryISO2: any = [...countries].filter(
        (val: any) => val?.value === watch("country")
      )[0];
      var config = {
        method: "get",
        url: `https://api.countrystatecity.in/v1/countries/${selectedCountryISO2?.iso2}/states`,
        headers: {
          "X-CSCAPI-KEY": process.env.NEXT_PUBLIC_COUNTRY_KEY,
        },
      };
      const response = await axios(config);

      if (response.status === 200) {
        setProvinces(
          response?.data?.map((item: any) => ({
            ...item,
            label: item?.name,
            value: item?.name?.toLowerCase(),
          }))
        );
      }
    } catch (error) {}
  };

  const getCities = async () => {
    try {
      const selectedCountryISO2: any = [...countries].filter(
        (val: any) => val?.value === watch("country")
      )[0];
      const selectedCityISO2: any = [...provinces].filter(
        (val: any) => val?.value === watch("province")
      )[0];
      var config = {
        method: "get",
        url: `https://api.countrystatecity.in/v1/countries/${selectedCountryISO2?.iso2}/states/${selectedCityISO2?.iso2}/cities`,
        headers: {
          "X-CSCAPI-KEY": process.env.NEXT_PUBLIC_COUNTRY_KEY,
        },
      };
      const response = await axios(config);

      if (response.status === 200) {
        setCities(
          response?.data?.map((item: any) => ({
            ...item,
            label: item?.name,
            value: item?.name?.toLowerCase(),
          }))
        );
      }
    } catch (error) {}
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type.startsWith("image/")) {
        const fileSizeInMB = selectedFile.size / (1024 * 1024); // Convert bytes to megabytes
        if (fileSizeInMB > 2) {
          // Handle file size exceeds limit
          useErrorStore
            .getState()
            .setMessage(`File size exceeds ${2}MB limit.`);
          return;
        } else {
          handleUploadImage(selectedFile);
        }
      } else {
        // Handle invalid file type error
        console.error("Invalid file type. Please select an image file.");
      }
    }
  };

  const handleUploadImage = async (file: File) => {
    setLoadingUpload(true);

    try {
      const formData = new FormData();
      formData.append("file", file!); // Add file data
      // Add file data
      const response = await APICall.post(API_URL.PROFILE_PHOTO, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setValue("image_url", response?.data?.data?.image_url);
      }
    } catch (error: any) {
      useErrorStore?.getState().setMessage(error?.response?.data?.message);
    } finally {
      setLoadingUpload(false);
    }
  };

  return (
    <div className="">
      <div className="flex items-start gap-6">
        {loadingUpload ? (
          <div className="circular-progress mx-12" />
        ) : (
          <div
            className="flex flex-col items-center text-center hover:cursor-pointer"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
          >
            <div className="w-[144px] h-[144px] border border-primary-white rounded-lg p-2 relative overflow-hidden">
              {watch("image_url") ? (
                <Image fill alt="" src={watch("image_url")} />
              ) : (
                <div className="bg-primary-white h-full w-full" />
              )}
            </div>
            <p className="text-black-text mt-2">
              Upload Photo
              <br />
              <span className="text-body-2">(Max. 2 Mb)</span>
            </p>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        )}
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
                    options={countries}
                    label="Country"
                    name="country"
                    setValue={setValue}
                    containerClassName="col-span-4"
                  />
                  <InputDropdown
                    options={provinces}
                    label="Province"
                    name="province"
                    setValue={setValue}
                    containerClassName="col-span-4"
                  />
                  <InputDropdown
                    options={cities}
                    label="City"
                    name="city"
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
    </div>
  );
};

export default Profile;
