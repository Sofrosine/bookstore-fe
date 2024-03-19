"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import InputUpload from "@/components/Input/InputUpload";
import APICall from "@/config/axios";
import { API_URL } from "@/constants/api";
import { useFetch } from "@/hooks/useFetch";
import { useErrorStore } from "@/store/errorStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TypeOf, z } from "zod";

const submissionSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

type SubmissionInput = TypeOf<typeof submissionSchema>;
const AbstractSubmission = () => {
  const { data, loading } = useFetch(API_URL.DOCUMENT_ME);

  const searchParams = useSearchParams();
  const methods = useForm<SubmissionInput>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      title: "",
    },
  });
  const { handleSubmit, setValue, watch } = methods;

  const [file, setFile] = useState<File | null>(null);
  const [errorFile, setErrorFile] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (data) {
      router.back();
    } else {
      if (!searchParams.get("type")) {
        router.back();
      }
    }
  }, [data]);

  const validate = () => {
    let isValidate = true;

    if (!file) {
      setErrorFile("File is required");
      isValidate = false;
    }

    return isValidate;
  };

  const onSubmit = (data: any) => {
    if (validate()) {
      handleUpload();
    }
  };

  const handleSelectFile = (file: File) => {
    if (errorFile) {
      setErrorFile("");
    }

    setFile(file);
  };

  const handleUpload = async () => {
    setSubmitLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", watch("title")); // Add form data
      formData.append("file", file!); // Add file data
      formData.append(
        "type",
        searchParams.get("type") === "poster-presentation" ? "poster" : "oral"
      ); // Add file data
      const response = await APICall.post(API_URL.DOCUMENT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        router.replace("/dashboard/abstract");
      }
    } catch (error: any) {
      useErrorStore?.getState().setMessage(error?.response?.data?.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <p className="text-primary font-bold text-subtitle-3 text-center mb-6">
        {searchParams.get("type") === "oral-presentation"
          ? "Oral Presentation Session Submission"
          : "Poster Presentation Submission"}
      </p>
      {loading ? (
        <div className="flex justify-center items-center w-full">
          <div className="circular-progress" />
        </div>
      ) : data ? (
        <div />
      ) : (
        <FormProvider {...methods}>
          <form
            autoComplete="off"
            className="flex flex-col gap-8 mb-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              label="Title presentation"
              placeholder="Input title presentation"
              name="title"
              setValue={setValue}
            />
            <InputUpload
              label={
                searchParams?.get("type") === "oral-presentation"
                  ? "Submit Oral Presentation Session"
                  : "Submit Poster Presentation"
              }
              errorMessage={errorFile}
              onSelectFile={handleSelectFile}
            />
            <div className="flex items-center justify-between mt-6">
              <span
                className="text-black-text text-body-1 pl-6 font-bold hover:cursor-pointer"
                onClick={() => router.back()}
              >
                {"< Back"}
              </span>
              <Button type="submit" className="px-12" loading={submitLoading}>
                Submit
              </Button>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
};

export default AbstractSubmission;
