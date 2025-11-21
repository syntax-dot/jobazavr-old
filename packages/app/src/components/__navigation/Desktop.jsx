import React from "react";
import { Panel, PanelHeader, SimpleCell, SplitCol } from "@vkontakte/vkui";
import navigationItems from "/src/components/__navigation/items";
import { useRecoilValue } from "recoil";
import { getInitData, getOnboarding } from "../../storage/selectors/main";
import mainLogo from "../../assets/images/main_logo.png";
import wind from "@vkontakte/icons/ts/16/wind";
import { tagHelpButton } from "../../modules/tagManager";

const DesktopNavigation = ({ activeView, openPage }) => {
  const onBoarding = useRecoilValue(getOnboarding);
  const initData = useRecoilValue(getInitData);
  const platformType = "mob";
  return (
    <SplitCol fixed width="240px" maxWidth="240px">
      <Panel nav="navigationDesktop">
        <PanelHeader className="desktopLogo"></PanelHeader>
        {initData && (
          <>
            {navigationItems
              .filter((i) => (initData?.onboarding ? i.id !== "profile" : true))
              .filter((i) => (initData.is_admin !== 1 ? i.id !== "admin" : i))
              .map((el, key) =>
                el.id === "help" ? (
                  <SimpleCell
                    onClick={() => tagHelpButton()}
                    href={
                      platformType !== "tg"
                        ? "https://vk.me/jobazavr"
                        : "https://t.me/jobazavr_lawyer"
                    }
                    target="_blank"
                    key={key}
                    className={`mb5 ${
                      activeView === el.id ? "navigation__item-selected" : ""
                    }`}
                    disabled={activeView === el.id}
                    before={el.icon}
                    multiline
                    description={el.description}
                  >
                    {el.title}
                  </SimpleCell>
                ) : (
                  <SimpleCell
                    key={key}
                    className={`mb5 ${
                      activeView === el.id ? "navigation__item-selected" : ""
                    }`}
                    onClick={() => {
                      openPage(el.id, el.id);
                      el.clickEvent ? el.clickEvent() : null;
                    }}
                    disabled={activeView === el.id}
                    before={el.icon}
                    multiline
                    description={el.description}
                  >
                    {el.title}
                  </SimpleCell>
                )
              )}
          </>
        )}
      </Panel>
    </SplitCol>
  );
};

export default DesktopNavigation;
