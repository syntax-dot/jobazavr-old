import bridge from "@vkontakte/vk-bridge";

export async function vkShowSlidesSheet(
  slides: {
    media: { blob: string; type: string };
    title: string;
    subtitle: string;
  }[]
) {
  try {
    // @ts-expect-error
    return await bridge.send("VKWebAppShowSlidesSheet", {
      slides,
    });
  } catch (e) {
    console.error(e);
  }
}
