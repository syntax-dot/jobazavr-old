import { PushNotifications } from "@capacitor/push-notifications";
import { Device } from "@capacitor/device";
import api from "./apiRequest";

export async function initNotifications() {
  console.log("Initializing HomePage");

  // On success, we should be able to receive notifications
  PushNotifications.addListener("registration", async (token) => {
    const { model: device_id } = await Device.getInfo();
    console.log(device_id);
    const {
      data: responseData,
      errorMessage,
      errorCode,
    } = await api("notifications", "POST", {
      label: device_id,
      token: token.value,
    });
    const waitPr = new Promise((res) => setTimeout(() => res(true), 1500));
    await waitPr;
  });

  // Some issue with our setup and push will not work
  PushNotifications.addListener("registrationError", (error) => {});

  // Show us the notification payload if the app is open on our device
  PushNotifications.addListener(
    "pushNotificationReceived",
    (notification) => {}
  );

  // Method called when tapping on a notification
  PushNotifications.addListener(
    "pushNotificationActionPerformed",
    (notification) => {}
  );

  // Request permission to use push notifications
  // iOS will prompt user and return if they granted permission or not
  // Android will just grant without prompting

  const result = await PushNotifications.requestPermissions();
  if (result.receive === "granted") {
    // Register with Apple / Google to receive push via APNS/FCM
    await PushNotifications.register();
    return true;
  } else {
    return false;
  }
}
