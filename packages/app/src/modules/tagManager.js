import Analytics from "analytics";
import googleTagManager from "@analytics/google-tag-manager";
import { AppMetrica } from "capacitor-appmetrica-plugin";

const analytics = Analytics({
  app: "jobazavr",
  plugins: [
    googleTagManager({
      containerId: "G-6QWM848VFD",
    }),
  ],
});

/* Track a custom event */
export async function tagRegisterButton() {
  await analytics.track("reg");
  await AppMetrica.reportEvent({
    name: "reg",
  });
}
export async function tagLogoOnMap() {
  await analytics.track("shop");
  await AppMetrica.reportEvent({
    name: "shop",
  });
}
export async function tagVacancyCard() {
  await analytics.track("vacancy");
  await AppMetrica.reportEvent({
    name: "vacancy",
  });
}
export async function tagResponseCard() {
  const res = await analytics.track("response");
  await AppMetrica.reportEvent({
    name: "response",
  });
}
export async function tagFavouriteMarkAdd() {
  await analytics.track("favourites");
  await AppMetrica.reportEvent({
    name: "favourites",
  });
}
export async function tagSimillarButton() {
  await analytics.track("similar");
  await AppMetrica.reportEvent({
    name: "similar",
  });
}
export async function tagHelpButton() {
  await analytics.track("help");
  await AppMetrica.reportEvent({
    name: "help",
  });
}
export async function tagListPage() {
  await analytics.track("collection");
  await AppMetrica.reportEvent({
    name: "collection",
  });
}
export async function tagFavouritePage() {
  await analytics.track("favouriteslist");
  await AppMetrica.reportEvent({
    name: "favouriteslist",
  });
}
