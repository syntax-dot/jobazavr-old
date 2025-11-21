import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import {
  Icon16ChevronRightCircleOutline,
  Icon20ChevronCircleOutline,
  Icon20ChevronRight,
  Icon20ChevronRightOutline,
  Icon24ArrowRightCircleOutline,
  Icon24ChevronRight,
  Icon24ChevronRightSquareOutline,
  Icon24NotificationOutline,
  Icon56MessageReadOutline,
} from "@vkontakte/icons";
import {
  Avatar,
  Banner,
  Button,
  ButtonGroup,
  Card,
  CardGrid,
  Div,
  FixedLayout,
  Footer,
  Group,
  Header,
  IconButton,
  PanelSpinner,
  Placeholder,
  Separator,
  SimpleCell,
  Text,
  Title,
  withModalRootContext,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRecoilState, useRecoilValue } from "recoil";
import api from "../../modules/apiRequest";
import distance from "../../modules/distance";
import dividePrice from "../../modules/dividePrice";
import getTextDifference from "../../modules/getTextDifference";
import {
  getCurrentTab,
  getCurrentView,
  getInitData,
  getIsDesktop,
  getMarksData,
  getModalState,
  getNearestData,
  getNotificationsData,
  getPlaceData,
  getSelectedLanguage,
  getSelectedVacancy,
  getShowPageHeader,
  getStateCoords,
} from "../../storage/selectors/main";
import jobazavrIcon from "../../assets/images/logo.png";
import declOfNum from "../../modules/declOfNum";
import { tagResponseCard, tagVacancyCard } from "../../modules/tagManager";
import bridge from "@vkontakte/vk-bridge";
import { T, useTranslate } from "@tolgee/react";
import CyrillicToTranslit from "cyrillic-to-translit-js";

const ShowWork = ({ close, toModal, toPanel }) => {
  const [notificationsData, setNotificationsData] =
    useRecoilState(getNotificationsData);
  const [initData, setInitData] = useRecoilState(getInitData);
  const { t } = useTranslate();
  const Translit = new CyrillicToTranslit({ preset: "ru" });
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const isDesktop = useRecoilValue(getIsDesktop);
  const [state, setState] = useState(1);
  const [stateCoords, setStateCoords] = useRecoilState(getStateCoords);
  const [place, setPlaceData] = useRecoilState(getPlaceData);
  const placemarks = useRecoilValue(getMarksData);
  const [nearestPoints, setNearest] = useRecoilState(getNearestData);
  const [selectedVacancy, setSelectedVacancy] =
    useRecoilState(getSelectedVacancy);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageHeader, setPageHeader] = useRecoilState(getShowPageHeader);
  const platformType = "mob";
  const [, setCurrentTab] = useRecoilState(getCurrentView);
  const [isLoadingAds, setIsLoadingAds] = useState(false);

  const handleClickNotifications = async () => {
    setIsLoadingAds(true);
    if (
      notificationsData.find((i) => i.title === getCount(true)[currentPage - 1])
    ) {
      try {
        const { data: responseData, errorCode } = await api(
          `subscriptions/${
            notificationsData.find(
              (i) => i.title === getCount(true)[currentPage - 1]
            ).id
          }`,
          "DELETE"
        );
        if (responseData) {
          setNotificationsData((p) =>
            p.filter(
              (i) =>
                i.id !==
                notificationsData.find(
                  (i) => i.title === getCount(true)[currentPage - 1]
                ).id
            )
          );
        } else {
          toast.error("Произошла ошибка. Попробуйте позже");
        }
      } catch (e) {
        toast.error("Произошла ошибка. Попробуйте позже");
      } finally {
        setIsLoadingAds(false);
      }
    } else {
      try {
        if (!initData.notifications) {
          try {
            const res = await bridge.send("VKWebAppAllowNotifications");
            if (res.result) {
              await api("profile", "PATCH", { notifications: true });
              setInitData((p) => ({ ...p, notifications: true }));
            } else {
              throw new Error();
            }
          } catch (e) {
            await api("profile", "PATCH", { notifications: false });
            setInitData((p) => ({ ...p, notifications: false }));
            toast.error(
              "Разрешите приложению доступ к отправке уведомлений в настройках устройства"
            );
            return true;
          }
        }

        const { data: responseData, errorCode } = await api(
          "subscriptions",
          "POST",
          {
            employer: getCount(true)[currentPage - 1],
          }
        );
        if (responseData) {
          setNotificationsData((p) =>
            p
              ? [
                  { ...responseData, title: getCount(true)[currentPage - 1] },
                  ...p,
                ]
              : [{ ...responseData, title: getCount(true)[currentPage - 1] }]
          );
        } else {
          if (errorCode === 16) {
            toast.error("Разрешите приложению доступ к уведомлениям.");
          } else if (errorCode === 2) {
            toast.error("Вы уже подписаны на эту вакансию");
          } else {
            toast.error("Произошла ошибка. Попробуйте позже");
          }
        }
      } catch (e) {
        console.error(e);
        toast.error("Произошла ошибка. Попробуйте позже");
      } finally {
        setIsLoadingAds(false);
      }
    }
    setIsLoadingAds(false);
  };

  useEffect(() => setCurrentTab("showwork"), []);

  const handleClickMark = async (mark) => {
    setStateCoords([mark.latitude, mark.longitude]);
    const mappedData = await placemarks.map((i, index) => [
      distance(mark.latitude, mark.longitude, i.latitude, i.longitude),
      index,
    ]);
    const sorted = mappedData.sort((a, b) => a[0] - b[0]);
    setNearest(sorted.slice(1, 6).map((i) => placemarks[i[1]]));
    setPlaceData(mark);
    setState(1);
    close();
    const time = setTimeout(() => {
      toModal("showWork");
      return clearTimeout(time);
    }, 700);
  };
  const handleClickVacancy = (mark) => {
    setSelectedVacancy(mark);
    tagVacancyCard();
    toPanel("showTerms");
  };

  const handleReply = async () => {
    setIsLoading(true);
    try {
      const { data: resData, message: messageRes } = await api(
        `jobs/reply/${place.id}`,
        "POST"
      );
      if (resData) {
        setState(2);
      } else {
        if (messageRes) {
          if (messageRes === "ThrottlerException")
            toast.error("Превышен лимит запросов. Пожалуйста, подождите");
          if (messageRes === "already responded")
            toast.error("Заявка уже была отправлена");
        }
      }
    } catch (e) {
      toast.error("Произошла ошибка. Пожалуйста, попробуйте позже.");
    }

    setIsLoading(false);
  };

  const handleClickSimmilar = () => {
    for (const mark of placemarks) {
    }
  };

  function getCount(param = false) {
    const titles = Array.from(new Set(nearestPoints.map((i) => i.title)));
    if (param) return titles;
    return titles.length;
  }

  useEffect(() => {
    setPageHeader(getCount(true)[currentPage - 1]);
  }, [currentPage]);

  useEffect(() => {
    bridge.send("VKWebAppSetSwipeSettings", { history: false });
  }, []);

  return (
    <>
      {place && placemarks ? (
        <>
          {state === 1 ? (
            <Group separator="hide">
              <Div className="DivFix">
                <div className="flex aic" style={{ width: "100%", gap: 10 }}>
                  {placemarks?.find(
                    (p) => p.title === getCount(true)[currentPage - 1]
                  )?.avatar && (
                    <Avatar
                      mode="app"
                      size={40}
                      src={
                        placemarks?.find(
                          (p) => p.title === getCount(true)[currentPage - 1]
                        )?.avatar
                      }
                    />
                  )}
                  <div className="flex space aic" style={{ width: "100%" }}>
                    <Title level="2" className="flex aic" style={{ gap: 5 }}>
                      {getCount(true)[currentPage - 1]}
                    </Title>
                    {getCount() !== 1 && (
                      <div
                        className="flex aic"
                        style={{ whiteSpace: "nowrap", gap: 3 }}
                      >
                        <IconButton
                          disabled={currentPage === 1}
                          onClick={() =>
                            setCurrentPage((prevState) =>
                              prevState !== 1 ? prevState - 1 : prevState
                            )
                          }
                        >
                          <Icon24ArrowRightCircleOutline
                            style={{ transform: "rotate(180deg)" }}
                          />
                        </IconButton>
                        {currentPage} / {getCount()}
                        <IconButton
                          disabled={currentPage === getCount()}
                          onClick={() =>
                            setCurrentPage((prevState) =>
                              prevState !== getCount()
                                ? prevState + 1
                                : prevState
                            )
                          }
                        >
                          <Icon24ArrowRightCircleOutline />
                        </IconButton>
                      </div>
                    )}
                  </div>
                </div>
                <Text
                  className="addressText"
                  style={{ marginBottom: 8, marginTop: 5 }}
                >
                  {selectedLanguage === "en" || selectedLanguage === "uz"
                    ? Translit.transform(place.address)
                    : place.address}
                </Text>

                <Separator wide style={{ marginTop: 8 }} />
                {notificationsData && initData && (
                  <Button
                    before={<Icon24NotificationOutline />}
                    appearance={
                      notificationsData.find(
                        (i) => i.title === getCount(true)[currentPage - 1]
                      )
                        ? "negative"
                        : "positive"
                    }
                    stretched={true}
                    loading={isLoadingAds}
                    onClick={() =>
                      isLoadingAds ? null : handleClickNotifications()
                    }
                    size={"l"}
                  >
                    {notificationsData.find(
                      (i) => i.title === getCount(true)[currentPage - 1]
                    )
                      ? t({
                          key: "cancel_sub",
                          defaultValue: "Отменить подписку",
                          language: selectedLanguage,
                        })
                      : t({
                          key: "sub_vac",
                          defaultValue: "Подписаться на вакансии",
                          language: selectedLanguage,
                        })}
                  </Button>
                )}
                <Header style={{ padding: 0 }} mode="secondary">
                  <T keyName={"obyavs"} language={selectedLanguage}>
                    Объявления
                  </T>
                  :
                </Header>
                {isDesktop ? (
                  <CardGrid
                    style={{ paddingLeft: 0, paddingRight: 0 }}
                    size="m"
                  >
                    {nearestPoints
                      .filter(
                        (point) =>
                          point.title === getCount(true)[currentPage - 1]
                      )
                      .map((point) => (
                        <Card
                          style={{ cursor: "pointer" }}
                          className="borderCard"
                          mode="outline"
                          onClick={() => handleClickVacancy(point)}
                        >
                          <SimpleCell
                            multiline
                            style={{ cursor: "pointer" }}
                            disabled={true}
                            key={point.id}
                            className="bgHoverRemove cardCell"
                            after={<Icon20ChevronRightOutline fill="gray" />}
                          >
                            <Title level="3" style={{ fontSize: 16 }}>
                              {point.description}
                            </Title>
                            <Text weight="2" style={{ lineHeight: 1.2 }}>
                              {dividePrice(point.salary)}
                            </Text>
                          </SimpleCell>
                          {point.banner && (
                            <div
                              className=""
                              style={{ width: "100%", paddingInline: 0.5 }}
                            >
                              <img
                                style={{
                                  borderBottomRightRadius: 8,
                                  borderBottomLeftRadius: 8,
                                  marginBottom: 0,
                                  cursor: "pointer",
                                }}
                                src={point.banner}
                                width="99.7%"
                              />
                            </div>
                          )}
                        </Card>
                      ))}
                  </CardGrid>
                ) : (
                  <>
                    {nearestPoints
                      .filter(
                        (point) =>
                          point.title === getCount(true)[currentPage - 1]
                      )
                      .map((point) => (
                        <Card
                          mode="outline tap mb10"
                          onClick={() => handleClickVacancy(point)}
                        >
                          <SimpleCell
                            multiline
                            key={point.id}
                            className="removeBgOnClick"
                            after={<Icon20ChevronRightOutline fill="gray" />}
                          >
                            <Title level="3">{point.description}</Title>
                            <Text weight="2" style={{ lineHeight: 1.2 }}>
                              {dividePrice(point.salary)}
                            </Text>
                          </SimpleCell>
                          {point.banner && (
                            <div
                              className=""
                              style={{ width: "100%", paddingInline: 0.5 }}
                            >
                              <img
                                style={{
                                  borderBottomRightRadius: 10,
                                  borderBottomLeftRadius: 10,
                                  marginBottom: 0,
                                  cursor: "pointer",
                                }}
                                src={point.banner}
                                width="99.7%"
                              />
                            </div>
                          )}
                        </Card>
                      ))}
                  </>
                )}
              </Div>
              <Div className="DivFix">
                <Footer style={{ fontSize: 8, lineHeight: 1 }}>
                  Продавец-кассир{" "}
                  <a
                    className="link"
                    target={"_blank"}
                    href="https://ru.freepik.com/free-vector/cashier-at-supermarket-woman-employee-in-uniform-working-at-cash-desk-assortment-of-grocery-store-food-purchases-shelves-with-drinks-beer-in-bottles-on-background_23591685.htm#page=4&query=кассир продукты&position=3&from_view=search&track=ais"
                  >
                    Изображение от studio4rt{" "}
                  </a>
                  на Freepik <br /> Уборщица{" "}
                  <a
                    className="link"
                    target={"_blank"}
                    href="https://ru.freepik.com/free-vector/cleaners-with-cleaning-products-housekeeping-service_4887688.htm#page=6&query=уборщица магазина&position=11&from_view=search&track=ais"
                  >
                    Изображение от jemastock{" "}
                  </a>
                  на Freepik
                  <br />
                  Работник торгового зала{" "}
                  <a
                    className="link"
                    target={"_blank"}
                    href="https://ru.freepik.com/free-vector/supermarket-workers-concept-illustration_8252028.htm#page=3&query=работник супермаркета&position=27&from_view=search&track=ais"
                  >
                    Изображение от storyset
                  </a>{" "}
                  на Freepik
                  <br />
                  Грузчик{" "}
                  <a
                    className="link"
                    target={"_blank"}
                    href="https://ru.freepik.com/free-vector/delivery-composition-with-doodle-characters-of-workers-in-uniform-carrying-cardboard-boxes-vector-illustration_23182624.htm#query=грузчик&position=6&from_view=search&track=sph"
                  >
                    Изображение от macrovector
                  </a>{" "}
                  на Freepik
                  <br />
                  Водитель-курьер:{" "}
                  <a
                    className="link"
                    target={"_blank"}
                    href="https://ru.freepik.com/free-vector/coronavirus-delivery-preventions-concept-illustration_7709403.htm#query=водитель курьер&position=25&from_view=search&track=ais"
                  >
                    Изображение от storyset
                  </a>{" "}
                  на Freepik
                  <br /> Менеджер по подбору персонала:{" "}
                  <a
                    className="link"
                    target={"_blank"}
                    href="https://ru.freepik.com/free-vector/selecting-team-concept-illustration_13123595.htm#query=менеджер по персоналу&position=4&from_view=search&track=ais#position=4&query=менеджер по персоналу"
                  >
                    Изображение от storyset
                  </a>{" "}
                  на Freepik
                  <br /> Продавец:{" "}
                  <a
                    className="link"
                    target={"_blank"}
                    href="https://ru.freepik.com/free-vector/cash-payment-concept-illustration_9233825.htm#query=продавец за кассой&position=0&from_view=search&track=ais"
                  >
                    Изображение от storyset
                  </a>{" "}
                  на Freepik
                  <br /> Заведующий склада:{" "}
                  <a
                    className="link"
                    target={"_blank"}
                    href="https://ru.freepik.com/free-vector/warehouse-workers-loading-stacking-goods_28157662.htm#query=руководитель склада&position=24&from_view=search&track=ais"
                  >
                    Изображение от gstudioimagen1
                  </a>{" "}
                  на Freepik
                </Footer>
              </Div>
            </Group>
          ) : (
            <>
              {state === 3 ? (
                <Group separator="hide">
                  <Div className="DivFix">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Title level="2" className="flex aic" style={{ gap: 5 }}>
                        {selectedVacancy.title}
                      </Title>
                      <Title level="2" style={{ whiteSpace: "nowrap" }}>
                        {dividePrice(selectedVacancy.salary)}
                      </Title>
                    </div>

                    <Text weight="2">{selectedVacancy.description}</Text>
                    <Text
                      className="addressText"
                      style={{ marginBottom: 5, marginTop: 2 }}
                    >
                      {selectedVacancy.address}
                    </Text>
                    {place.banner && (
                      <img
                        width={"100%"}
                        style={{
                          borderRadius: 10,
                          marginTop: 5,
                          marginBottom: 0,
                        }}
                        src={selectedVacancy.banner}
                      />
                    )}
                    <Separator wide style={{ marginBlock: 8 }} />

                    <Text weight="3" style={{ whiteSpace: "pre-wrap" }}>
                      {selectedVacancy.terms}
                    </Text>
                    <ButtonGroup mode="vertical" stretched>
                      <Button
                        size="l"
                        loading={isLoading}
                        className="greenBtn "
                        onClick={handleReply}
                        stretched
                        // stretched
                        style={{ marginTop: 15 }}
                        // after={<Icon20ChevronRightOutline />}
                      >
                        Откликнуться
                      </Button>
                      <Button
                        size="l"
                        stretched
                        appearance="neutral"
                        mode="secondary"
                        className=" mb5"
                        onClick={handleClickSimmilar}
                        style={{ marginTop: 10, marginBottom: 10 }}
                        // after={<Icon20ChevronRightOutline />}
                      >
                        Похожие вакансии
                      </Button>
                    </ButtonGroup>
                  </Div>
                </Group>
              ) : (
                <>
                  <Placeholder
                    className="customPlaceholder"
                    icon={<Icon56MessageReadOutline className="icon" />}
                    header="Ваша заявка отправлена"
                  >
                    Пожалуйста, немного подождите, пока работодатель её
                    проверит. Ответ придет в
                    {platformType !== "vk"
                      ? " мессенджер."
                      : " личные сообщения ВКонтакте."}
                  </Placeholder>
                  <Text weight="2">Ближайшие вакансии:</Text>
                  {nearestPoints.map((point) => (
                    <SimpleCell
                      key={point.id}
                      onClick={() => handleClickMark(point)}
                      className=""
                      after={<Icon20ChevronRightOutline fill="gray" />}
                    >
                      <div className="flex aie" style={{ gap: 5 }}>
                        <Title level="3">{point.title}</Title>
                        <Text weight="2" style={{ lineHeight: 1.2 }}>
                          {dividePrice(point.salary)}
                        </Text>
                      </div>
                      <Text weight="2">{point.description}</Text>
                    </SimpleCell>
                  ))}
                </>
              )}
            </>
          )}
        </>
      ) : (
        <Placeholder stretched={true}>
          <PanelSpinner />
        </Placeholder>
      )}
    </>
  );
};

export default withModalRootContext(ShowWork);
