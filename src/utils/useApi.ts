import { ofetch } from "ofetch";
import { enuStorageKey, storage } from "./useStorage";
import { toast } from "./toast";
import router from "@/router";

enum APIMETHODSTYPES {
  GET = "get",
  DELETE = "delete",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
}

type ApiRequestData = {
  url: string;
  method: APIMETHODSTYPES;
  body?: Record<string, unknown>;
  queryParams?: Record<string, any>;
  requiresAuth?: boolean;
};

const baseURL = "https://interview.cetri.ir/main/main/";

let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

const refreshToken = async (): Promise<void> => {
  try {
    isRefreshing = true;
    const refreshToken = storage.get(enuStorageKey.refreshToken);
    const response = await ofetch(`${baseURL}refresh`, {
      method: APIMETHODSTYPES.POST,
      query: { token: refreshToken },
    });
    const { access } = response.data;
    storage.set({ key: enuStorageKey.accessToken, value: access });
  } catch (error) {
    console.error("Refresh token failed:", error);
    toast.error("دسترسی ندارید، دوباره وارد شوید");
    router.push("/login");
    throw error;
  } finally {
    isRefreshing = false;
  }
};

const useApi = (data: ApiRequestData) =>
  new Promise((resolve, reject) => {
    let url = data.url.startsWith("http") ? data.url : baseURL + data.url;

    if (data.method === APIMETHODSTYPES.GET && data.queryParams) {
      const queryString = new URLSearchParams(data.queryParams).toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const makeRequest = () => {
      const headers: Record<string, string> = {};
      if (data.requiresAuth) {
        const token = storage.get(enuStorageKey.accessToken);
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }

      ofetch(url, {
        method: data.method,
        body: data.body,
        headers,
        query: data.queryParams,
      })
        .then((res: unknown) => {
          resolve(res);
        })
        .catch(async (err: any) => {
          if (err.data?.status === 403 && data.requiresAuth) {
            pendingRequests.push(() => makeRequest());

            if (!isRefreshing) {
              try {
                await refreshToken();
                const requestsToRetry = [...pendingRequests];
                pendingRequests = [];
                requestsToRetry.forEach((request) => request());
              } catch (refreshError) {
                pendingRequests = [];
                reject(refreshError);
              }
            }
          } else {
            reject(err);
          }
        });
    };

    makeRequest();
  });

export const api = {
  get: (
    url: string,
    queryParams?: Record<string, unknown>,
    requiresAuth = true
  ) =>
    useApi({
      url,
      method: APIMETHODSTYPES.GET,
      queryParams,
      requiresAuth,
    }),
  delete: (
    url: string,
    queryParams?: Record<string, unknown>,
    requiresAuth = true
  ) =>
    useApi({
      url,
      method: APIMETHODSTYPES.DELETE,
      queryParams,
      requiresAuth,
    }),

  post: (
    url: string,
    body: Record<string, unknown>,
    requiresAuth = true,
    queryParams?: Record<string, unknown>
  ) =>
    useApi({
      url,
      method: APIMETHODSTYPES.POST,
      body,
      queryParams,
      requiresAuth,
    }),
  put: (
    url: string,
    body: Record<string, unknown>,
    requiresAuth = true,
    queryParams?: Record<string, unknown>
  ) =>
    useApi({
      url,
      method: APIMETHODSTYPES.PUT,
      body,
      queryParams,
      requiresAuth,
    }),
  patch: (
    url: string,
    body: Record<string, unknown>,
    requiresAuth = true,
    queryParams?: Record<string, unknown>
  ) =>
    useApi({
      url,
      method: APIMETHODSTYPES.PATCH,
      body,
      queryParams,
      requiresAuth,
    }),
};
