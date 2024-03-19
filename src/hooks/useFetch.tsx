import APICall from "@/config/axios";
import { useEffect, useState } from "react";

export const useFetch = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await APICall.get(url);
        if (response.status === 200) {
          setData(response.data);
          if (error) {
            setError(null);
          }
        }
      } catch (error: any) {
        setError(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

//In your component:
