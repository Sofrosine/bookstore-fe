"use client";

import Button from "@/components/Button";
import { API_URL } from "@/constants/api";
import { ABSTRACT_INFO } from "@/constants/data";
import { useFetch } from "@/hooks/useFetch";
import Link from "next/link";
import AbstractStatus from "./(fragments)/AbstractStatus";

const Abstract = () => {
  const { data, loading } = useFetch(API_URL.DOCUMENT_ME);

  return (
    <div className="flex flex-1">
      {loading ? (
        <div className="flex justify-center items-center w-full">
          <div className="circular-progress" />
        </div>
      ) : data ? (
        <AbstractStatus data={data?.data} />
      ) : (
        <div className="flex gap-12 w-full relative">
          <div className="w-[2px] h-full bg-grey-2 absolute left-1/2" />

          {ABSTRACT_INFO.map((item) => {
            return (
              <div className="flex flex-col flex-1" key={item?.title}>
                <div className="grid grid-rows-12 h-full">
                  <div className="row-span-5">
                    <h1 className="text-primary text-subtitle-3 font-bold text-center">
                      {item?.title}
                    </h1>
                    <p className="mt-4 text-body-1 text-grey">
                      {item?.description}
                    </p>
                  </div>
                  <div className="row-span-7 flex flex-col justify-between">
                    <div>
                      <div className="text-center border-b border-primary pb-2">
                        <p className="text-primary font-bold text-body-1">
                          Submission Guidelines: 
                        </p>
                      </div>
                      <ul className="flex flex-col list-disc list-inside mt-2 text-body-1 text-grey gap-2">
                        {item?.steps?.map((step) => {
                          return <li key={step}>{step}</li>;
                        })}
                      </ul>
                    </div>
                    <div className="flex flex-col gap-4 mt-4 items-center">
                      <span className="text-grey">
                        {item?.downloadLabel}{" "}
                        <Link href={item?.downloadLink} target="_blank">
                          <span className="text-primary underline">here</span>
                        </Link>
                      </span>
                      <Link href={item?.btnLink}>
                        <Button>{item?.btnLabel}</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Abstract;
