import React, { Suspense, lazy, useEffect, useState } from "react";
import { withRouter } from "@reyzitwo/react-router-vkminiapps";
import {
  Epic,
  PanelHeader,
  PanelSpinner,
  SplitCol,
  SplitLayout,
} from "@vkontakte/vkui";

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
  getCurrentView,
  getFavouriteJobs,
  getInitData,
  getSelectedLanguage,
  getSelectedVacancy,
  getShowPageHeader,
} from "./storage/selectors/main";
import WorkList from "./components/list/base";
import { YMaps } from "@pbe/react-yandex-maps";
import MapPanel from "./components/map/base";
import Profile from "./components/profile/base";
import AdminPanel from "./components/admin/base";
import ShowWork from "./components/__modals/showWork";
import ShowSimmilar from "./components/map/ShowSimmilar";
import ShowTerms from "./components/map/ShowTerms";
import showTerms from "./components/map/ShowTerms";
import api from "./modules/apiRequest";
import { ClubPanel } from "./components/club/clubPanel/ClubPanel";
import { FormPanel } from "./components/club/formPanel/FormPanel";
import { CitiesSelect } from "./components/cities/citiesSelect/CitiesSelect";
import { EditVacancy } from "./components/map/EditVacancy";
import { NotificationsPanel } from "./components/profile/NotificationsPanel";
import { useTranslate } from "@tolgee/react";

const MainStack = lazy(() => import("./components/__modals/MainStack"));

const Navigation = ({ router, isDesktop }) => {
  const { t } = useTranslate();
  const routerHooks = useRouterHooks({ router });
  const [showPageHeader, setShowPageHeader] = useRecoilState(getShowPageHeader);
  const [selectedVacancy, setSelectedVacancy] =
    useRecoilState(getSelectedVacancy);
  const [favouiteJobs, setFavouriteJobs] = useRecoilState(getFavouriteJobs);
  const [loaded, setLoaded] = useState(false);
  const platformType = localStorage.getItem("platformType");
  const [clubShown, setClubShown] = useState(false);
  const currentTab = useRecoilValue(getCurrentView);
  const activeModal = router.modal;
  const [clubData, setClubData] = useRecoilState(getClubData);
  const initData = useRecoilValue(getInitData);
  const selectedLanguage = useRecoilValue(getSelectedLanguage);

  useEffect(() => {
    const get = async () => {
      if (initData.onboarding) {
        const trainingPassed = localStorage.getItem("first_training");
        if (!trainingPassed || trainingPassed !== "true") {
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

  useEffect(async () => {
    const jobId = window.location.href.split("#")[1];
    if (platformType === "vk") {
      if (jobId) {
        if (!favouiteJobs) {
          try {
            const { data: favoriteData } = await api("jobs/favorites");
            if (favoriteData) {
              setFavouriteJobs(favoriteData);
            } else {
              setFavouriteJobs([]);
            }
          } catch (error) {
            setFavouriteJobs([]);
          }
        }
        const id = parseInt(jobId.split("=")[1]);
        const { data: responseData } = await api(`jobs/id/${id}`);
        setShowPageHeader(responseData.title);
        setSelectedVacancy({ ...responseData, favourite: true });
        routerHooks.openPage("map", "showTerms");
      }
    }
    setLoaded(true);
  }, []);

  if (!loaded) return <PanelSpinner />;

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
        {isDesktop ? (
          <DesktopNavigation
            activeView={router.activeView}
            openPage={routerHooks.openPage}
          />
        ) : null}

        <SplitCol
          animate={!isDesktop}
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
                />
              ) : null
            }
          >
            <CustomView id="map">
              <PageConstructor
                routerHooks={routerHooks}
                openPage={routerHooks.openPage}
                id={"map"}
                name={"Поиск надёжной работы"}
              >
                <MapPanel
                  toModal={routerHooks.toModal}
                  rhooks={router.switchBack}
                  toPanel={routerHooks.toPanel}
                  activeModal={router.modal}
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
                  view={"map"}
                  toBack={routerHooks.toBack}
                  toPopout={routerHooks.toPopout}
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
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                  toBack={routerHooks.toBack}
                />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                name="Похожие вакансии"
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
            </CustomView>
            <CustomView id="home">
              <PageConstructor
                routerHooks={routerHooks}
                id={"home"}
                name={"Добро пожаловать!"}
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
                name={"Добро пожаловать!"}
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
            <CustomView routerHooks={routerHooks} id="list">
              <PageConstructor
                routerHooks={routerHooks}
                openPage={routerHooks.openPage}
                id={"list"}
                name={"Подборка"}
              >
                <WorkList
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
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
                  toBack={routerHooks.toBack}
                  toPopout={routerHooks.toPopout}
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
                  view={"list"}
                />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                id="editVacancy"
                name={showPageHeader}
                toBack={routerHooks.toBack}
              >
                <EditVacancy
                  openPage={routerHooks.openPage}
                  toModal={routerHooks.toModal}
                  toBack={routerHooks.toBack}
                  toPanel={routerHooks.toPanel}
                />
              </PageConstructor>
              <PageConstructor
                routerHooks={routerHooks}
                name="Похожие вакансии"
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
            </CustomView>
            <CustomView id="profile">
              <PageConstructor
                routerHooks={routerHooks}
                openPage={routerHooks.openPage}
                id={"profile"}
                name={"Профиль"}
              >
                <Profile
                  toModal={routerHooks.toModal}
                  toPanel={routerHooks.toPanel}
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
                name={"Заполнение анкеты"}
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
                name={"Выбор города"}
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
