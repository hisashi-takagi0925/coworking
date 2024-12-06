type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type Props = {
  url: string;
  method: Method;
  body?: unknown;
  options?: RequestInit;
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
  onSettled?: () => void;
};

export const httpClient = async <T>({
  url,
  method,
  body,
  options,
  onSuccess,
  onError,
  onSettled,
}: Props): Promise<T | undefined> => {
  const { next, ...restOptions } = options || {};
  const cache = next?.revalidate ? "no-cache" : "force-cache";
  try {
    const response = await fetch(url, {
      ...restOptions,
      cache,
      method,
      headers: {
        "Content-Type": "application/json",
        ...restOptions.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    onSuccess?.(data);
    return data as T;
  } catch (error) {
    onError?.(error);
  } finally {
    onSettled?.();
  }
};
