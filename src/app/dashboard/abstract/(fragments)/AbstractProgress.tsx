import useAuthStore from "@/store/authStore";
import Image from "next/image";
import React, { FC } from "react";

interface Props {
  status: AbstractStatus;
}

const AbstractProgress: FC<Props> = ({ status }) => {
  const { user } = useAuthStore((state) => state?.data) || {};

  return (
    <div className="mt-6 flex w-full relative items-center justify-center">
      <div className="w-[91%] h-[1px] bg-grey-2 absolute mb-8" />
      <div className="flex justify-between w-full z-20">
        <div className="flex flex-col items-center">
          <Image
            src={"/icons/IcCheckGreenSquare.svg"}
            alt=""
            height={24}
            width={24}
            className="bg-white"
          />
          <p className="text-body-1 text-grey mt-2">Submit Presentation</p>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src={
              status === "rejected"
                ? "/icons/IcRemoveBlackSquare.svg"
                : status === "approved"
                ? "/icons/IcCheckGreenSquare.svg"
                : "/icons/IcTimeBlack.svg"
            }
            alt=""
            height={24}
            width={24}
            className="bg-white"
          />
          <p className="text-body-1 text-grey mt-2">Approve Presentation</p>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src={
              user?.role?.name === "default"
                ? "/icons/IcCheckEmpty.svg"
                : "/icons/IcCheckGreenSquare.svg"
            }
            alt=""
            height={24}
            width={24}
          />
          <p className="text-body-1 text-grey mt-2">Participant Payment</p>
        </div>
      </div>
    </div>
  );
};

export default AbstractProgress;
