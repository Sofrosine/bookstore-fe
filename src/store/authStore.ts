import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  data: Login | null;
};

type AuthAction = {
  setData: (data: Login | null) => void;
  logout: () => void;
};
export type AuthStoreTypes = AuthState & AuthAction;

const useAuthStore = create(
  persist<AuthStoreTypes>(
    (set) => ({
      data: null,
      setData: (data: Login | null) => {
        set(() => ({
          data,
        }));
      },
      logout: () => {
        set(() => ({
          data: null,
        }));
      },
    }),
    {
      name: "@user_data",
    }
  )
);

export default useAuthStore;
