import "./styles.scss";
import BannerImage from "./banner.webp";
import {
  Alert,
  Button,
  Div,
  Footer,
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
  getSelectedLanguage,
} from "../../../storage/selectors/main";
import { toast } from "react-hot-toast";
import api from "../../../modules/apiRequest";
import LogoImage from "./logo.png";
import StripImage from "./strip.png";
import { Icon24Gallery, Icon24WalletOutline } from "@vkontakte/icons";
import { CapacitorPassToWallet } from "capacitor-pass-to-wallet";
import { Media } from "@capacitor-community/media";
import { useTranslate } from "@tolgee/react";

export const ClubPanel = ({ toPanel, openPage, toPopout }) => {
  const { t } = useTranslate();
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const [clubData, setClubData] = useRecoilState(getClubData);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [isLoading, setIsLoading] = useState(!clubData);
  const platform = usePlatform();
  const [, setCurrentTab] = useRecoilState(getCurrentTab);
  const [attempted, setAttempted] = useState(false);
  const [, setCurrentView] = useRecoilState(getCurrentView);

  useEffect(() => {
    setCurrentTab("club");
    setCurrentView("club");
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

  const handleWalletClick = async () => {
    setIsLoadingWallet(true);
    try {
      const { data: base64Data, statusCode } = await api("club/pkpass");
      if (base64Data) {
        try {
          const res = await CapacitorPassToWallet.addToWallet({
            base64: base64Data,
          });
          console.log(res);
        } catch (e) {
          console.log(e);
          toast.error("Сертификат уже добавлен в wallet");
        }
      } else {
        throw new Error(statusCode);
      }
    } catch (e) {
      toast.error("Произошла ошибка. Пожалуйста, попробуйте позже.");
    } finally {
      setIsLoadingWallet(false);
    }
  };

  const handleGalleryClick = async () => {
    setIsLoadingGallery(true);
    const { data: responseData } = await api("club/pkpass/image");
    if (responseData) {
      try {
        const { albums } = await Media.getAlbums();
        console.log("ALBUMS", albums);
        let identifier;
        const demoAlbum = albums.find((a) => a.name === "Jobazavr Club");
        console.log("demoAlbum", demoAlbum);
        if (!demoAlbum) {
          await Media.createAlbum({ name: `Jobazavr Club` });
          const newDemoAlbum = albums.find((a) => a.name === "Jobazavr Club");
          console.log("newDemoAlbum", newDemoAlbum);
          identifier = newDemoAlbum.identifier;
        } else {
          identifier = demoAlbum.identifier;
        }

        await Media.savePhoto({
          path: `data:image/png;base64,${responseData}`,
          albumIdentifier: identifier,
        });
        toast.success("Фотография загружена в галерею.");
        setIsLoadingGallery(false);
      } catch (e) {
        if (attempted) {
          setIsLoadingGallery(false);
          toast.error(
            "Разрешите приложению доступ к Фото в настройках для продолжения"
          );
        } else {
          setAttempted(true);
          setTimeout(async () => {
            try {
              const { albums } = await Media.getAlbums();
              console.log("ALBUMS", albums);
              let identifier;
              const demoAlbum = albums.find((a) => a.name === "Jobazavr Club");
              console.log("demoAlbum", demoAlbum);
              if (!demoAlbum) {
                await Media.createAlbum({ name: `Jobazavr Club` });
                const newDemoAlbum = albums.find(
                  (a) => a.name === "Jobazavr Club"
                );
                console.log("newDemoAlbum", newDemoAlbum);
                identifier = newDemoAlbum.identifier;
              } else {
                identifier = demoAlbum.identifier;
              }

              await Media.savePhoto({
                path: `data:image/png;base64,${responseData}`,
                albumIdentifier: identifier,
              });
              toast.success("Фотография загружена в галерею.");
              setIsLoadingGallery(false);
            } catch (e) {
              setIsLoadingGallery(false);
              toast.error(
                "Разрешите приложению доступ к Фото в настройках для продолжения"
              );
            }
          }, 2000);
        }
      }
    }
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
  return (
    <>
      {!isLoading ? (
        <>
          {clubData ? (
            <>
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
                {platform === "ios" && (
                  <Button
                    className={"mt10 blackBtn"}
                    size={"l"}
                    loading={isLoadingWallet}
                    stretched={true}
                    onClick={isLoadingWallet ? null : () => handleWalletClick()}
                    after={<Icon24WalletOutline />}
                  >
                    {t({
                      key: "add_to_wallet",
                      defaultValue: "Добавить в Wallet",
                      language: selectedLanguage,
                    })}
                  </Button>
                )}
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
                <a onClick={removeCard} className={"link"}>
                  {t({
                    key: "remove_club_card",
                    defaultValue: "Удалить карту клуба",
                    language: selectedLanguage,
                  })}
                </a>
              </Footer>
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
                  key: "pressing_accepts_mob",
                  defaultValue: "При нажатии на кнопку ниже Вы даёте",
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
                  onClick={() => toPanel("clubForm")}
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
    </>
  );
};
