import {
  AppearanceProvider,
  AppRoot,
  ConfigProvider,
  PanelSpinner,
  usePlatform,
  withAdaptivity,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import main from "/src/storage/atoms/main";
import bridge from "@vkontakte/vk-bridge";
import SnackbarProvider from "/src/components/__global/SnackbarProvider";
import Navigation from "/src/Navigation";
import api from "./modules/apiRequest";
import {
  getAppType,
  getFavouriteShow,
  getInitData,
  getNotificationsData,
  getSelectedLanguage,
  getTheme,
} from "./storage/selectors/main";
import InitializeError from "./components/__error/initializeError";
import { ONBOARDING_SLIDES } from "./utils/data/ONBOARDING_SLIDES";
import { vkStorageGet } from "./modules/vk-functions/vkStorageGet";
import { vkStorageSet } from "./modules/vk-functions/vkStorageSet";
import { vkShowSlidesSheet } from "./modules/vk-functions/vkShowSlidesSheet";

const App = withAdaptivity(
  ({ viewWidth, themeController }) => {
    const [theme, setTheme] = useRecoilState(getTheme);
    const [mainCoil, updateMainCoil] = useRecoilState(main);
    const [initData, setInitData] = useRecoilState(getInitData);
    const [appType, setAppType] = useRecoilState(getAppType);
    const platformType = localStorage.getItem("platformType");
    const [error, setError] = useState(null);
    const [, setSelectedLanguage] = useRecoilState(getSelectedLanguage);
    const [, setFavouriteShow] = useRecoilState(getFavouriteShow);
    const [notificationsData, setNotificationsData] =
      useRecoilState(getNotificationsData);

    async function handleGetSubscriptions() {
      if (notificationsData) return;
      const { data: responseData } = await api("subscriptions");
      if (responseData) setNotificationsData(responseData);
    }

    useEffect(() => {
      if (window.localStorage.getItem("fav"))
        window.localStorage.removeItem("fav");

      const params = new URLSearchParams(
        window.location.href
          .slice(window.location.href.indexOf("?") + 1)
          .split("#")[0]
      );
      const is_fav = params.get("vk_is_favorite");
      if (is_fav === "1") {
        window.localStorage.setItem("fav", "false");
        setFavouriteShow(false);
      } else {
        window.localStorage.setItem("fav", "true");
        setFavouriteShow(true);
      }
      const vk_language = params.get("vk_language");
      if (vk_language) {
        switch (vk_language) {
          case "tg":
            setSelectedLanguage("tg");
            break;
          case "uz":
            setSelectedLanguage("uz");
            break;
          case "ky":
            setSelectedLanguage("uz");
            break;
          default:
            setSelectedLanguage("ru");
            break;
        }
      }
    }, []);

    useEffect(async () => {
      try {
        if (window.location.href.includes("tgWebApp")) {
          localStorage.setItem("platformType", "tg");
          setAppType("tg");
          window.Telegram.WebApp.expand();
          const body = document.querySelector("body");
          body.classList.add("telegramBody");
        } else {
          localStorage.setItem("platformType", "vk");
          setAppType("vk");
        }
      } catch (error) {
        localStorage.setItem("platformType", "vk");
        setAppType("vk");
      }

      try {
        const { data, statusCode } = await api("initialize", `GET`);
        if (data) {
          setInitData(data);
          handleGetSubscriptions();
        } else {
          setError(statusCode);
        }
      } catch (e) {
        setError(true);
      }
    }, []);

    const platform = usePlatform();

    const isDesktop =
      viewWidth > 3 ||
      new URLSearchParams(window.location.search).get("vk_platform") ===
        "desktop_web";
    useEffect(() => {}, [initData]);

    useEffect(() => {
      async function showOnboarding() {
        const isSeenAlready = await vkStorageGet(["onboarding"]);
        if (isSeenAlready[0]?.value === "true") return;

        const onboardingResult = await vkShowSlidesSheet(ONBOARDING_SLIDES);
        if (onboardingResult.action !== "confirm") return;
        vkStorageSet("onboarding", "true");
      }
      function setThemeAccordingToPlatform() {
        switch (platformType) {
          case "tg": {
            const mutationObserver = new MutationObserver(function (mutations) {
              mutations.forEach(function () {
                if (window.Telegram.WebApp.colorScheme === "light") {
                  setTheme("light");
                  themeController.setTheme("light");
                } else if (window.Telegram.WebApp.colorScheme === "dark") {
                  setTheme("dark");
                  themeController.setTheme("space_gray");
                }
              });
            });
            mutationObserver.observe(document.documentElement, {
              attributes: true,
              characterData: false,
              childList: false,
              subtree: false,
              attributeOldValue: false,
              characterDataOldValue: false,
            });
            break;
          }
          default: {
            bridge.subscribe(({ detail: { type, data } }) => {
              if (type === "VKWebAppUpdateConfig") {
                setTheme(data?.scheme.includes("light") ? "light" : "dark");
                themeController.setTheme(data.scheme);
              }
            });
          }
        }
      }

      setThemeAccordingToPlatform();
      showOnboarding();
    }, []);

    useEffect(() => {
      updateMainCoil({
        ...mainCoil,
        isDesktop,
        platform,
      });
    }, []);

    return (
      <ConfigProvider
        locale={"ru"}
        isWebView={false}
        appearance={
          platformType !== "tg"
            ? theme || "light"
            : window.Telegram.WebApp.colorScheme
        }
        platform={isDesktop ? "android" : platform}
      >
        <AppearanceProvider
          appearance={
            platformType !== "tg"
              ? theme || "light"
              : window.Telegram.WebApp.colorScheme
          }
        >
          <AppRoot mode="full">
            {error ? (
              <InitializeError error={error} />
            ) : !initData && !error ? (
              <PanelSpinner />
            ) : (
              <SnackbarProvider>
                <Navigation isDesktop={isDesktop} />
              </SnackbarProvider>
            )}
          </AppRoot>
        </AppearanceProvider>
      </ConfigProvider>
    );
  },
  {
    viewWidth: true,
  }
);

export default App;
