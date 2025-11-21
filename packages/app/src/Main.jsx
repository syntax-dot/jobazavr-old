import React from "react";
import ReactDOM from "react-dom";

import { AdaptivityProvider } from "@vkontakte/vkui";
import { RecoilRoot } from "recoil";
import Router from "@reyzitwo/react-router-vkminiapps";

import structure from "/src/structure";
import "/src/assets/css/global.scss";
//
import App from "/src/App";
import themeManager from "/src/modules/themeManager";
import * as Sentry from "@sentry/react";
import { AppMetrica } from "capacitor-appmetrica-plugin";
import { DevTools, FormatSimple, Tolgee, TolgeeProvider } from "@tolgee/react";
import * as localeRu from "./i18n/ru.json";
import * as localeKy from "./i18n/ky.json";
import * as localeTg from "./i18n/tg.json";
import * as localeUz from "./i18n/uz.json";

const app = async () => {
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

  const themeController = new themeManager();
  // try {
  //   Sentry.init({
  //     dsn: "https://2212ca0b6ef78111c49dbd716e8a763e@o4505697422868480.ingest.sentry.io/4505697428897792",
  //     tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  //     replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  //     replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  //   });
  // } catch (e) {
  //   console.log(e);
  // }
  AppMetrica.activate({
    apiKey: "73e37744-7853-4a1f-828d-90392574bd25",
    logs: true,
  })
    .then(() => {
      console.log("metrica active");
    })
    .catch(() => {
      console.log("metrica fail");
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
  // import("/src/dev/eruda.js").then(({ default: {} }) => {});
});
