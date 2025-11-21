import React from "react";
import { Tabbar, TabbarItem } from "@vkontakte/vkui";
import navigationItems from "/src/components/__navigation/items";
import { useRecoilValue } from "recoil";
import { getInitData, getSelectedLanguage } from "../../storage/selectors/main";
import { tagHelpButton } from "../../modules/tagManager";
import { useTranslate } from "@tolgee/react";

const MobileNavigation = ({ activeView, openPage }) => {
  const { t } = useTranslate();
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const initData = useRecoilValue(getInitData);
  const platformType = localStorage.getItem("platformType");
  return (
    <>
      <Tabbar>
        {navigationItems
          .filter((i) => (initData?.onboarding ? i.id !== "profile" : true))
          .filter((i) => (initData.is_admin !== 1 ? i.id !== "admin" : i))
          .map((el, key) =>
            el.id === "help" ? (
              <TabbarItem
                onClick={() => tagHelpButton()}
                href={
                  platformType !== "tg"
                    ? "https://vk.me/jobazavr"
                    : "https://t.me/jobazavr_lawyer"
                }
                target="_blank"
                key={key}
                selected={activeView === el.id}
                text={t({
                  defaultValue: el.title,
                  key: el.id + "_nav",
                  language: selectedLanguage,
                })}
              >
                {el.icon}
              </TabbarItem>
            ) : (
              <TabbarItem
                onClick={() => {
                  openPage(el.id, el.id);
                  el.clickEvent ? el.clickEvent() : null;
                }}
                key={key}
                selected={activeView === el.id}
                text={t({
                  defaultValue: el.title,
                  key: el.id + "_nav",
                  language: selectedLanguage,
                })}
              >
                {el.icon}
              </TabbarItem>
            )
          )}
      </Tabbar>
    </>
  );
};

export default MobileNavigation;
