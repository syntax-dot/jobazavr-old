import "./styles.scss";
import { Button, Placeholder } from "@vkontakte/vkui";
import logoImage from "../../../assets/images/logo.png";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getCurrentTab,
  getInitData,
  getTabbarHidden,
} from "../../../storage/selectors/main";

export const Authorization = ({ toPanel, openPage }) => {
  const [, setTabbarHidden] = useRecoilState(getTabbarHidden);
  const initData = useRecoilValue(getInitData);
  const [, setCurrentTab] = useRecoilState(getCurrentTab);

  useEffect(() => setCurrentTab("onboard"), []);
  useEffect(() => {}, []);
  if (initData || true) {
    openPage("map", "map");
    setTabbarHidden(false);
  }
  return (
    <>
      <>
        <Placeholder
          stretched
          className=""
          header="Добро пожаловать!"
          icon={<img src={logoImage} width="160px" />}
        >
          Работаем только с проверенными работодателями.
          <br />
          Трудоустраивайтесь через нас, а мы позаботимся о Ваших трудовых
          отношениях!
          <Button
            style={{ marginTop: 15 }}
            size="l"
            stretched
            onClick={() => toPanel("phoneForm")}
          >
            Продолжить
          </Button>
        </Placeholder>
      </>
    </>
  );
};
