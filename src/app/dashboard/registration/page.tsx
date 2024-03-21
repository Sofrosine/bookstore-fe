"use client";

import React, { useEffect, useMemo } from "react";
import Countdown from "./(fragments)/Countdown";
import RegistrationTickets from "./(fragments)/RegistrationTickets";
import useAuthStore from "@/store/authStore";
import { currencyConverter, getTicketDurationLabel } from "@/helpers";
import { useFetch } from "@/hooks/useFetch";
import { API_URL } from "@/constants/api";
import Image from "next/image";

const Registration = () => {
  const {
    data: ticketData,
    loading,
    fetchData,
  } = useFetch(
    API_URL.TICKET +
      `?type=${new Date() <= new Date("2024-07-20") ? "early" : "late"}`,
    false
  );
  const { data } = useAuthStore() || {};

  const { user: userData } = data || {};

  useEffect(() => {
    fetchData();
  }, [userData]);

  const userTicket: Ticket = useMemo(() => {
    if (ticketData?.data) {
      return ticketData?.data?.filter(
        (val: Ticket) => val?.id === userData?.registration?.ticket_id
      )[0];
    } else {
      return {};
    }
  }, [ticketData]);

  return (
    <div className="flex flex-col">
      {userData?.registration?.status !== "on-progress" &&
      userData?.registration?.status !== "success" ? (
        <>
          <Countdown />
          <div className="mb-6" />
          <RegistrationTickets data={ticketData} loading={loading} />
        </>
      ) : (
        <div>
          {loading ? (
            <div />
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-body-1 text-grey capitalize">
                <span className="text-primary font-bold mr-2">
                  {userTicket?.category} Price:
                </span>{" "}
                {userTicket?.type?.includes("student")
                  ? "Student"
                  : userTicket?.type}{" "}
                Participant
              </p>
              <div className="my-6">
                <p className="text-primary font-bold text-subtitle-3 text-center">
                  {userTicket?.currency === "USD" ? "$" : ""}
                  {currencyConverter(Number(userTicket?.price))}{" "}
                  {userTicket?.currency === "IDR" ? "IDR" : ""}
                </p>
                <p className="text-body-1 text-grey">
                  {getTicketDurationLabel(userTicket?.duration)}
                </p>
              </div>
            </div>
          )}
          <div className="w-full mb-6 bg-grey-2 h-[1px]" />
          <div className="flex flex-col text-center items-center">
            <p className="text-primary font-bold text-subtitle-3">
              Your payment status:
            </p>
            <p className="text-body-1 text-grey my-6">
              Registered number:{" "}
              <span className="ml-1 font-bold">
                {userData?.registration?.registration_number}
              </span>
            </p>
            <Image
              src={
                userData?.registration?.status === "on-progress"
                  ? "/icons/IcEnvelopeCircle.svg"
                  : "/icons/IcOkCircle.svg"
              }
              alt=""
              height={64}
              width={64}
              className="mb-2"
            />
            {userData?.registration?.status === "on-progress" ? (
              <p className="text-body-1 text-grey">
                Please check your registered email,
                <br />
                we have sent an instructions payment to your email.
              </p>
            ) : (
              <p className="text-body-1 text-grey">Payment Successful</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;
