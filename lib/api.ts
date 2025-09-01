import AsyncStorage from "@react-native-async-storage/async-storage";

export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  try {
    const token = await AsyncStorage.getItem("accessToken");

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  } catch (err) {
    console.error("apiFetch error:", err);
    throw err;
  }
}
