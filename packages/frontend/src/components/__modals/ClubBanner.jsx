import BannerImage from "./tutor_images/banner.webp";
import {
  ANDROID,
  Button,
  Div,
  Placeholder,
  usePlatform,
} from "@vkontakte/vkui";
import { useRecoilValue } from "recoil";
import { getClubData, getInitData } from "../../storage/selectors/main";
import LogoImage from "../club/clubPanel/logo.png";
import StripImage from "../club/clubPanel/strip.png";
import { Icon24WalletOutline } from "@vkontakte/icons";
import { useState } from "react";
import api from "../../modules/apiRequest";
import { toast } from "react-hot-toast";

export const ClubBanner = ({ toView, close, toModal }) => {
  const initData = useRecoilValue(getInitData);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const clubData = useRecoilValue(getClubData);
  const platform = usePlatform();

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
                  владелец карты
                </div>
                <div className={"custom-banner-container-bottom-item-bottom"}>
                  {clubData?.name ?? "Неизвестно"}
                </div>
              </div>
              <div className={"custom-banner-container-bottom-item"}>
                <div className={"custom-banner-container-bottom-item-top"}>
                  истекает
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
          {platform === ANDROID && (
            <Div className={"DivFix"}>
              <Button
                onClick={() => close()}
                className={"mt20 blackBtn"}
                size={"l"}
                stretched={true}
              >
                Закрыть
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
            Хочешь получать бесплатную юридическую помощь целый год?
            <br />
            Присоединяйся к Jobazavr Club!
            <br />
            Мы готовы поддержать тебя во всех вопросах, связанных с трудовыми
            отношениями.
            <br />
            Вступай в нашу команду и будь уверен в своих правах в спорных
            ситуациях с работодателями.
            <br />
            Наши специалисты ответят на все вопросы и помогут тебе в достижении
            правильного решения. Получи максимум выгоды и защиты вместе с нами!
            <br />
          </Placeholder>
          <Div className={"DivFix"}>
            <Button
              onClick={() => {
                if (!initData.onboarding) {
                  toView("Jclub", "Jclub");
                  close();
                } else {
                  toModal("register");
                }
              }}
              className={"blackBtn mt10"}
              size={"m"}
              stretched={true}
            >
              {!initData.onboarding ? "Присоединиться" : "Зарегистрироваться"}
            </Button>
          </Div>
        </>
      )}
    </>
  );
};
