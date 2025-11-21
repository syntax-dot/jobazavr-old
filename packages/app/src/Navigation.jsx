import React, { Suspense, lazy, useEffect, useState } from "react";
import { withRouter } from "@reyzitwo/react-router-vkminiapps";
import { Epic, PanelHeader, SplitCol, SplitLayout } from "@vkontakte/vkui";
import useRouterHooks from "/src/hooks/useRouterHooks";
import PageConstructor from "/src/components/__global/PageConstructor";
import Home from "./components/home/base";
import MobileNavigation from "./components/__navigation/Mobile";
import DesktopNavigation from "./components/__navigation/Desktop";
import CustomView from "./components/__global/CustomView";
import Register from "./components/home/register";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getClubData,
  getCurrentTab,
  getInitData,
  getSelectedLanguage,
  getShowPageHeader,
  getTheme,
} from "./storage/selectors/main";
import WorkList from "./components/list/base";
import { YMaps } from "@pbe/react-yandex-maps";
import MapPanel from "./components/map/base";
import Profile from "./components/profile/profilePanel/base";
import AdminPanel from "./components/admin/base";
import ShowWork from "./components/__modals/showWork";
import ShowSimmilar from "./components/map/ShowSimmilar";
import ShowTerms from "./components/map/ShowTerms";
import { Authorization } from "./components/authorization/Onboarding/base";
import { PhoneForm } from "./components/authorization/PhoneForm/base";
import { CodeForm } from "./components/authorization/CodeForm/base";
import { App as CapacitorApp } from "@capacitor/app";
import { RegisterModal } from "./components/__modals/RegisterModal";
import { ClubPanel } from "./components/club/clubPanel/ClubPanel";
import { FormPanel } from "./components/club/formPanel/FormPanel";
import { Preferences } from "@capacitor/preferences";
import { CitiesSelect } from "./components/cities/citiesSelect/CitiesSelect";
import api from "./modules/apiRequest";
import { useTranslate } from "@tolgee/react";
import { EditVacancy } from "./components/map/EditVacancy";
import { NotificationsPanel } from "./components/profile/notificationsPanel/NotificationsPanel";

const MainStack = lazy(() => import("./components/__modals/MainStack"));

const Navigation = ({ router, isDesktop }) => {
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const { t } = useTranslate();
  const [clubData, setClubData] = useRecoilState(getClubData);
  const routerHooks = useRouterHooks({ router });
  const showPageHeader = useRecoilValue(getShowPageHeader);
  const [, setTheme] = useRecoilState(getTheme);
  const currentTab = useRecoilValue(getCurrentTab);
  const initData = useRecoilValue(getInitData);
  const activeModal = router.modal;
  const [clubShown, setClubShown] = useState(false);

  function listener() {
    if (currentTab === "map" || currentTab === "onboard") {
      CapacitorApp.exitApp();
    } else {
      routerHooks.toBack();
    }
  }

  useEffect(() => {
    CapacitorApp.addListener("backButton", () => {
      listener();
    });
    return () => CapacitorApp.removeAllListeners();
  }, [currentTab]);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    const get = async () => {
      if (!initData) {
        const { value: trainingPassed } = await Preferences.get({
          key: "first_training",
        });
        if (trainingPassed !== "true") {
          routerHooks.toModal("tutorial");
        } else {
        }
      } else {
      }
    };
    get();
  }, []);

  useEffect(() => {
    if (!clubShown) {
      const inter = setInterval(async () => {
        if (currentTab === "map" && !activeModal) {
          if (!clubData) {
            const { data: responseData } = await api("club");
            if (responseData) {
              setClubData(responseData);
              clearInterval(inter);
              setClubShown(true);
            } else {
              routerHooks.toModal("clubBanner");
              clearInterval(inter);
              setClubShown(true);
            }
          }
        }
      }, 15000);
      return () => clearInterval(inter);
    }
  }, [currentTab, initData]);

  return (
    <YMaps query={{ lang: "ru_RU" }} preload={true}>
      <SplitLayout
        header={<PanelHeader separator={false} />}
        className={"jcc"}
        modal={
          <Suspense fallback={""}>
            <MainStack
              modal={router.modal}
              toBack={routerHooks.toBack}
              routerHooks={routerHooks}
            />
          </Suspense>
        }
        popout={router.popout}
      >
        <SplitCol
          animate={true}
          spaced={isDesktop}
          width={isDesktop ? "650px" : "100%"}
          maxWidth={isDesktop ? "650px" : "100%"}
        >
          <Epic
            activeStory={router.activeView}
            tabbar={
              !isDesktop ? (
                <MobileNavigation
                  activeView={router.activeView}
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                />
              ) : null
            }
          >
            <CustomView id={"authorization"}>
              <PageConstructor
                routerHooks={routerHooks}
                removeHeader={true}
                id={"authorization"}
              >
                <Authorization
                  openPage={routerHooks.openPage}
                  toPanel={routerHooks.toPanel}
                />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                removeHeader={true}
                id={"phoneForm"}
              >
                <PhoneForm toPanel={routerHooks.toPanel} />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                toBack={routerHooks.toBack}
                id={"codeForm"}
              >
                <CodeForm
                  toPanel={routerHooks.toPanel}
                  openPage={routerHooks.openPage}
                />
              </PageConstructor>
            </CustomView>
            <CustomView id="map">
              <PageConstructor
                routerHooks={routerHooks}
                openPage={routerHooks.openPage}
                id={"map"}
                name={t({
                  key: "map_page",
                  defaultValue: "Поиск надёжной работы",
                  language: selectedLanguage,
                })}
              >
                <MapPanel
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                  rhooks={router}
                />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                id="showWork"
                name={showPageHeader}
                toBack={routerHooks.toBack}
              >
                <ShowWork
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                />
              </PageConstructor>

              <PageConstructor
                routerHooks={routerHooks}
                id="showTerms"
                name={showPageHeader}
                toBack={routerHooks.toBack}
              >
                <ShowTerms
                  toPopout={routerHooks.toPopout}
                  toBack={routerHooks.toBack}
                  view={"map"}
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                id="editVacancy"
                name={showPageHeader}
                toBack={routerHooks.toBack}
              >
                <EditVacancy
                  toBack={routerHooks.toBack}
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                name={t({
                  key: "similar_page",
                  defaultValue: "Похожие вакансии",
                  language: selectedLanguage,
                })}
                id="showSimmilar"
                toBack={routerHooks.toBack}
              >
                <ShowSimmilar
                  activeView={router.activeView}
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                id="register"
                name={
                  initData
                    ? t({
                        key: "account_fill",
                        defaultValue: "Заполнение анкеты",
                        language: selectedLanguage,
                      })
                    : t({
                        key: "register",
                        defaultValue: "Регистрация",
                        language: selectedLanguage,
                      })
                }
                toBack={routerHooks.toBack}
              >
                <RegisterModal
                  close={routerHooks.toBack}
                  toPanel={routerHooks.toPanel}
                />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                removeHeader={true}
                id={"phoneForm"}
              >
                <PhoneForm toPanel={routerHooks.toPanel} />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                toBack={routerHooks.toBack}
                id={"codeForm"}
              >
                <CodeForm
                  toPanel={routerHooks.toPanel}
                  openPage={routerHooks.openPage}
                />
              </PageConstructor>
            </CustomView>
            <CustomView id="home">
              <PageConstructor
                routerHooks={routerHooks}
                id={"home"}
                name={t({
                  key: "welcome",
                  defaultValue: "Добро пожаловать!",
                  language: selectedLanguage,
                })}
              >
                <Home
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                  openPage={routerHooks.openPage}
                />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                id={"register"}
                name={t({
                  key: "welcome",
                  defaultValue: "Добро пожаловать!",
                  language: selectedLanguage,
                })}
              >
                <Register
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                  openPage={routerHooks.openPage}
                />
              </PageConstructor>

              <PageConstructor
                routerHooks={routerHooks}
                id={"home2"}
                name={"Главная 2"}
              >
                <Home toModal={routerHooks.toModal} />
              </PageConstructor>
            </CustomView>
            <CustomView id="list">
              <PageConstructor
                routerHooks={routerHooks}
                openPage={routerHooks.openPage}
                id={"list"}
                name={t({
                  key: "list_nav",
                  defaultValue: "Подборка",
                  language: selectedLanguage,
                })}
              >
                <WorkList
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                />
              </PageConstructor>
              <PageConstructor
                id="showWork"
                routerHooks={routerHooks}
                name={showPageHeader}
                toBack={routerHooks.toBack}
              >
                <ShowWork
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                id="showTerms"
                name={showPageHeader}
                toBack={routerHooks.toBack}
              >
                <ShowTerms
                  toBack={routerHooks.toBack}
                  toPopout={routerHooks.toPopout}
                  view={"list"}
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                id="editVacancy"
                name={showPageHeader}
                toBack={routerHooks.toBack}
              >
                <EditVacancy
                  toBack={routerHooks.toBack}
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                name={t({
                  key: "similar_page",
                  defaultValue: "Похожие вакансии",
                  language: selectedLanguage,
                })}
                id="showSimmilar"
                toBack={routerHooks.toBack}
              >
                <ShowSimmilar
                  activeView={router.activeView}
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                id="register"
                name={
                  initData
                    ? t({
                        key: "account_fill",
                        defaultValue: "Заполнение анкеты",
                        language: selectedLanguage,
                      })
                    : t({
                        key: "register",
                        defaultValue: "Регистрация",
                        language: selectedLanguage,
                      })
                }
                toBack={routerHooks.toBack}
              >
                <RegisterModal
                  close={routerHooks.toBack}
                  toPanel={routerHooks.toPanel}
                />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                removeHeader={true}
                id={"phoneForm"}
              >
                <PhoneForm toPanel={routerHooks.toPanel} />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                toBack={routerHooks.toBack}
                id={"codeForm"}
              >
                <CodeForm
                  toPanel={routerHooks.toPanel}
                  openPage={routerHooks.openPage}
                />
              </PageConstructor>
            </CustomView>
            <CustomView id="profile">
              <PageConstructor
                routerHooks={routerHooks}
                openPage={routerHooks.openPage}
                id={"profile"}
                name={t({
                  key: "profile_nav",
                  defaultValue: "Профиль",
                  language: selectedLanguage,
                })}
              >
                <Profile
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                  toPopout={routerHooks.toPopout}
                />
              </PageConstructor>
              <PageConstructor
                toBack={routerHooks.toBack}
                routerHooks={routerHooks}
                openPage={routerHooks.openPage}
                id={"notifications"}
                name={t({
                  key: "profile_notifications",
                  defaultValue: "Подписки",
                  language: selectedLanguage,
                })}
              >
                <NotificationsPanel
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                  toPopout={routerHooks.toPopout}
                />
              </PageConstructor>
              <PageConstructor
                id="register"
                routerHooks={routerHooks}
                name={
                  initData
                    ? t({
                        key: "account_fill",
                        defaultValue: "Заполнение анкеты",
                        language: selectedLanguage,
                      })
                    : t({
                        key: "register",
                        defaultValue: "Регистрация",
                        language: selectedLanguage,
                      })
                }
                toBack={routerHooks.toBack}
              >
                <RegisterModal
                  close={routerHooks.toBack}
                  toPanel={routerHooks.toPanel}
                />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                removeHeader={true}
                id={"phoneForm"}
              >
                <PhoneForm toPanel={routerHooks.toPanel} />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                toBack={routerHooks.toBack}
                id={"codeForm"}
              >
                <CodeForm
                  toPanel={routerHooks.toPanel}
                  openPage={routerHooks.openPage}
                />
              </PageConstructor>
            </CustomView>
            <CustomView id="admin">
              <PageConstructor
                routerHooks={routerHooks}
                openPage={routerHooks.openPage}
                id={"admin"}
                name={"Админ-Панель"}
              >
                <AdminPanel
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                />
              </PageConstructor>
            </CustomView>
            <CustomView id="Jclub">
              <PageConstructor
                routerHooks={routerHooks}
                openPage={routerHooks.openPage}
                id={"Jclub"}
                name={"Jobazavr Club"}
              >
                <ClubPanel
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                  toPopout={routerHooks.toPopout}
                />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                openPage={routerHooks.openPage}
                id={"clubForm"}
                name={t({
                  key: "account_fill",
                  defaultValue: "Заполнение анкеты",
                  language: selectedLanguage,
                })}
                toBack={routerHooks.toBack}
              >
                <FormPanel
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                  toPopout={routerHooks.toPopout}
                />
              </PageConstructor>
            </CustomView>
            <CustomView id={"cities"}>
              <PageConstructor
                id={"cities"}
                routerHooks={routerHooks}
                openPage={routerHooks.openPage}
                name={t({
                  key: "city_select",
                  defaultValue: "Выбор города",
                  language: selectedLanguage,
                })}
                toBack={routerHooks.toBack}
              >
                <CitiesSelect
                  toBack={routerHooks.toBack}
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                  toPopout={routerHooks.toPopout}
                />
              </PageConstructor>
            </CustomView>
          </Epic>
        </SplitCol>
      </SplitLayout>
    </YMaps>
  );
};

export default withRouter(Navigation);
