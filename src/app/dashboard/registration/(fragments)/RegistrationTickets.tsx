"use client";

import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import PopupConfirmation from "@/components/Popup/PopupConfirmation";
import PopupOk from "@/components/Popup/PopupOk";
import APICall, { extractToken } from "@/config/axios";
import { API_URL } from "@/constants/api";
import { currencyConverter, getTicketDurationLabel } from "@/helpers";
import { useFetch } from "@/hooks/useFetch";
import useAuthStore from "@/store/authStore";
import { useErrorStore } from "@/store/errorStore";
import clsx from "clsx";
import { FC, useEffect, useMemo, useState } from "react";

interface TicketProps {
  items: Ticket[];
  name: "student" | "domestic" | "international";
  onConfirmTicket: (val: string) => void;
}

const Ticket: FC<TicketProps> = ({ items, name, onConfirmTicket }) => {
  const [selectedTicketId, setSelectedTicketId] = useState("");

  useEffect(() => {
    setSelectedTicketId(items[0]?.id);
  }, [items]);

  const selectedTicket = useMemo(() => {
    return items?.filter((val) => val?.id === selectedTicketId)[0];
  }, [selectedTicketId]);

  const options = useMemo(() => {
    return items
      ?.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      ?.map((item) => ({
        ...item,
        value: item?.id,
        label: `${getTicketDurationLabel(item?.duration)}${
          name === "student" ? ` (${item?.currency})` : ""
        }`,
      }));
  }, [items]);

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-primary col-span-4">
      <div
        className={clsx(
          "py-4 px-8",
          name !== "student" ? "bg-primary" : "bg-primary-white"
        )}
      >
        <p
          className={clsx(
            "text-subtitle-3 font-bold text-center capitalize",
            name !== "student" ? "text-white" : "text-primary"
          )}
        >
          {name} {name !== "student" && "participant"}
        </p>
      </div>
      <div className="bg-white px-4 pt-8">
        <Dropdown
          options={options}
          label={name !== "student" ? "Public Rate" : "Student Rate"}
          value={selectedTicketId}
          onChange={(e) => {
            setSelectedTicketId(e.target.value);
          }}
          name="public_rate"
        />
        <p className="text-primary text-subtitle-3 font-bold py-8 text-center">
          {selectedTicket?.currency === "USD" && "$"}
          {currencyConverter(Number(selectedTicket?.price))}
          {selectedTicket?.currency === "IDR" && " IDR"}
        </p>
        <Button
          className="w-full mb-6"
          onClick={() => {
            onConfirmTicket && onConfirmTicket(selectedTicketId);
          }}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
};

const RegistrationTickets = ({ data, loading }: any) => {
  const authStore = useAuthStore();

  const [tickets, setTickets] = useState<any>({});
  const [selectedTicket, setSelectedTicket] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showOk, setShowOk] = useState(false);

  useEffect(() => {
    if (data?.data) {
      getTicket();
    }
  }, [data]);

  const getTicket = () => {
    const groupedData = data?.data?.reduce((groups: any, item: Ticket) => {
      const { type, ...dataWithoutType } = item;
      if (!groups[type]) {
        groups[type] = [];
      }
      if (dataWithoutType?.price !== "0") {
        groups[type].push(dataWithoutType);
      }
      return groups;
    }, {});

    groupedData["student"] = [
      ...groupedData["student-domestic"],
      ...groupedData["student-international"],
    ];
    delete groupedData["student-domestic"];
    delete groupedData["student-international"];

    setTickets(groupedData);
  };

  const handleRegistration = async () => {
    setSubmitLoading(true);
    try {
      const response = await APICall.post(API_URL.REGISTRATION, {
        ticket_id: selectedTicket,
      });
      if (response.status === 201) {
        const responseProfile = await APICall.get(API_URL.PROFILE);
        authStore.setData({
          token: extractToken(),
          user: responseProfile?.data?.data,
        });
        setShowOk(true);
      }
    } catch (error: any) {
      useErrorStore.getState().setMessage(error?.response?.data?.message);
    } finally {
      setShowPopup(false);
      setSubmitLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center">
        <div className="circular-progress" />
      </div>
    );
  return (
    <div className="grid grid-cols-12 gap-6">
      {Object?.keys(tickets)?.map((item: any) => {
        return (
          <Ticket
            items={tickets[item]}
            name={item}
            key={item}
            onConfirmTicket={(val) => {
              setSelectedTicket(val);
              setShowPopup(true);
            }}
          />
        );
      })}
      {showPopup && (
        <PopupConfirmation
          title="Confirmation"
          description="Are you sure?"
          onClose={() => {
            setShowPopup(false);
            setSelectedTicket("");
          }}
          onConfirm={handleRegistration}
          loading={submitLoading}
        />
      )}
      {showOk && (
        <PopupOk
          title="Thank You!"
          description="Please check your registered email, we have sent an instructions payment to your email."
          onClose={() => {
            setShowOk(false);
          }}
        />
      )}
    </div>
  );
};

export default RegistrationTickets;
