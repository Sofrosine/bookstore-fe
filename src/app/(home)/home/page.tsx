"use client";

import { API_URL } from "@/constants/api";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import CardBook from "./(fragments)/CardBook";
import PopupConfirmation from "@/components/Popup/PopupConfirmation";
import APICall, { extractToken } from "@/config/axios";
import { useErrorStore } from "@/store/errorStore";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import Input from "@/components/Input";
import { useDebounce } from "@/hooks/useDebounce";

const Home = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const searchValue = useDebounce(search, 250);
  const { data, loading } = useFetch<{ data: Book[]; pagination: Pagination }>(
    API_URL.BOOKS + `?page=${page}&pageSize=8&search=${searchValue ?? ""}`
  );

  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [loadingOrder, setLoadingOrder] = useState(false);

  const { ref, inView } = useInView({ threshold: 0.8 });

  const router = useRouter();

  useEffect(() => {
    setPage(1);
  }, [searchValue]);

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setBooks(data?.data);
      } else {
        setBooks([...books, ...data?.data]);
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

  const handleOrder = async () => {
    setLoadingOrder(true);
    try {
      const response = await APICall.post(API_URL.ORDERS, {
        book_id: selectedBook,
      });
      if (response.status === 201) {
        const responseProfile = await APICall.get(API_URL.PROFILE);
        if (responseProfile.status === 200) {
          useAuthStore.getState().setData({
            token: extractToken(),
            user: responseProfile?.data?.data,
          });
          router.push("/orders");
        }
      }
    } catch (error: any) {
      useErrorStore.getState().setMessage(error?.response?.data?.message);
      setLoadingOrder(false);
      setSelectedBook("");
    } finally {
    }
  };

  return (
    <div>
      {selectedBook && (
        <PopupConfirmation
          title="Are you sure?"
          description="The order will be proceessed once you confirm"
          onClose={() => setSelectedBook("")}
          onConfirm={() => {
            handleOrder();
          }}
          loading={loadingOrder}
        />
      )}
      <div className="pb-6 pt-2">
        <Input
          name="search"
          label="Search book"
          placeholder="Search your designed book..."
          noControl
          value={search}
          onChange={(e) => setSearch(e?.currentTarget?.value)}
        />
      </div>
      {!data?.data && loading ? (
        <div className="flex justify-center mt-8">
          <div className="circular-progress" />
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4 p-4">
          {books?.map((book) => {
            return (
              <CardBook
                onOrder={() => setSelectedBook(book?.id)}
                key={book?.id}
                book={book}
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

export default Home;
