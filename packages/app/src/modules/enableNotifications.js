import { Device } from "@capacitor/device";
import api from "./apiRequest";
import { Preferences } from "@capacitor/preferences";
import { initNotifications } from "./notifications";
import { toast } from "react-hot-toast";

async function enableNotifications() {
  const { value } = await Preferences.get({ key: "pushData" });
  if (value) {
    console.log("success");
  } else {
    const res = await getNotificationsInfo();
    if (res) await enableNotifications();
  }
}

export default enableNotifications;

function toaster() {
  toast.error("Произошла ошибка. Попробуйте позже");
}

export async function getNotificationsInfo() {
  try {
    const { model: device_id } = await Device.getInfo();
    const { data: responseData } = await api("notifications");
    if (responseData) {
      console.log("nf1", responseData);
      if (responseData.find((i) => i.label === device_id)) {
        await Preferences.set({
          key: "pushData",
          value: JSON.stringify(
            responseData.find((i) => i.label === device_id)
          ),
        });
        return true;
      } else {
        console.log("notifications nf1");

        toaster();
        return false;
      }
    } else {
      console.log("notifications nf");
      toaster();
      return false;
    }
  } catch (e) {
    toaster();
    return false;
  }
}
