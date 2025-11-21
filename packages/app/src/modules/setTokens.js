import { Preferences } from "@capacitor/preferences";

export default async function setTokens({ access_token, refresh_token }) {
  await Preferences.set({
    key: "access_token",
    value: access_token,
  });
  await Preferences.set({
    key: "refresh_token",
    value: refresh_token,
  });
  await Preferences.set({
    key: "auth_date",
    value: `${Date.now()}`,
  });

  return true;
}
