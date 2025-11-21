import {
  AppearanceProvider,
  AppRoot,
  ConfigProvider,
  PanelSpinner,
  Placeholder,
  usePlatform,
  withAdaptivity,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { StatusBar, Style } from "@capacitor/status-bar";

import main from "/src/storage/atoms/main";
import SnackbarProvider from "/src/components/__global/SnackbarProvider";
import Navigation from "/src/Navigation";
import api from "./modules/apiRequest";
import {
  getAuthFirst,
  getInitData,
  getNotificationsData,
  getSelectedLanguage,
  getTheme,
} from "./storage/selectors/main";
import { Device } from "@capacitor/device";
import { Preferences } from "@capacitor/preferences";
import { getNotificationsInfo } from "./modules/enableNotifications";
import { Keyboard } from "@capacitor/keyboard";
import scrollOnInput from "./modules/scrollOnInput";

const App = withAdaptivity(
  ({ viewWidth, themeController }) => {
    const [authFirst, setAuthFirst] = useRecoilState(getAuthFirst);
    const [theme, setTheme] = useRecoilState(getTheme);
    const [mainCoil, updateMainCoil] = useRecoilState(main);
    const [initData, setInitData] = useRecoilState(getInitData);
    const [error, setError] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [, setSelectedLanguage] = useRecoilState(getSelectedLanguage);
    const [notificationsData, setNotificationsData] =
      useRecoilState(getNotificationsData);

    console.log('authFirst', authFirst);

    useEffect(() => {
      handleGetSubscriptions();
    }, [initData]);

    async function handleGetSubscriptions() {
      if (notificationsData) return;
      const { data: responseData } = await api("subscriptions");
      if (responseData) setNotificationsData(responseData);
    }

    useEffect(async () => {
      try {
        await handleGetSubscriptions();
      } catch (e) {
        console.log(e);
      }
      try {
        await getNotificationsInfo();
      } catch (e) {
        console.log(e);
      }
      try {
        const { value: savedLanguage } = await Preferences.get({
          key: "savedLang",
        });
        if (savedLanguage) {
          setSelectedLanguage(savedLanguage);
        } else {
          Device.getLanguageCode().then(({ value }) => {
            switch (value) {
              case "uz":
                setSelectedLanguage("uz");
                break;
              case "ky":
                setSelectedLanguage("ky");
                break;
              case "tg":
                setSelectedLanguage("tg");
                break;
              default:
                setSelectedLanguage("ru");
                break;
            }
          });
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const { data, statusCode } = await api("initialize", `GET`);
        console.log(statusCode);
        Keyboard.addListener("keyboardWillShow", () => {
          scrollOnInput.enable();
        });
        Keyboard.addListener("keyboardWillHide", () => {
          scrollOnInput.disable();
        });
        console.log('[initialize] data:', data);
        if (data) {
          setInitData({ ...data });
        } else {
          if (statusCode === 401) {
            setAuthFirst(false);
          } else {
            setError(statusCode);
          }
        }
      } catch (e) {
        setError(true);
        console.log(e.code);
        console.log("initError", e);
      } finally {
        setLoaded(true);
      }
    }, []);

    const platform = usePlatform();

    const isDesktop =
      viewWidth > 3 ||
      new URLSearchParams(window.location.search).get("vk_platform") ===
        "desktop_web";

    useEffect(() => {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      } else {
        setTheme("light");
      }

      setTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      );
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", () => {
          setTheme(
            window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light"
          );
        });
    }, []);

    useEffect(() => {
      updateMainCoil({
        ...mainCoil,
        isDesktop,
        platform,
      });
    }, []);
    useEffect(() => {
      StatusBar.setStyle({
        style: theme === "light" ? Style.Light : Style.Dark,
      });

      if (platform === "android") {
        StatusBar.setBackgroundColor({
          color: theme === "light" ? "#ffffff" : "#18181b",
        });
      }
    }, [theme, platform]);

    return (
      <ConfigProvider
        locale={"ru"}
        isWebView={false}
        appearance={theme || "light"}
        platform={isDesktop ? "android" : platform}
      >
        <AppearanceProvider appearance={theme || "light"}>
          <AppRoot mode="full">
            {!loaded ? (
              <Placeholder stretched={true}>
                <PanelSpinner />
              </Placeholder>
            ) : (
              <SnackbarProvider>
                <Navigation authFirst={authFirst} isDesktop={isDesktop} />
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
