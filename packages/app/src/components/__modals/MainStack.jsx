import React, { useEffect, useState } from "react";
import {
  ANDROID,
  Button,
  Div,
  Group,
  IOS,
  ModalPage,
  ModalPageHeader,
  ModalRoot,
  PanelHeaderButton,
  PanelHeaderClose,
  Placeholder,
  Separator,
} from "@vkontakte/vkui";
import ModalCardConstructor from "/src/components/__global/ModalCardConstructor";
import {
  Icon24Dismiss,
  Icon56Fire,
  Icon56HelpOutline,
  Icon56PhoneOutline,
  Icon56WriteOutline,
} from "@vkontakte/icons";
import LegalAidModal from "./LegalAidModal";
import ModalConstructor from "../__global/ModalConstructor";
import ShowWork from "./showWork";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getClubData,
  getModalState,
  getPlaceData,
  getSelectedLanguage,
  getTgWindowOpened,
} from "../../storage/selectors/main";
import PhoneRequest from "./tgPhoneRequest";
import { useRef } from "react";
import { RegisterModal } from "./RegisterModal";
import { PushNotification } from "./PushNotification";
import { FiltersModal } from "./filtersModal";
import Image0 from "./tutor_images/0.webp";
import Image1 from "./tutor_images/1.webp";
import Image2 from "./tutor_images/2.webp";
import Image3 from "./tutor_images/3.webp";
import Image4 from "./tutor_images/4.webp";
import "./onboardingModal/styles.scss";
import { Preferences } from "@capacitor/preferences";
import { ClubBanner } from "./ClubBanner";
import { useTranslate } from "@tolgee/react";

const MainStack = ({ modal, toBack, routerHooks }) => {
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const { t } = useTranslate();
  const clubData = useRecoilValue(getClubData);

  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    {
      img: Image0,
      text: t({
        key: "step0",
        defaultValue:
          "Находите работу рядом с домом на карте!\nНажмите на Джобазавра для просмотра деталей вакансии.",
        language: selectedLanguage,
      }),
    },
    {
      img: Image1,
      text:
        t({
          key: "step1_0",
          defaultValue:
            "Для заполнения персональных данных нажмите на кнопку «Заполнить анкету».",
          language: selectedLanguage,
        }) +
        "\n" +
        t({
          key: "step1_1",
          defaultValue:
            "Это необходимо для отправки отклика на вакансию, которая вам понравилась.",
          language: selectedLanguage,
        }),
    },
    {
      img: Image3,
      text: t({
        key: "step2",
        defaultValue:
          "Чтобы оставить отклик на вакансию нажмите на кнопку «Откликнуться».",
        language: selectedLanguage,
      }),
    },
    {
      img: Image4,
      text: t({
        key: "step3",
        defaultValue: "Добавляйте вакансии в избранное, чтобы их не потерять!",
        language: selectedLanguage,
      }),
    },
    {
      img: Image2,
      text:
        t({
          key: "step4",
          defaultValue:
            "При возникновении спорных вопросов с работодателями вы всегда можете обратиться к нам за бесплатной юридической поддержкой!",
          language: selectedLanguage,
        }) +
        "\n" +
        t({
          key: "step4_1",
          defaultValue:
            "Нажмите на раздел «Юр. помощь» и выберите удобный канал связи с нашими юристами!",
          language: selectedLanguage,
        }),
    },
  ];

  const handleContinueClick = async (skip = false) => {
    if (currentStep === 4 || skip) {
      toBack();
      await Preferences.set({ key: "first_training", value: "true" });
    } else {
      setCurrentStep((p) => p + 1);
    }
  };

  useEffect(() => {
    if (modal === "tutorial") {
      Preferences.set({ key: "first_training", value: "true" });
    }
  }, [modal]);

  return (
    <ModalRoot activeModal={modal} onClose={toBack}>
      <ModalCardConstructor
        close={() => {
          toBack();
        }}
        title={"Задайте нам ваш вопрос"}
        id={"legal-aid"}
        icon={<Icon56HelpOutline className={"icon"} />}
      >
        <LegalAidModal close={toBack} />
      </ModalCardConstructor>

      <ModalCardConstructor
        close={() => {
          toBack();
        }}
        title={"Разрешите приложению доступ к номеру телефона"}
        id={"phoneRequest"}
        icon={<Icon56PhoneOutline />}
      >
        <PhoneRequest close={toBack} />
      </ModalCardConstructor>
      <ModalCardConstructor
        id={"push"}
        close={toBack}
        title={"Заполните анкету"}
        icon={<Icon56WriteOutline />}
      >
        <PushNotification close={toBack} toPanel={routerHooks.toPanel} />
      </ModalCardConstructor>
      <ModalCardConstructor
        title={
          clubData
            ? t({
                key: "your_cert",
                defaultValue: "Ваш сертификат Jobazavr Club",
                language: selectedLanguage,
              })
            : t({
                key: "join_club",
                defaultValue: "Присоедниняйся к Jobazavr Club!",
                language: selectedLanguage,
              })
        }
        id={"clubBanner"}
        close={toBack}
      >
        <ClubBanner
          toView={routerHooks.openPage}
          close={toBack}
          toPanel={routerHooks.toPanel}
        />
      </ModalCardConstructor>
      <ModalConstructor
        dynamicContentHeight={true}
        id={"tutorial"}
        disabledMargin={true}
        close={toBack}
        title={t({
          key: "first_dating",
          defaultValue: "Первое знакомство",
          language: selectedLanguage,
        })}
      >
        <>
          <div className={"steps-image-container"}>
            <img src={steps[currentStep].img} />
          </div>
          <Placeholder className={"listPlaceholder"}>
            {steps[currentStep].text}
          </Placeholder>
          <div className={"dots"}>
            {new Array(5).fill(1).map((i, idx) => (
              <div
                className={"dot" + (idx === currentStep ? " active" : "")}
              ></div>
            ))}
          </div>
          <Div className={"DivFix"}>
            <Button
              onClick={() => handleContinueClick()}
              className={"mt10"}
              stretched={true}
              size={"m"}
            >
              {currentStep === 4
                ? t({
                    key: "continue",
                    defaultValue: "Продолжить",
                    language: selectedLanguage,
                  })
                : t({
                    key: "next",
                    defaultValue: "Далее",
                    language: selectedLanguage,
                  })}
            </Button>
            <Button
              mode={"tertiary"}
              className={"mt10"}
              stretched={true}
              size={"s"}
              onClick={handleContinueClick}
            >
              {t({
                key: "skip",
                defaultValue: "Пропустить",
                language: selectedLanguage,
              })}
            </Button>
          </Div>
        </>
      </ModalConstructor>
      <ModalConstructor
        id={"filters"}
        close={toBack}
        title={t({
          key: "vacs_filter",
          defaultValue: "Фильтр вакансий",
          language: selectedLanguage,
        })}
        icon={<Icon56WriteOutline />}
      >
        <FiltersModal
          routerHooks={routerHooks}
          close={toBack}
          toPanel={routerHooks.toPanel}
        />
      </ModalConstructor>
    </ModalRoot>
  );
};

export default MainStack;
