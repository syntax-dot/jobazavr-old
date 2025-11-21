import BannerImage from "./tutor_images/banner.webp";
import {
  ANDROID,
  Button,
  Div,
  Placeholder,
  usePlatform,
} from "@vkontakte/vkui";
import { useRecoilValue } from "recoil";
import {
  getClubData,
  getInitData,
  getSelectedLanguage,
} from "../../storage/selectors/main";
import LogoImage from "../club/clubPanel/logo.png";
import StripImage from "../club/clubPanel/strip.png";
import { Icon24WalletOutline } from "@vkontakte/icons";
import { useState } from "react";
import api from "../../modules/apiRequest";
import { CapacitorPassToWallet } from "capacitor-pass-to-wallet";
import { toast } from "react-hot-toast";
import { useTranslate } from "@tolgee/react";

export const ClubBanner = ({ toView, close }) => {
  const { t } = useTranslate();
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const initData = useRecoilValue(getInitData);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const clubData = useRecoilValue(getClubData);
  const platform = usePlatform();

  const handleWalletClick = async () => {
    setIsLoadingWallet(true);
    try {
      const { data: base64Data, statusCode } = await api("club/pkpass");
      if (base64Data) {
        try {
          await CapacitorPassToWallet.addToWallet({
            base64: base64Data,
          });
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

  return (
    <>
      {clubData ? (
        <>
          <div className={"custom-banner-container mt10"}>
            <div className={"custom-banner-container-id"}>{clubData.id}</div>
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
                <div className={"custom-banner-container-bottom-item-bottom"}>
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
                <div className={"custom-banner-container-bottom-item-bottom"}>
                  {new Date(clubData.expires_at * 1000).toLocaleString("ru", {
                    month: "numeric",
                    year: "numeric",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
          {platform === "ios" && (
            <Div className={"DivFix"}>
              <Button
                className={"mt20 blackBtn"}
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
                }).toLowerCase()}
              </Button>
            </Div>
          )}
          {platform === ANDROID && (
            <Div className={"DivFix"}>
              <Button
                onClick={() => close()}
                className={"mt20 blackBtn"}
                size={"l"}
                stretched={true}
              >
                {t({
                  key: "close",
                  defaultValue: "Закрыть",
                  language: selectedLanguage,
                }).toLowerCase()}
              </Button>
            </Div>
          )}
        </>
      ) : (
        <>
          <div
            style={{
              width: "90%",
              display: "block",
              marginInline: "auto",
              borderRadius: 12,
              overflow: "hidden",
              marginTop: 10,
            }}
            className={"club-banner-container"}
          >
            <img width={"100%"} src={BannerImage} />
          </div>
          <Placeholder className={"clearPlaceholder mt10"}>
            {t({
              key: "club_0",
              defaultValue:
                "Хочешь получать бесплатную юридическую помощь целый год?",
              language: selectedLanguage,
            })}
            <br />
            {t({
              key: "club_1",
              defaultValue: "Присоединяйся к Jobazavr Club!",
              language: selectedLanguage,
            })}
            <br />
            {t({
              key: "club_2",
              defaultValue:
                "Мы готовы поддержать тебя во всех вопросах, связанных с трудовыми\n" +
                "отношениями.",
              language: selectedLanguage,
            })}
            <br />
            {t({
              key: "club_3",
              defaultValue:
                "Вступай в нашу команду и будь уверен в своих правах в спорных\n" +
                "ситуациях с работодателями.",
              language: selectedLanguage,
            })}
            <br />
            {t({
              key: "club_4",
              defaultValue:
                "Наши специалисты ответят на все вопросы и помогут тебе в достижении\n" +
                "правильного решения. Получи максимум выгоды и защиты вместе с нами!",
              language: selectedLanguage,
            })}
            <br />
          </Placeholder>
          <Div className={"DivFix"}>
            <Button
              onClick={() => {
                if (initData) {
                  toView("Jclub", "Jclub");
                } else {
                  toView("profile", "profile");
                }
                close();
              }}
              className={"blackBtn mt10"}
              size={"m"}
              stretched={true}
            >
              {initData
                ? t({
                    key: "join",
                    defaultValue: "Присоединиться",
                    language: selectedLanguage,
                  })
                : t({
                    key: "register_action",
                    defaultValue: "Зарегистрироваться",
                    language: selectedLanguage,
                  })}
            </Button>
          </Div>
        </>
      )}
    </>
  );
};
