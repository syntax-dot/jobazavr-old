import React from "react";
import ReactDOM from "react-dom";

import { AdaptivityProvider } from "@vkontakte/vkui";
import { RecoilRoot } from "recoil";
import Router from "@reyzitwo/react-router-vkminiapps";

import structure from "/src/structure";
import "/src/assets/css/global.scss";

import App from "/src/App";
import themeManager from "/src/modules/themeManager";
import bridge from "@vkontakte/vk-bridge";

import { DevTools, FormatSimple, Tolgee, TolgeeProvider } from "@tolgee/react";
import * as localeRu from "./i18n/ru.json";
import * as localeKy from "./i18n/ky.json";
import * as localeTg from "./i18n/tg.json";
import * as localeUz from "./i18n/uz.json";

const app = async () => {
  bridge.send("VKWebAppInit").catch((e) => console.error(e));
  const themeController = new themeManager();

  const tolgee = Tolgee()
    .use(DevTools())
    .use(FormatSimple())
    .init({
      language: "ru",
      // for development
      // apiUrl: import.meta.env.VITE_REACT_APP_TOLGEE_API_URL,
      // apiKey: import.meta.env.VITE_REACT_APP_TOLGEE_API_KEY,
      staticData: {
        ru: localeRu,
        ky: localeKy,
        tg: localeTg,
        uz: localeUz,
      },
    });

  ReactDOM.render(
    <RecoilRoot>
      <TolgeeProvider tolgee={tolgee}>
        <AdaptivityProvider>
          <Router structure={structure}>
            <App themeController={themeController} />
          </Router>
        </AdaptivityProvider>
      </TolgeeProvider>
    </RecoilRoot>,
    document.getElementById("root")
  );
};

app().then(() => {
  if (import.meta.env.MODE === "development")
    import("/src/dev/eruda.js").then(({ default: {} }) => {});
});
