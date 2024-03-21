import Image from "next/image";
import React, { FC, useMemo } from "react";
import AbstractProgress from "./AbstractProgress";
import useAuthStore from "@/store/authStore";

interface Props {
  data: Abstract;
}

const AbstractStatus: FC<Props> = ({ data }) => {
  const { user } = useAuthStore((state) => state?.data) || {};

  const ImageStatus = useMemo(() => {
    switch (data?.status) {
      case "approved":
        if (user?.registration?.status === "success") {
          return "/icons/IcOkCircle.svg";
        } else {
          return "/icons/IcFileGreenCircle.svg";
        }
      case "rejected":
        return "/icons/IcDocumentRejectCircle.svg";
      default:
        return "/icons/IcTimeGreenCircle.svg";
    }
  }, [data?.status]);

  const TextStatus = useMemo(() => {
    switch (data?.status) {
      case "approved":
        if (user?.registration?.status === "success") {
          return (
            <div className="text-center">
              <p className="text-grey text-body-1">
                Abstract presentation progress has been completed
              </p>
            </div>
          );
        } else {
          return (
            <div className="text-center">
              <p className="text-grey text-body-1">
                Abstract presentation has been approved,
              </p>
              <p className="text-grey text-body-1">
                Please complete your participant payment on tab{" "}
                <span className="font-bold">Register</span> above
              </p>
            </div>
          );
        }
      case "rejected":
        return (
          <p className="text-grey text-body-1 text-center">
            Thanks for giving us the chance to consider your abstract.
            <br />
            Unfortunately, during our review process we discovered content that
            you recently submitted did not meet IBHC 2024 Content Guidelines,
            and was <span className="font-bold">rejected</span>.
          </p>
        );
      default:
        return <p className="text-grey text-body-1">On review</p>;
    }
  }, [data?.status]);

  return (
    <div className="flex flex-col w-full">
      <p className="text-primary font-bold text-subtitle-3 capitalize text-center">
        {data?.type} Presentation {data?.type === "oral" && "Session "}
        Submission
      </p>
      <div className="mt-6 flex flex-col text-center gap-2">
        <p className="text-grey text-body-1">Title Presentation</p>
        <p className="text-primary font-bold text-subtitle-3">{data?.name}</p>
      </div>
      <div className="w-full h-[1px] bg-grey-2 my-6" />
      <div className="flex flex-col items-center flex-1">
        <p className="text-primary font-bold text-subtitle-3 mb-6">
          Submitted Status
        </p>
        <Image
          src={ImageStatus}
          alt=""
          height={64}
          width={64}
          className="mb-2"
        />
        {TextStatus}
        <AbstractProgress status={data?.status} />
      </div>
    </div>
  );
};

export default AbstractStatus;
