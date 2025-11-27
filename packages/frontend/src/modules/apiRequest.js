const api = async (endpoint, method, params, isUpload) => {
  if (!endpoint) return;

  const headers = {
    authorization: `Bearer ${
      !window.location.href.includes("tgWebApp")
        ? window.location.href
            .slice(window.location.href.indexOf("?") + 1)
            .split("#")[0]
        : window.Telegram.WebApp.initData
    }`,
  };

  if (!isUpload) headers["Content-Type"] = "application/json";

  const baseUrl =
    import.meta.env.VITE_BACKEND_URL ?? "https://vk-mini-app.jobazavr.ru";

  const data = await fetch(`${baseUrl}/${endpoint}`, {
    method: method,
    headers: headers,
    body: !isUpload ? JSON.stringify(params) : params,
  });

  return await data.json();
};

export default api;
