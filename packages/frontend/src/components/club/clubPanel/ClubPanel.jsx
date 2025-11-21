import "./styles.scss";
import BannerImage from "./banner.webp";
import {
  Alert,
  Button,
  Div,
  Footer,
  Group,
  PanelSpinner,
  Placeholder,
  usePlatform,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getClubData,
  getCurrentTab,
  getCurrentView,
  getInitData,
  getIsDesktop,
  getSelectedLanguage,
} from "../../../storage/selectors/main";
import { toast } from "react-hot-toast";
import api from "../../../modules/apiRequest";
import LogoImage from "./logo.png";
import StripImage from "./strip.png";
import { Icon24Gallery, Icon24WalletOutline } from "@vkontakte/icons";
import bridge from "@vkontakte/vk-bridge";
import { useTranslate } from "@tolgee/react";

export const ClubPanel = ({ toPanel, openPage, toPopout, toModal }) => {
  const { t } = useTranslate();
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const [clubData, setClubData] = useRecoilState(getClubData);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [isLoading, setIsLoading] = useState(!clubData);
  const [, setCurrentTab] = useRecoilState(getCurrentView);
  const initData = useRecoilValue(getInitData);
  const isDesktop = useRecoilValue(getIsDesktop);

  const handleClickNext = async () => {
    if (initData?.onboarding) {
      toModal("register");
    } else {
      toPanel("clubForm");
    }
  };

  useEffect(() => {
    setCurrentTab("club");
  }, []);

  const removeCard = async () => {
    const aproveRemove = async () => {
      try {
        const { data: responseData, statusCode } = await api("club", "DELETE");
        if (responseData) {
          setClubData(null);
        } else {
          throw new Error(statusCode);
        }
      } catch (e) {
        toast.error("Произошла ошибка. Пожалуйста, попробуйте позже.");
      }
    };
    toPopout(
      <Alert
        actions={[
          {
            title: "Отмена",
            autoclose: true,
            mode: "cancel",
          },
          {
            title: "Удалить",
            autoclose: true,
            mode: "destructive",
            action: () => aproveRemove(),
          },
        ]}
        actionsLayout="horizontal"
        onClose={() => toPopout(null)}
        header="Удаление карты"
        text="Вы уверены, что хотите удалить свою карту клуба? Это действие будет нельзя отменить."
      />
    );
  };

  const handleGalleryClick = async () => {
    setIsLoadingGallery(true);
    const { data: responseData } = await api("club/pkpass/image");
    if (responseData) {
      const a = document.createElement("a");
      a.href = "data:image/png;base64," + responseData;
      a.download = "Jobazavr Club.png";
      a.click();
    }
    setIsLoadingGallery(false);
  };

  useEffect(() => {
    async function get() {
      try {
        const { data: responseData, errorCode } = await api("club");
        if (responseData) {
          setClubData(responseData);
        } else {
          throw new Error(errorCode);
        }
      } catch (e) {
        if (e.message !== "1") {
          toast.error("Произошла ошибка. Попробуйте позже.");
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (!clubData) setTimeout(() => get(), 400);
  }, []);

  useEffect(() => {
    bridge.send("VKWebAppSetSwipeSettings", { history: false });
  }, []);
  return (
    <Group>
      {isDesktop && <div style={{ paddingTop: 2 }} />}
      {!isLoading ? (
        <>
          {clubData ? (
            <>
              {isDesktop && <div style={{ paddingTop: 8 }} />}
              <div className={"custom-banner-container"}>
                <div className={"custom-banner-container-id"}>
                  {clubData.id}
                </div>
                <div className={"custom-banner-container-top"}>
                  <img src={LogoImage} />
                </div>
                <div className={"custom-banner-container-middle"}>
                  <img src={StripImage} />
                </div>
                <div className={"custom-banner-container-bottom"}>
                  <div className={"custom-banner-container-bottom-item"}>
                    <div className={"custom-banner-container-bottom-item-top"}>
                      {t({
                        key: "cardholder",
                        defaultValue: "владелец карты",
                        language: selectedLanguage,
                      }).toLowerCase()}
                    </div>
                    <div
                      className={"custom-banner-container-bottom-item-bottom"}
                    >
                      {clubData?.name ??
                        t({
                          key: "hz",
                          defaultValue: "Неизвестно",
                          language: selectedLanguage,
                        })}
                    </div>
                  </div>
                  <div className={"custom-banner-container-bottom-item"}>
                    <div className={"custom-banner-container-bottom-item-top"}>
                      {t({
                        key: "expires",
                        defaultValue: "истекает",
                        language: selectedLanguage,
                      }).toLowerCase()}
                    </div>
                    <div
                      className={"custom-banner-container-bottom-item-bottom"}
                    >
                      {new Date(clubData.expires_at * 1000).toLocaleString(
                        "ru",
                        { month: "numeric", year: "numeric", day: "numeric" }
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Div className={"DivFix"}>
                <Button
                  className={"mt20"}
                  appearance={"positive"}
                  size={"l"}
                  loading={isLoadingGallery}
                  stretched={true}
                  onClick={isLoadingGallery ? null : () => handleGalleryClick()}
                  after={<Icon24Gallery />}
                >
                  {t({
                    key: "save_gallery",
                    defaultValue: "Сохранить в галерею",
                    language: selectedLanguage,
                  })}
                </Button>
              </Div>
              <Footer>
                <a
                  href={
                    "https://vk-mini-app.jobazavr.ru/static/club_privacy.pdf"
                  }
                  target={"_blank"}
                  className={"link"}
                  style={{ textDecoration: "none" }}
                >
                  {t({
                    key: "soglas",
                    defaultValue: "Согласие на сбор персональных данных",
                    language: selectedLanguage,
                  })}
                </a>{" "}
                •{" "}
                <a
                  href={
                    "https://vk-mini-app.jobazavr.ru/static/club_agreement.pdf"
                  }
                  target={"_blank"}
                  className={"link"}
                  style={{ textDecoration: "none" }}
                >
                  {t({
                    key: "oferta",
                    defaultValue: "Договор оферты",
                    language: selectedLanguage,
                  })}
                </a>{" "}
                •{" "}
                <a onClick={removeCard} className={"link"}>
                  {t({
                    key: "remove_club_card",
                    defaultValue: "Удалить карту клуба",
                    language: selectedLanguage,
                  })}
                </a>
              </Footer>
              {isDesktop && <div style={{ paddingTop: 8 }} />}
            </>
          ) : (
            <>
              <div className={"banner-container"}>
                <img src={BannerImage} />
              </div>
              <Placeholder
                className={"customPlaceholder"}
                header={t({
                  key: "club_1",
                  defaultValue: "Присоединяйся к Jobazavr Club!",
                  language: selectedLanguage,
                })}
              >
                {t({
                  key: "pressing_accepts",
                  defaultValue: "При нажатии на кнопку ниже Вы принимаете",
                  language: selectedLanguage,
                })}{" "}
                <a
                  href={
                    "https://vk-mini-app.jobazavr.ru/static/club_agreement.pdf"
                  }
                  target={"_blank"}
                  className={"link"}
                  style={{ textDecoration: "none" }}
                >
                  {t({
                    key: "oferta",
                    defaultValue: "договор оферты",
                    language: selectedLanguage,
                  }).toLowerCase()}
                </a>{" "}
                {t({
                  key: "and_giving",
                  defaultValue: "и даёте",
                  language: selectedLanguage,
                })}{" "}
                <a
                  href={
                    "https://vk-mini-app.jobazavr.ru/static/club_privacy.pdf"
                  }
                  target={"_blank"}
                  className={"link"}
                  style={{ textDecoration: "none" }}
                >
                  {t({
                    key: "personal_data",
                    defaultValue: "согласие на сбор персональных данных",
                    language: selectedLanguage,
                  }).toLowerCase()}
                </a>
              </Placeholder>
              <Div className={"DivFix"}>
                <Button
                  onClick={handleClickNext}
                  size={"l"}
                  stretched={true}
                  className={"blackBtn"}
                >
                  {t({
                    key: "join_club_action",
                    defaultValue: "Присоединиться к Jobazavr Club",
                    language: selectedLanguage,
                  })}
                </Button>
              </Div>
            </>
          )}
        </>
      ) : (
        <Placeholder stretched={true}>
          <PanelSpinner />
        </Placeholder>
      )}
    </Group>
  );
};
