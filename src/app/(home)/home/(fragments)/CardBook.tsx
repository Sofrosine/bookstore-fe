"use client";

import Button from "@/components/Button";
import useAuthStore from "@/store/authStore";
import { useErrorStore } from "@/store/errorStore";
import Image from "next/image";
import React, { FC } from "react";

type Props = {
  book: Book;
  onOrder?: () => void;
};

const CardBook: FC<Props> = ({ book, onOrder }) => {
  const { data } = useAuthStore();

  return (
    <div className="col-span-12 sm:col-span-6 md:col-span-12 lg:col-span-6 3xl:col-span-4 border border-grey-2 rounded-lg overflow-hidden">
      <div className="relative w-full h-[200px]">
        <Image fill alt="" src={book?.cover_image} />
      </div>
      <div className="p-2 py-4 bg-white">
        <p className="font-bold text-subtitle-3">{book?.title}</p>
        <p className="text-body-2 text-grey">Writer: {book?.writer}</p>
        <p className="text-body-2 text-grey">{book?.tags?.join(", ")}</p>
        <div className="flex justify-end mt-2">
          <p className="bg-primary px-2 py-1 rounded-xl text-white font-bold">
            {book?.point}
          </p>
        </div>
        {onOrder && (
          <Button
            onClick={() => {
              if (data?.user?.points! < book?.point) {
                useErrorStore.getState().setMessage("Not enough point");
              } else {
                onOrder && onOrder();
              }
            }}
            className="w-full mt-8"
          >
            Order
          </Button>
        )}
      </div>
    </div>
  );
};

export default CardBook;
