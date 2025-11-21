import setTokens from "./setTokens";
import { Preferences } from "@capacitor/preferences";

const api = async (endpoint, method, params, isUpload) => {
  const { value: access_token } = await Preferences.get({
    key: "access_token",
  });
  const { value: refresh_token } = await Preferences.get({
    key: "refresh_token",
  });
  const { value: auth_dateStorage } = await Preferences.get({
    key: "auth_date",
  });
  console.log("access_token", access_token);
  const auth_date = Number(auth_dateStorage);

  const headers = {};
  if (!isUpload) headers["Content-Type"] = "application/json";
  if (access_token) headers.authorization = `Bearer ${access_token}`;

  if (Number(auth_date) + 3600 * 1000 < Date.now() && access_token) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ refresh_token }),
        }
      );
      const reponseJSON = await response.json();
      const { data: responseJSONData, statusCode } = reponseJSON;
      if (responseJSONData) {
        await setTokens(responseJSONData);
        headers.authorization = `Bearer ${responseJSONData.access_token}`;
      }
      console.log("error api", statusCode);
    } catch (e) {
      console.log("api error", e);
    }
  }

  const data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${endpoint}`, {
    method: method,
    headers: headers,
    body: !isUpload ? JSON.stringify(params) : params,
  });

  return await data.json();
};

export default api;
