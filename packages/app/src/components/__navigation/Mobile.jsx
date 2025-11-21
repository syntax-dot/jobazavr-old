import React, { useEffect, useState } from "react";
import { Button, Tabbar, TabbarItem } from "@vkontakte/vkui";
import navigationItems from "/src/components/__navigation/items";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getDropdownOpened,
  getInitData,
  getSelectedLanguage,
  getTabbarHidden,
} from "../../storage/selectors/main";
import { tagHelpButton } from "../../modules/tagManager";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslate } from "@tolgee/react";

const MobileNavigation = ({ activeView, openPage, toModal }) => {
  const { t } = useTranslate();
  const initData = useRecoilValue(getInitData);
  console.log('[initData]', initData);
  localStorage.setItem('initData', initData)
  const tabbarHidden = useRecoilValue(getTabbarHidden);
  const [openDdown, setOpenDdown] = useRecoilState(getDropdownOpened);
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  useEffect(() => {
    function hide() {
      setOpenDdown(false);
      window.removeEventListener("click", hide, false);
    }
    if (openDdown) {
      window.addEventListener("click", hide, false);
    }
  }, [openDdown]);
  return (
    <>
      <AnimatePresence exitBeforeEnter={true}>
        {openDdown && (
          <motion.div
            exit={{ scale: 0, x: 60, y: 70, opacity: 0 }}
            key={"framer-motion-ddown-menu"}
            animate={{
              height: openDdown ? "fit-content" : 0,
            }}
            initial={{ height: 0 }}
            className={"dropdownMenu" + (!openDdown ? " closed" : "")}
          >
            <motion.div
              whileTap={{ scale: 1.1 }}
              className={"dropdownMenu-tg"}
              onClick={() => window.open("https://t.me/jobazavr_lawyer")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="48px"
                height="48px"
              >
                <path
                  fill="#29b6f6"
                  d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"
                />
                <path
                  fill="#fff"
                  d="M33.95,15l-3.746,19.126c0,0-0.161,0.874-1.245,0.874c-0.576,0-0.873-0.274-0.873-0.274l-8.114-6.733 l-3.97-2.001l-5.095-1.355c0,0-0.907-0.262-0.907-1.012c0-0.625,0.933-0.923,0.933-0.923l21.316-8.468 c-0.001-0.001,0.651-0.235,1.126-0.234C33.667,14,34,14.125,34,14.5C34,14.75,33.95,15,33.95,15z"
                />
                <path
                  fill="#b0bec5"
                  d="M23,30.505l-3.426,3.374c0,0-0.149,0.115-0.348,0.12c-0.069,0.002-0.143-0.009-0.219-0.043 l0.964-5.965L23,30.505z"
                />
                <path
                  fill="#cfd8dc"
                  d="M29.897,18.196c-0.169-0.22-0.481-0.26-0.701-0.093L16,26c0,0,2.106,5.892,2.427,6.912 c0.322,1.021,0.58,1.045,0.58,1.045l0.964-5.965l9.832-9.096C30.023,18.729,30.064,18.416,29.897,18.196z"
                />
              </svg>
            </motion.div>
            <motion.div
              onClick={() => window.open("https://vk.me/jobazavr")}
              whileTap={{ scale: 1.1 }}
              className={"dropdownMenu-vk"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="48px"
                height="48px"
              >
                <path
                  fill="#1976d2"
                  d="M24,4C13,4,4,13,4,24s9,20,20,20s20-9,20-20S35,4,24,4z"
                />
                <path
                  fill="#fff"
                  d="M25.2,33.2c-9,0-14.1-6.1-14.3-16.4h4.5c0.1,7.5,3.5,10.7,6.1,11.3V16.8h4.2v6.5c2.6-0.3,5.3-3.2,6.2-6.5h4.2	c-0.7,4-3.7,7-5.8,8.2c2.1,1,5.5,3.6,6.7,8.2h-4.7c-1-3.1-3.5-5.5-6.8-5.9v5.9H25.2z"
                />
              </svg>
            </motion.div>
            <Button onClick={() => toModal("legal-aid")} className={"vkBtn"}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {t({
                  defaultValue: "Написать в приложении",
                  key: "write_in_app",
                  language: selectedLanguage,
                })}
              </div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      {!tabbarHidden && (
        <Tabbar>
          {navigationItems
            .filter((i) => (initData?.onboarding ? i.id !== "profile" : true))
            .filter((i) => (initData?.is_admin !== 1 ? i.id !== "admin" : i))
            .filter((i) => (initData ? true : i.id !== "Jclub"))
            .map((el, key) =>
              el.id === "help" ? (
                <TabbarItem
                  onClick={() => {
                    tagHelpButton();
                    setOpenDdown((e) => !e);
                  }}
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
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
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
      )}
    </>
  );
};

export default MobileNavigation;
