
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
	queryParams?: Record<string, any>; // Added queryParams field
	element?: HTMLElement;
};


const baseURL = ''
const useApi = (data: ApiRequestData) =>
	new Promise((resolve, reject) => {

		let url = data.url.startsWith("http")
			? data.url
			: baseURL + `${data.url}`;

		// Add query parameters to the URL for GET requests
		if (data.method === APIMETHODSTYPES.GET && data.queryParams) {
			const queryString = new URLSearchParams(data.queryParams).toString();
			if (queryString) {
				url += `?${queryString}`;
			}
		}

		ofetch(url, {
			method: data.method,
			body: data.body,
			headers: { Authorization: `Token ${storage.get(enuStorageKey.token)}` },
		})
			.then((res: unknown) => {
				resolve(res);
			})
			.catch((err: unknown) => reject(err))
			
	});

export const api = {
	get: (
		url: string,
		queryParams?: Record<string, unknown>,
		element?: HTMLElement
	) => useApi({ url, method: APIMETHODSTYPES.GET, queryParams, element }),
	delete: (
		url: string,
		queryParams?: Record<string, unknown>,
		element?: HTMLElement
	) => useApi({ url, method: APIMETHODSTYPES.DELETE, queryParams, element }),
	post: (url: string, body: Record<string, unknown>, element?: HTMLElement) =>
		useApi({ url, method: APIMETHODSTYPES.POST, body, element }),
	put: (url: string, body: Record<string, unknown>, element?: HTMLElement) =>
		useApi({ url, method: APIMETHODSTYPES.PUT, body, element }),
	patch: (url: string, body: Record<string, unknown>, element?: HTMLElement) =>
		useApi({ url, method: APIMETHODSTYPES.PATCH, body, element }),
};
