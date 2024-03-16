import axios, { AxiosRequestConfig } from "axios";

const excludeRedirectUnauthorized = [
  "/v1/auth/sign_in",
  "/v1/auth/socials",
  "/v1/carts",
  "/v1/orders",
];

const extractToken = () => {
  const userState = localStorage.getItem("@user_data");
  if (!userState) return null;
  const userParse = JSON.parse(userState ?? "");

  const { token } = userParse?.state?.data || {};

  return token ? `Bearer ${token}` : "";
};

const axiosRequestConfiguration: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_BASE_API,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
};

const APICall = axios.create(axiosRequestConfiguration);

APICall.interceptors.request.use((config: any) => {
  const curConfig: any = { ...config };
  // ALWAYS READ UPDATED TOKEN
  try {
    if (!curConfig.headers["Authorization"]) {
      curConfig.headers["Authorization"] = extractToken();
    }
    if (!Number(curConfig?.headers["Not-Form"])) {
      curConfig.headers["Content-Type"] = "multipart/form-data";
    }
  } catch (e) {
    // eslint-disable-next-line no-console
  }
  return curConfig;
});

APICall.interceptors.response.use(
  (res: any) => res,
  (error: any) => {
    // if (error?.response?.data?.message) {
    //   if (error?.response?.data?.message !== "User not found") {
    //     // toast.error(error?.response?.data?.message);
    //   }
    // }
    // if (
    //   error?.response?.status === 401 &&
    //   !excludeRedirectUnauthorized.includes(error?.response?.config?.url)
    // ) {
    //   localStorage.removeItem("@user");
    //   window.location.href = "/login";
    // } else if (
    //   error?.response?.status === 401 &&
    //   error?.response?.config?.url === "/v1/carts" &&
    //   error?.response?.config?.method === "post"
    // ) {
    //   localStorage.removeItem("@user");
    //   window.location.href = "/login";
    // }

    return Promise.reject(error);
  }
);

export const { CancelToken } = axios;
export default APICall;
