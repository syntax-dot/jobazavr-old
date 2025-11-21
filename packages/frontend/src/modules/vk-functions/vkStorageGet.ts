import bridge from "@vkontakte/vk-bridge";

export async function vkStorageGet(keys: string[]) {
  try {
    const res = await bridge.send("VKWebAppStorageGet", { keys });
    return res.keys;
  } catch (e) {
    console.error(e);
  }
}
