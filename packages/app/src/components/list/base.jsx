import {
  Icon24MessageReplyOutline,
  Icon28InfoCircleOutline,
  Icon56ErrorTriangleOutline,
  Icon56ListBulletSquareOutline,
} from "@vkontakte/icons";
import {
  Avatar,
  CustomSelect,
  Footer,
  Group,
  Headline,
  PanelSpinner,
  Placeholder,
  RichCell,
  Tabs,
  TabsItem,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import api from "../../modules/apiRequest";
import declOfNum from "../../modules/declOfNum";
import distance from "../../modules/distance";
import dividePrice from "../../modules/dividePrice";
import {
  getAfterClickList,
  getCitiesData,
  getCurrentTab,
  getCurrentView,
  getFavouriteJobs,
  getInitData,
  getListCityLabel,
  getListInitDataHandler,
  getListPlacemarks,
  getListSelectState,
  getMapFilterQuery,
  getMockMarks,
  getNearestData,
  getPlaceData,
  getReplyHandler,
  getSelectedCity,
  getSelectedLanguage,
  getSelectedVacancy,
} from "../../storage/selectors/main";
import { tagFavouritePage } from "../../modules/tagManager";
import { Geolocation } from "@capacitor/geolocation";
import { T, useTranslate } from "@tolgee/react";
import CyrillicToTranslit from "cyrillic-to-translit-js";

const WorkList = ({ openPage, toPanel }) => {
  const { t } = useTranslate();
  const Translit = new CyrillicToTranslit({ preset: "ru" });
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const [afterClickList, setAfterClickList] = useRecoilState(getAfterClickList);
  const [mount, setMount] = useState(0);
  const [, setQuery] = useState("");
  const initData = useRecoilValue(getInitData);
  const mockMarks = useRecoilValue(getMockMarks);
  const [favouriteMarks, setFavouritesMarks] = useRecoilState(getFavouriteJobs);
  const [select, setSelect] = useRecoilState(getListSelectState);
  const [placemarks, setPlacemarks] = useRecoilState(getListPlacemarks);
  const [, setPlaceData] = useRecoilState(getPlaceData);
  const [, setNearest] = useRecoilState(getNearestData);
  const [, setSelectedMark] = useRecoilState(getSelectedVacancy);
  const [replyHandler, setReplyHandler] = useRecoilState(getReplyHandler);
  const [listChangeHandler, setListChangeHandler] = useRecoilState(
    getListInitDataHandler
  );
  const selectedCity = useRecoilValue(getSelectedCity);
  const [geoRequest, setGeoRequest] = useState(false);
  const [, setCurrentTab] = useRecoilState(getCurrentTab);
  const [, setCurrentView] = useRecoilState(getCurrentView);
  const [isLoading, setIsLoading] = useState({ cities: false, list: false });
  const citiesData = useRecoilValue(getCitiesData);
  const [data, setData] = useState({ city: "" });
  const [isCitySelecting, setIsCitySelecting] = useState(false);
  const [, setListCityLabel] = useRecoilState(getListCityLabel);
  const mapFilterQuery = useRecoilValue(getMapFilterQuery);

  useEffect(() => {
    setCurrentTab("list");
    setCurrentView("list");
    setMount(1);
  }, []);

  const lastLocation = window.localStorage.getItem("recievedLocation");

  const handleClickMark = async (mark, favorite = false) => {
    setAfterClickList(true);
    if (favorite) {
      setSelectedMark({ ...mark, favourite: true });
      toPanel("showTerms");
    } else {
      const mappedData = placemarks.map((i, index) => [
        distance(
          parseFloat(mark.latitude),
          parseFloat(mark.longitude),
          i.latitude,
          i.longitude
        ),
        index,
      ]);
      const sorted = mappedData
        .sort((a, b) => a[0] - b[0])
        .filter((i) => i[0] <= 0.001);
      setNearest(sorted.map((i) => placemarks[i[1]]));
      setPlaceData(mark);
      toPanel("showWork");
    }
  };

  async function changeListPlacemarks() {
    setIsLoading((p) => ({ ...p, list: true }));
    if (selectedCity) {
      console.log("mapFilterQuery", mapFilterQuery);
      const { data: responseData } = await api(
        `jobs/city/${selectedCity.id}?limit=250${
          mapFilterQuery?.trim()?.length > 0
            ? `&query=${mapFilterQuery.trim()}`
            : ""
        }`
      );
      if (responseData) {
        setPlacemarks(responseData);
      }
    }
    setIsLoading((p) => ({ ...p, list: false }));
  }

  useEffect(() => {
    if (mount === 1 && isCitySelecting === false) {
      changeListPlacemarks();
    }
  }, [isCitySelecting]);
  async function get() {
    if (selectedCity) {
      const { data: responseData } = await api(
        `jobs/city/${selectedCity.id}?limit=250`
      );
      if (responseData) {
        setPlacemarks(responseData);
      }
    } else {
      if (initData?.onboarding || !initData) {
        if (window.localStorage.getItem("recievedLocation")) {
          let latitude;
          let longitude;

          if (window.localStorage.getItem("recievedLocation")) {
            const coords = JSON.parse(
              window.localStorage.getItem("recievedLocation")
            );
            latitude = coords[0];
            longitude = coords[1];
          }
          let resData;
          !placemarks || listChangeHandler
            ? (resData = await api(
                `jobs/nearby?latitude=${latitude}&longitude=${longitude}&radius=0.2&limit=200&offset=0`
              ))
            : null;
          !placemarks || listChangeHandler ? setPlacemarks(resData.data) : null;
          setListChangeHandler(false);
        } else {
          try {
            const coordinates = await Geolocation.getCurrentPosition();
            console.log(coordinates.coords);
            if (coordinates.coords) {
              window.localStorage.setItem(
                "recievedLocation",
                JSON.stringify([
                  coordinates.coords.latitude,
                  coordinates.coords.longitude,
                ])
              );
            }

            let latitude = coordinates.coords.latitude;
            let longitude = coordinates.coords.longitude;

            let resData;
            !placemarks || listChangeHandler
              ? (resData = await api(
                  `jobs/nearby?latitude=${latitude}&longitude=${longitude}&radius=0.2&limit=200&offset=0`
                ))
              : null;
            !placemarks || listChangeHandler
              ? setPlacemarks(resData.data)
              : null;
            setGeoRequest(true);
            setListChangeHandler(false);
          } catch (e) {
            setPlacemarks(mockMarks);
          }
        }
      } else {
        try {
          if (!placemarks || listChangeHandler) {
            const { data: marksData } = await api(
              `jobs/city/${initData.city.id}?limit=250`
            );
            setPlacemarks(marksData);
            setListChangeHandler(false);
          }
          if (replyHandler) {
            const { data: resData } = await api("jobs/favorites");
            if (resData) {
              setFavouritesMarks(resData);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    setReplyHandler(false);
  }

  const setCitiesFilter = (e) => {
    setQuery(e.target.value.trim());
  };

  const handleChange = ({ target }) => {
    if (typeof parseInt(target.value) === "number" && citiesData) {
      setListCityLabel(
        citiesData.find((i) => i.value === parseInt(target.value)).label
      );
    }
    setIsCitySelecting(false);
    console.log(target.value);
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toString(),
    }));
  };

  useEffect(() => {
    if (!afterClickList) get();
    if (afterClickList) setAfterClickList(false);
  }, []);
  return (
    <>
      {placemarks && !listChangeHandler ? (
        <>
          <Group separator="hide">
            {placemarks.length > 0 ? (
              <>
                <Placeholder
                  className="listPlaceholder"
                  icon={<Icon56ListBulletSquareOutline className="icon" />}
                  header={
                    <>
                      {t({
                        key: "we_suggest",
                        language: selectedLanguage,
                        defaultValue: "Мы подобрали",
                      })}{" "}
                      {declOfNum(placemarks.length, [
                        t({
                          key: "announce_1",
                          language: selectedLanguage,
                          defaultValue: "объявление",
                        }).toLowerCase(),
                        t({
                          key: "announce_2",
                          language: selectedLanguage,
                          defaultValue: "объявления",
                        }).toLowerCase(),
                        t({
                          key: "announce_3",
                          language: selectedLanguage,
                          defaultValue: "объявлений",
                        }).toLowerCase(),
                      ])}{" "}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        {selectedCity
                          ? `в г. ${selectedCity.title}`
                          : (initData?.onboarding || !initData) &&
                            !lastLocation &&
                            !geoRequest
                          ? "в г. Москва"
                          : t({
                              key: "nearby",
                              language: selectedLanguage,
                              defaultValue: "неподалёку от вас",
                            }).toLowerCase()}{" "}
                      </div>
                    </>
                  }
                >
                  <T keyName={"press_vacancy"} language={selectedLanguage}>
                    Нажмите на одну из вакансий и ознакомьтесь с условиями труда
                  </T>

                  <Tabs className="mt10">
                    <TabsItem
                      selected={select === 1}
                      onClick={() => setSelect(1)}
                    >
                      <T keyName={"list"} language={selectedLanguage}>
                        Список
                      </T>
                    </TabsItem>

                    <TabsItem
                      selected={select === 2}
                      onClick={() => {
                        tagFavouritePage();
                        setSelect(2);
                      }}
                    >
                      <T keyName={"favourite"} language={selectedLanguage}>
                        Избранное
                      </T>
                    </TabsItem>
                  </Tabs>
                </Placeholder>
                {isLoading.list ? (
                  <PanelSpinner />
                ) : (
                  <>
                    {select === 1 ? (
                      <div className="mt10">
                        {placemarks.map((mark) => (
                          <RichCell
                            key={mark.id}
                            multiline
                            style={{ borderRadius: 12 }}
                            before={
                              mark.avatar ? (
                                <Avatar
                                  size={28}
                                  src={mark.avatar}
                                  mode="app"
                                />
                              ) : (
                                <Icon28InfoCircleOutline />
                              )
                            }
                            onClick={() => handleClickMark(mark)}
                            children={
                              <Headline level="1" weight="1">
                                {mark.title}
                              </Headline>
                            }
                            text={mark.description}
                            after={
                              <Headline level="1" weight="1">
                                {dividePrice(mark.salary)}
                              </Headline>
                            }
                            caption={
                              selectedLanguage === "en" ||
                              selectedLanguage === "uz"
                                ? Translit.transform(mark.address)
                                : mark.address
                            }
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="mt10">
                        {favouriteMarks?.length > 0 ? (
                          <>
                            {favouriteMarks
                              .filter((i) => i.replied)
                              .map((mark) => (
                                <RichCell
                                  key={mark.id}
                                  multiline
                                  style={{ borderRadius: 12 }}
                                  afterCaption={
                                    <div
                                      className="flex jcc aic"
                                      style={{
                                        gap: 2,
                                        color: "white",
                                        padding: "4px 8px",
                                        borderRadius: 10,
                                        background:
                                          "var(--text_secondary,var(--vkui--color_text_secondary))",
                                      }}
                                    >
                                      <Icon24MessageReplyOutline
                                        style={{ color: "white" }}
                                        width={18}
                                        height={18}
                                      />
                                      Отклик
                                    </div>
                                  }
                                  before={
                                    mark.avatar ? (
                                      <Avatar
                                        size={28}
                                        src={mark.avatar}
                                        mode="app"
                                      />
                                    ) : (
                                      <Icon28InfoCircleOutline />
                                    )
                                  }
                                  onClick={() => handleClickMark(mark, true)}
                                  children={
                                    <Headline level="1" weight="1">
                                      {mark.title}
                                    </Headline>
                                  }
                                  text={mark.description}
                                  after={
                                    <Headline level="1" weight="1">
                                      {dividePrice(mark.salary)}
                                    </Headline>
                                  }
                                  caption={
                                    selectedLanguage === "en" ||
                                    selectedLanguage === "uz"
                                      ? Translit.transform(mark.address)
                                      : mark.address
                                  }
                                />
                              ))}
                            {favouriteMarks
                              .filter((i) => !i.replied)
                              .map((mark) => (
                                <RichCell
                                  key={mark.id}
                                  multiline
                                  style={{ borderRadius: 12 }}
                                  before={
                                    mark.avatar ? (
                                      <Avatar
                                        size={28}
                                        src={mark.avatar}
                                        mode="app"
                                      />
                                    ) : (
                                      <Icon28InfoCircleOutline />
                                    )
                                  }
                                  onClick={() => handleClickMark(mark, true)}
                                  children={
                                    <Headline level="1" weight="1">
                                      {mark.title}
                                    </Headline>
                                  }
                                  text={mark.description}
                                  after={
                                    <Headline level="1" weight="1">
                                      {dividePrice(mark.salary)}
                                    </Headline>
                                  }
                                  caption={
                                    selectedLanguage === "en" ||
                                    selectedLanguage === "uz"
                                      ? Translit.transform(mark.address)
                                      : mark.address
                                  }
                                />
                              ))}
                          </>
                        ) : (
                          <>
                            <Footer>
                              {t({
                                key: "nf",
                                language: selectedLanguage,
                                defaultValue: "Ничего не найдено",
                              })}
                            </Footer>
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <Placeholder
                  className="customPlaceholder"
                  icon={<Icon56ErrorTriangleOutline className="icon" />}
                  header={
                    <>
                      {t({
                        key: "nf_vacs",
                        language: selectedLanguage,
                        defaultValue: "Упс, мы не нашли вакансий",
                      })}{" "}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        {selectedCity
                          ? `в г. ${selectedCity.title}`
                          : t({
                              key: "nearby",
                              language: selectedLanguage,
                              defaultValue: "Неподалёку от вас",
                            })}{" "}
                      </div>
                    </>
                  }
                >
                  {t({
                    key: "no_one_vacs",
                    language: selectedLanguage,
                    defaultValue: "К сожалению, нет ни одной вакансии",
                  }) +
                    (selectedCity
                      ? " " +
                        t({
                          key: "right_there",
                          language: selectedLanguage,
                          defaultValue: "в указанном месте.",
                        }).toLowerCase()
                      : " " +
                        t({
                          key: "nearby_you",
                          language: selectedLanguage,
                          defaultValue: "рядом с вами.",
                        }).toLowerCase())}
                  <br />
                  {favouriteMarks?.length > 0 &&
                    t({
                      key: "favs_info",
                      language: selectedLanguage,
                      defaultValue:
                        "Ниже приведен список ваших избранных вакансий",
                    })}
                </Placeholder>
                {favouriteMarks?.length > 0 && (
                  <>
                    {favouriteMarks.map((mark) => (
                      <RichCell
                        multiline
                        key={mark.id}
                        style={{ borderRadius: 12 }}
                        before={
                          mark.avatar ? (
                            <Avatar size={28} src={mark.avatar} mode="app" />
                          ) : (
                            <Icon28InfoCircleOutline />
                          )
                        }
                        onClick={() => handleClickMark(mark, true)}
                        children={
                          <Headline level="1" weight="1">
                            {mark.title}
                          </Headline>
                        }
                        text={mark.description}
                        after={
                          <Headline level="1" weight="1">
                            {dividePrice(mark.salary)}
                          </Headline>
                        }
                        caption={
                          selectedLanguage === "en" || selectedLanguage === "uz"
                            ? Translit.transform(mark.address)
                            : mark.address
                        }
                      />
                    ))}{" "}
                  </>
                )}
              </>
            )}
          </Group>
        </>
      ) : (
        <Placeholder stretched={true}>
          <PanelSpinner />
        </Placeholder>
      )}
    </>
  );
};

export default WorkList;
