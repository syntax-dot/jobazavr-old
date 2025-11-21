import React, { Suspense } from "react";
import {
  Group,
  IconButton,
  Panel,
  PanelHeader,
  PanelHeaderBack,
} from "@vkontakte/vkui";
import {
  getCurrentTab,
  getCurrentView,
  getIsDesktop,
  getMarksData,
} from "/src/storage/selectors/main";
import { useRecoilValue } from "recoil";
import { getInitData, getTheme } from "../../storage/selectors/main";
import { Icon24Filter } from "@vkontakte/icons";
import logo from "../../assets/images/main_logo.png";
import dark_logo from "../../assets/images/logo_dark.png";

const Page = ({
  children,
  id,
  className = "",
  centered = false,
  toBack = false,
  disableSpace = false,
  removeHeader = false,
  name = "",
  routerHooks,
}) => {
  const isDesktop = useRecoilValue(getIsDesktop);
  const theme = useRecoilValue(getTheme);
  const platformType = "mob";
  const currentTab = useRecoilValue(getCurrentView);
  const marksData = useRecoilValue(getMarksData);

  return (
    <Panel
      id={id}
      centered={centered}
      // style={{ marginTop: 28 }}
      className={`${!isDesktop ? "DivFix" : undefined} ${className}`}
    >
      {!removeHeader && (
        <>
          <PanelHeader
            before={
              toBack ? (
                <PanelHeaderBack
                  onClick={() =>
                    id !== "register"
                      ? id === "showTerms"
                        ? routerHooks.toPanel("showWork")
                        : id === "showWork"
                        ? (function () {
                            routerHooks.toPanel(currentTab);
                          })()
                        : toBack()
                      : currentTab === "profile"
                      ? routerHooks.toPanel("profile")
                      : routerHooks.toPanel("showTerms")
                  }
                />
              ) : currentTab === "map" && marksData ? (
                <IconButton onClick={() => routerHooks.toModal("filters")}>
                  <Icon24Filter width={28} height={28} />
                </IconButton>
              ) : undefined
            }
            separator={isDesktop}
            className={"realPanelHeader"}
          >
            {id === "map" && !isDesktop ? (
              <img
                src={
                  platformType !== "tg"
                    ? theme === "light"
                      ? logo
                      : dark_logo
                    : window?.Telegram?.WebApp?.colorScheme === "dark"
                    ? dark_logo
                    : logo
                }
                style={{ marginTop: 8 }}
                width="140px"
              />
            ) : (
              name
            )}
          </PanelHeader>
          <div className={"panel-header-sapcing"}></div>
        </>
      )}

      <Group
        mode="plain"
        id={`Group${id}`}
        className={disableSpace ? "" : isDesktop ? "p5" : ""}
        style={{ paddingTop: 0 }}
      >
        <Suspense fallback={""}>{children}</Suspense>
      </Group>
    </Panel>
  );
};

export default Page;
