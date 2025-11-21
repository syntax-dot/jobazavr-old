import { selector } from "recoil";
import _ from "/src/storage/atoms/main";

export const getIsDesktop = selector({
  key: "getIsDesktop2",
  get: ({ get }) => get(_).isDesktop,
});
export const getSnackbar = selector({
  key: "getSnackbar2",
  get: ({ get }) => get(_).snackbar,
  set: ({ set }, value) => set(_, (state) => ({ ...state, snackbar: value })), // setter example
});

export const getPlatform = selector({
  key: "getPlatform2",
  get: ({ get }) => get(_).platform,
});
export const getOnboarding = selector({
  key: "getOnboarding2",
  get: ({ get }) => get(_).onBoarding,
  set: ({ set }, value) => set(_, (state) => ({ ...state, onBoarding: value })), // setter example
});
export const getInitData = selector({
  key: "getInitData2",
  get: ({ get }) => get(_).initData,
  set: ({ set }, value) => set(_, (state) => ({ ...state, initData: value })), // setter example
});
export const getCitizenshipsData = selector({
  key: "getCitizenshipsData2",
  get: ({ get }) => get(_).citizenshipsData,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, citizenshipsData: value })), // setter example
});
export const getCitiesData = selector({
  key: "getCitiesData2",
  get: ({ get }) => get(_).citiesData,
  set: ({ set }, value) => set(_, (state) => ({ ...state, citiesData: value })), // setter example
});
export const getPlaceData = selector({
  key: "getPlaceData2",
  get: ({ get }) => get(_).placeData,
  set: ({ set }, value) => set(_, (state) => ({ ...state, placeData: value })), // setter example
});
export const getMarksData = selector({
  key: "getMarksData2",
  get: ({ get }) => get(_).marksData,
  set: ({ set }, value) => set(_, (state) => ({ ...state, marksData: value })), // setter example
});
export const getNearestData = selector({
  key: "getNearestData2",
  get: ({ get }) => get(_).nearestData,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, nearestData: value })), // setter example
});
export const getUserPhoto = selector({
  key: "getUserPhoto2",
  get: ({ get }) => get(_).photo,
  set: ({ set }, value) => set(_, (state) => ({ ...state, photo: value })), // setter example
});
export const getStateCoords = selector({
  key: "getStateCoords",
  get: ({ get }) => get(_).stateCoords,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, stateCoords: value })), // setter example
});
export const getChangeProfile = selector({
  key: "getChangeProfile",
  get: ({ get }) => get(_).changeProfile,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, changeProfile: value })), // setter example
});
export const getModalState = selector({
  key: "getModalState",
  get: ({ get }) => get(_).modalState,
  set: ({ set }, value) => set(_, (state) => ({ ...state, modalState: value })), // setter example
});
export const getTheme = selector({
  key: "getTheme",
  get: ({ get }) => get(_).theme,
  set: ({ set }, value) => set(_, (state) => ({ ...state, theme: value })), // setter example
});
export const getSelectedVacancy = selector({
  key: "getSelectedVacancy",
  get: ({ get }) => get(_).selectedVacancyData,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, selectedVacancyData: value })), // setter example
});
export const getSimillarPoints = selector({
  key: "getSimillarPoints",
  get: ({ get }) => get(_).simillarPointsData,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, simillarPointsData: value })), // setter example
});
export const getShowPageHeader = selector({
  key: "getShowPageHeader",
  get: ({ get }) => get(_).showPageHeader,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, showPageHeader: value })), // setter example
});
export const getFavouriteJobs = selector({
  key: "getFavouriteJobs",
  get: ({ get }) => get(_).favouriteJobs,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, favouriteJobs: value })), // setter example
});
export const getListSelectState = selector({
  key: "getListSelectState",
  get: ({ get }) => get(_).listSelectState,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, listSelectState: value })), // setter example
});
export const getAppType = selector({
  key: "getAppType",
  get: ({ get }) => get(_).appType,
  set: ({ set }, value) => set(_, (state) => ({ ...state, appType: value })), // setter example
});
export const getDataForPatch = selector({
  key: "getDataForPatch",
  get: ({ get }) => get(_).dataforpatch,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, dataforpatch: value })), // setter example
});
export const getTgWindowOpened = selector({
  key: "getTgWindowOpened",
  get: ({ get }) => get(_).tgWindowOpened,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, tgWindowOpened: value })), // setter example
});
export const getReadyToUse = selector({
  key: "getReadyToUse",
  get: ({ get }) => get(_).readyToUse,
  set: ({ set }, value) => set(_, (state) => ({ ...state, readyToUse: value })), // setter example
});
export const getRegisterPhone = selector({
  key: "getRegisterPhone",
  get: ({ get }) => get(_).registerPhone,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, registerPhone: value })), // setter example
});
export const getZoom = selector({
  key: "getZoom",
  get: ({ get }) => get(_).zoom,
  set: ({ set }, value) => set(_, (state) => ({ ...state, zoom: value })), // setter example
});
export const getReplyHandler = selector({
  key: "getReplyHandler",
  get: ({ get }) => get(_).replyHandler,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, replyHandler: value })), // setter example
});
export const getLastGeolocation = selector({
  key: "getLastGeolocation",
  get: ({ get }) => get(_).lastGeoLocation,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, lastGeoLocation: value })), // setter example
});
export const getClickedLocation = selector({
  key: "getClickedLocation",
  get: ({ get }) => get(_).clickedLocation,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, clickedLocation: value })), // setter example
});
export const getSavedPhone = selector({
  key: "getSavedPhone",
  get: ({ get }) => get(_).savedPhone,
  set: ({ set }, value) => set(_, (state) => ({ ...state, savedPhone: value })), // setter example
});
export const getListPlacemarks = selector({
  key: "getListPlacemarks",
  get: ({ get }) => get(_).listPlacemarks,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, listPlacemarks: value })), // setter example
});
export const getListInitDataHandler = selector({
  key: "getListInitDataHandler",
  get: ({ get }) => get(_).listInitDataHandler,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, listInitDataHandler: value })), // setter example
});
export const getMockMarks = selector({
  key: "getMockMarks",
  get: ({ get }) => get(_).mockMarks,
  set: ({ set }, value) => set(_, (state) => ({ ...state, mockMarks: value })), // setter example
});

export const getTabbarHidden = selector({
  key: "getTabbarHidden",
  get: ({ get }) => get(_).tabbarHidden,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, tabbarHidden: value })), // setter example
});
export const getSentPhone = selector({
  key: "getSentPhone",
  get: ({ get }) => get(_).sentPhone,
  set: ({ set }, value) => set(_, (state) => ({ ...state, sentPhone: value })), // setter example
});
export const getAuthFirst = selector({
  key: "getAuthFirst",
  get: ({ get }) => get(_).authFirst,
  set: ({ set }, value) => set(_, (state) => ({ ...state, authFirst: value })), // setter example
});
export const getAfterLogin = selector({
  key: "getAfterLogin",
  get: ({ get }) => get(_).afterLogin,
  set: ({ set }, value) => set(_, (state) => ({ ...state, afterLogin: value })), // setter example
});
export const getCurrentTab = selector({
  key: "getCurrentTab",
  get: ({ get }) => get(_).currentTab,
  set: ({ set }, value) => set(_, (state) => ({ ...state, currentTab: value })), // setter example
});
export const getCurrentView = selector({
  key: "getCurrentView",
  get: ({ get }) => get(_).currentView,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, currentView: value })), // setter example
});
export const getSavedMarks = selector({
  key: "getSavedMarks",
  get: ({ get }) => get(_).savedMarks,
  set: ({ set }, value) => set(_, (state) => ({ ...state, savedMarks: value })), // setter example
});
export const getFilterCity = selector({
  key: "getFilterCity",
  get: ({ get }) => get(_).filterCity,
  set: ({ set }, value) => set(_, (state) => ({ ...state, filterCity: value })), // setter example
});
export const getFilterWorkPlace = selector({
  key: "getFilterWorkPlace",
  get: ({ get }) => get(_).filterWorkPlace,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, filterWorkPlace: value })), // setter example
});
export const getFilterJob = selector({
  key: "getFilterJob",
  get: ({ get }) => get(_).filterJob,
  set: ({ set }, value) => set(_, (state) => ({ ...state, filterJob: value })), // setter example
});
export const getMapFilterQuery = selector({
  key: "getMapFilterQuery",
  get: ({ get }) => get(_).mapFilterQuery,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, mapFilterQuery: value })), // setter example
});
export const getListCityLabel = selector({
  key: "getListCityLabel",
  get: ({ get }) => get(_).listCityLabel,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, listCityLabel: value })), // setter example
});
export const getClubData = selector({
  key: "getClubData",
  get: ({ get }) => get(_).clubData,
  set: ({ set }, value) => set(_, (state) => ({ ...state, clubData: value })), // setter example
});
export const getListCities = selector({
  key: "getListCities",
  get: ({ get }) => get(_).listCities,
  set: ({ set }, value) => set(_, (state) => ({ ...state, listCities: value })), // setter example
});
export const getSelectedCity = selector({
  key: "getSelectedCity",
  get: ({ get }) => get(_).selectedCity,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, selectedCity: value })), // setter example
});
export const getEmployers = selector({
  key: "getEmployers",
  get: ({ get }) => get(_).employers,
  set: ({ set }, value) => set(_, (state) => ({ ...state, employers: value })), // setter example
});
export const getFilterEmployer = selector({
  key: "getFilterEmployer",
  get: ({ get }) => get(_).filterEmployer,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, filterEmployer: value })), // setter example
});
export const getClickedOnWorkplace = selector({
  key: "getClickedOnWorkplace",
  get: ({ get }) => get(_).clickedOnWorkPlace,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, clickedOnWorkPlace: value })), // setter example
});
export const getMapData = selector({
  key: "getMapData",
  get: ({ get }) => get(_).mapData,
  set: ({ set }, value) => set(_, (state) => ({ ...state, mapData: value })), // setter example
});
export const getClickedOnWorkPlaceList = selector({
  key: "getClickedOnWorkPlaceList",
  get: ({ get }) => get(_).clickedOnWorkPlaceList,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, clickedOnWorkPlaceList: value })), // setter example
});
export const getUpdateFilters = selector({
  key: "getUpdateFilters",
  get: ({ get }) => get(_).updateFilters,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, updateFilters: value })), // setter example
});
export const getFilterVacanciesData = selector({
  key: "getFilterVacanciesData",
  get: ({ get }) => get(_).filterVacanciesData,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, filterVacanciesData: value })), // setter example
});
export const getFilterEmployersData = selector({
  key: "getFilterEmployersData",
  get: ({ get }) => get(_).filterEmployersData,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, filterEmployersData: value })), // setter example
});
export const getSalaryFilterMax = selector({
  key: "getSalaryFilterMax",
  get: ({ get }) => get(_).salaryFilterMax,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, salaryFilterMax: value })), // setter example
});
export const getSalaryFilter = selector({
  key: "getSalaryFilter",
  get: ({ get }) => get(_).salaryFilter,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, salaryFilter: value })), // setter example
});
export const getSelectedVacancyForEdit = selector({
  key: "getSelectedVacancyForEdit",
  get: ({ get }) => get(_).vacancyForEdit,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, vacancyForEdit: value })), // setter example
});
export const getSelectedLanguage = selector({
  key: "getSelectedLanguage",
  get: ({ get }) => get(_).selectedLanguage,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, selectedLanguage: value })), // setter example
});
export const getFavouriteShow = selector({
  key: "getFavouriteShow",
  get: ({ get }) => get(_).favouriteShow,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, favouriteShow: value })), // setter example
});
export const getNotificationsData = selector({
  key: "getNotificationsData",
  get: ({ get }) => get(_).notificationsData,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, notificationsData: value })), // setter example
});
export const getFilterCities = selector({
  key: "getFilterCities",
  get: ({ get }) => get(_).filterCities,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, filterCities: value })), // setter example
});
export const getAfterSelectingCity = selector({
  key: "getAfterSelectingCity",
  get: ({ get }) => get(_).afterSelectingCity,
  set: ({ set }, value) =>
    set(_, (state) => ({ ...state, afterSelectingCity: value })), // setter example
});
export const getIsFirstLoad = selector({
  key: "getIsFirstLoad",
  get: ({ get }) => get(_).firstLoad,
  set: ({ set }, value) => set(_, (state) => ({ ...state, firstLoad: value })), // setter example
});
