import React, { useEffect } from "react";
import {
  Button,
  Div,
  Group,
  PanelSpinner,
  Placeholder,
  Title,
} from "@vkontakte/vkui";
import { Icon56GestureOutline } from "@vkontakte/icons";
import logoImage from "../../assets/images/logo.png";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getFavouriteJobs,
  getInitData,
  getIsDesktop,
  getReadyToUse,
} from "../../storage/selectors/main";
import api from "../../modules/apiRequest";
import { useState } from "react";
import Register from "./register";

const Home = ({ toModal, toPanel, openPage }) => {
  console.log("home");
  const [initData, setInitData] = useRecoilState(getInitData);
  const [mounted, setMounted] = useState(false);
  const [readyToUse, setReadyToUse] = useRecoilState(getReadyToUse);

  const isDesktop = useRecoilValue(getIsDesktop);
  async function get() {
    return initData?.onboarding;
  }

  useEffect(async () => {
    const onBoarding = await get();

    onBoarding === false ? openPage("map", "map") : null;
    if (initData?.onboarding) {
      if (
        initData.phone ||
        initData.city ||
        initData.age ||
        initData.sex ||
        initData.citizenship
      )
        setReadyToUse(true);
    }

    setMounted(true);
  }, [initData]);
  return (
    <>
      {initData &&
        initData?.onboarding === true &&
        !(
          initData?.phone ||
          initData?.city ||
          initData?.age ||
          initData?.sex ||
          initData?.citizenship
        ) &&
        !readyToUse && (
          <>
            <Group className="removeTopGroup">
              {isDesktop ? (
                <>
                  <Placeholder
                    className=""
                    header="Добро пожаловать!"
                    icon={<img src={logoImage} width="160px" />}
                  >
                    Работаем только с проверенными работодателями.
                    <br />
                    Трудоустраивайтесь через нас, а мы позаботимся о Ваших
                    трудовых отношениях!
                  </Placeholder>
                  <Div className="DivFix">
                    <Button
                      size="l"
                      stretched
                      onClick={() => toPanel("register")}
                    >
                      Регистрация
                    </Button>
                  </Div>
                </>
              ) : (
                <>
                  <Placeholder
                    stretched
                    className=""
                    header="Добро пожаловать!"
                    icon={<img src={logoImage} width="160px" />}
                  >
                    Работаем только с проверенными работодателями.
                    <br />
                    Трудоустраивайтесь через нас, а мы позаботимся о Ваших
                    трудовых отношениях!
                    <Button
                      style={{ marginTop: 15 }}
                      size="l"
                      stretched
                      onClick={() => toPanel("register")}
                    >
                      Регистрация
                    </Button>
                  </Placeholder>
                </>
              )}
            </Group>
          </>
        )}
      {initData && readyToUse && (
        <>
          <Register openPage={openPage} toModal={toModal} />
        </>
      )}
    </>
  );
};

export default Home;
