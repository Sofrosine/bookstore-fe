import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  data: Login | null;
};

type AuthAction = {
  setData: (data: Login | null) => void;
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
    }),
    { name: "@user_data" }
  )
);

export default useAuthStore;
