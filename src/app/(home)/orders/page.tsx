"use client";

import { API_URL } from "@/constants/api";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import CardOrder from "./(fragments)/CardOrder";
import PopupConfirmation from "@/components/Popup/PopupConfirmation";
import APICall, { extractToken } from "@/config/axios";
import { useErrorStore } from "@/store/errorStore";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

const Orders = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useFetch<{ data: Order[]; pagination: Pagination }>(
    API_URL.ORDERS + `?page=${page}&pageSize=8`
  );

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const [loadingCancel, setLoadingCancel] = useState(false);

  const { ref, inView } = useInView({ threshold: 0.8 });

  const router = useRouter();

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setOrders(data?.data);
      } else {
        setOrders([...orders, ...data?.data]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (inView && data) {
      if (page < data?.pagination?.totalPages) {
        setPage((p) => p + 1);
      }
    }
  }, [inView]);

  const handleCancel = async () => {
    setLoadingCancel(true);
    try {
      const response = await APICall.delete(
        API_URL.ORDERS + `/${selectedOrder}`
      );
      if (response.status === 200) {
        const responseProfile = await APICall.get(API_URL.PROFILE);
        if (responseProfile.status === 200) {
          useAuthStore.getState().setData({
            token: extractToken(),
            user: responseProfile?.data?.data,
          });
          router.push("/home");
        }
      }
    } catch (error: any) {
      useErrorStore.getState().setMessage(error?.response?.data?.message);
      setLoadingCancel(false);
      setSelectedOrder("");
    } finally {
    }
  };

  return (
    <div>
      {selectedOrder && (
        <PopupConfirmation
          title="Are you sure?"
          description="The order will be canceled once you confirm"
          onClose={() => setSelectedOrder("")}
          onConfirm={() => {
            handleCancel();
          }}
          loading={loadingCancel}
        />
      )}
      {!data?.data && loading ? (
        <div className="flex justify-center mt-8">
          <div className="circular-progress" />
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4 p-4">
          {orders?.map((order) => {
            return (
              <CardOrder
                onCancel={() => setSelectedOrder(order?.id)}
                key={order?.id}
                order={order}
              />
            );
          })}
        </div>
      )}

      {data?.data && loading ? (
        <div className="flex justify-center my-8">
          <div className="circular-progress" />
        </div>
      ) : (
        <div ref={ref} />
      )}
    </div>
  );
};

export default Orders;
