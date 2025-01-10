import { ofetch } from "ofetch";
import { enuStorageKey, storage } from "./useStorage";

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
  element?: HTMLElement;
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
      body: { refresh_token: refreshToken },
    });
    const { access_token } = response as { access_token: string };
    storage.set({ key: enuStorageKey.accessToken, value: access_token });
  } catch (error) {
    console.error("Refresh token failed:", error);
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
          headers["Authorization"] = `Token ${token}`;
        }
      }

      ofetch(url, {
        method: data.method,
        body: data.body,
        headers,
      })
        .then((res: unknown) => {
          resolve(res);
        })
        .catch(async (err: any) => {
          if (err.response?.status === 401 && data.requiresAuth) {
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
    element?: HTMLElement,
    requiresAuth = true
  ) =>
    useApi({
      url,
      method: APIMETHODSTYPES.GET,
      queryParams,
      element,
      requiresAuth,
    }),
  delete: (
    url: string,
    queryParams?: Record<string, unknown>,
    element?: HTMLElement,
    requiresAuth = true
  ) =>
    useApi({
      url,
      method: APIMETHODSTYPES.DELETE,
      queryParams,
      element,
      requiresAuth,
    }),
  post: (
    url: string,
    body: Record<string, unknown>,
    element?: HTMLElement,
    requiresAuth = true
  ) =>
    useApi({ url, method: APIMETHODSTYPES.POST, body, element, requiresAuth }),
  put: (
    url: string,
    body: Record<string, unknown>,
    element?: HTMLElement,
    requiresAuth = true
  ) =>
    useApi({ url, method: APIMETHODSTYPES.PUT, body, element, requiresAuth }),
  patch: (
    url: string,
    body: Record<string, unknown>,
    element?: HTMLElement,
    requiresAuth = true
  ) =>
    useApi({ url, method: APIMETHODSTYPES.PATCH, body, element, requiresAuth }),
};
