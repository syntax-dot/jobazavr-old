import {
  Icon20ChevronRightOutline,
  Icon24ArrowRightCircleOutline,
  Icon24NotificationOutline,
} from "@vkontakte/icons";
import {
  Avatar,
  Button,
  Card,
  CardGrid,
  Div,
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
import { useRecoilState, useRecoilValue } from "recoil";
import dividePrice from "../../modules/dividePrice";
import {
  getCurrentTab,
  getInitData,
  getIsDesktop,
  getMarksData,
  getNearestData,
  getNotificationsData,
  getPlaceData,
  getSelectedLanguage,
  getSelectedVacancy,
  getShowPageHeader,
} from "../../storage/selectors/main";
import { tagVacancyCard } from "../../modules/tagManager";
import { T, useTranslate } from "@tolgee/react";
import CyrillicToTranslit from "cyrillic-to-translit-js";
import api from "../../modules/apiRequest";
import { toast } from "react-hot-toast";
import enableNotifications from "../../modules/enableNotifications";
import { initNotifications } from "../../modules/notifications";
import { Preferences } from "@capacitor/preferences";

const ShowWork = ({ close, toModal, toPanel }) => {
  const { t } = useTranslate();
  const Translit = new CyrillicToTranslit({ preset: "ru" });
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const isDesktop = useRecoilValue(getIsDesktop);
  const place = useRecoilValue(getPlaceData);
  const placemarks = useRecoilValue(getMarksData);
  const nearestPoints = useRecoilValue(getNearestData);
  const [, setSelectedVacancy] = useRecoilState(getSelectedVacancy);
  const [currentPage, setCurrentPage] = useState(1);
  const [, setPageHeader] = useRecoilState(getShowPageHeader);
  const [, setCurrentTab] = useRecoilState(getCurrentTab);
  const [notificationsData, setNotificationsData] =
    useRecoilState(getNotificationsData);
  const [isLoadingAds, setIsLoadingAds] = useState(false);
  const initData = useRecoilValue(getInitData);

  useEffect(() => setCurrentTab("showwork"), []);

  const handleClickVacancy = (mark) => {
    setSelectedVacancy(mark);
    tagVacancyCard();
    toPanel("showTerms");
  };

  function getCount(param = false) {
    const titles = Array.from(new Set(nearestPoints.map((i) => i.title)));
    if (param) return titles;
    return titles.length;
  }

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
        try {
          const newPr = new Promise((res) => setTimeout(() => res(true), 5000));
          const { value } = await Preferences.get({ key: "notes" });
          const result = await initNotifications();
          if (!value) await newPr;
          if (!result) throw new Error("");
        } catch (e) {
          toast.error(
            "Разрешите приложению доступ к отправке уведомлений в настройках устройства"
          );
          return true;
        }

        const { data: responseData, errorCode } = await api(
          "subscriptions",
          "POST",
          {
            employer: getCount(true)[currentPage - 1],
          }
        );

        if (responseData) {
          await Preferences.set({ key: "notes", value: "true" });
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
            await enableNotifications();
          } else if (errorCode === 2) {
            toast.error("Вы уже подписаны на эту вакансию");
          } else {
            console.log(errorCode);
            toast.error("Произошла ошибка. Попробуйте позже");
          }
        }
      } catch (e) {
        console.log(e);
        toast.error("Произошла ошибка. Попробуйте позже");
      } finally {
        setIsLoadingAds(false);
      }
    }
    setIsLoadingAds(false);
  };

  useEffect(() => {
    setPageHeader(getCount(true)[currentPage - 1]);
  }, [currentPage]);
  return (
    <>
      {place && placemarks ? (
        <>
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
                            prevState !== getCount() ? prevState + 1 : prevState
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
                <CardGrid style={{ paddingLeft: 0, paddingRight: 0 }} size="m">
                  {nearestPoints
                    .filter(
                      (point) => point.title === getCount(true)[currentPage - 1]
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
                                marginBottom: -3,
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
                      (point) => point.title === getCount(true)[currentPage - 1]
                    )
                    .map((point) => (
                      <Card
                        mode="outline tap mb10"
                        onClick={() => handleClickVacancy(point)}
                      >
                        <SimpleCell
                          multiline
                          key={point.id}
                          className={"simpleCellWork"}
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
                                marginBottom: -3,
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
