import bridge from "@vkontakte/vk-bridge";

export async function vkStorageSet(key: string, value: string) {
  try {
    const res = await bridge.send("VKWebAppStorageSet", { key, value });
    return res.result;
  } catch (e) {
    console.error(e);
  }
}