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
import {
  Icon24Filter,
  Icon28ImageFilterOutline,
  Icon28ShieldKeyholeOutline,
} from "@vkontakte/icons";
import logo from "../../assets/images/main_logo.png";
import dark_logo from "../../assets/images/logo_dark.png";

const Page = ({
  children,
  openPage,
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
  const initData = useRecoilValue(getInitData);
  const theme = useRecoilValue(getTheme);
  const platformType = "mob";
  const currentTab = useRecoilValue(getCurrentView);
  const marksData = useRecoilValue(getMarksData);

  return (
    <Panel
      id={id}
      centered={centered}
      className={`${!isDesktop ? "DivFix" : undefined} ${className}`}
    >
      {!removeHeader && (
        <PanelHeader
          before={
            toBack ? (
              <PanelHeaderBack onClick={() => routerHooks.toBack()} />
            ) : initData?.is_admin === 1 &&
              !isDesktop &&
              currentTab !== "map" ? (
              <IconButton onClick={() => openPage("admin", "admin")}>
                {" "}
                <Icon28ShieldKeyholeOutline />{" "}
              </IconButton>
            ) : currentTab === "map" ? (
              <IconButton onClick={() => routerHooks.toModal("filters")}>
                <Icon24Filter width={28} height={28} />
              </IconButton>
            ) : undefined
          }
          separator={isDesktop}
        >
          {name === "Поиск надёжной работы" && !isDesktop ? (
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
