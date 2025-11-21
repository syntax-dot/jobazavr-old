import Analytics from "analytics";
import googleTagManager from "@analytics/google-tag-manager";

const analytics = Analytics({
  app: "jobazavr",
  plugins: [
    googleTagManager({
      containerId: "G-6QWM848VFD",
    }),
  ],
});

/* Track a custom event */
export function tagRegisterButton() {
  analytics.track("reg");
}
export function tagLogoOnMap() {
  analytics.track("shop");
}
export function tagVacancyCard() {
  analytics.track("vacancy");
}
export function tagResponseCard() {
  analytics.track("response");
}
export function tagFavouriteMarkAdd() {
  analytics.track("favourites");
}
export function tagSimillarButton() {
  analytics.track("similar");
}
export function tagHelpButton() {
  analytics.track("help");
}
export function tagListPage() {
  analytics.track("collection");
}
export function tagFavouritePage() {
  analytics.track("favouriteslist");
}
