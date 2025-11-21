import { motion } from "framer-motion";
import { Button, Card, Div, FixedLayout, IconButton } from "@vkontakte/vkui";
import { Icon24LocationOutline, Icon24LogoVk } from "@vkontakte/icons";
import React from "react";
import { useRecoilValue } from "recoil";
import { getDropdownOpened } from "../../storage/selectors/main";
import { useTranslate } from "@tolgee/react";

export const BottomContainer = ({ handleLocationClick, selectedLanguage }) => {
  const { t } = useTranslate();
  const isDropDownActive = useRecoilValue(getDropdownOpened);
  return (
    <FixedLayout vertical={"bottom"}>
      {!isDropDownActive && (
        <div>
          <Div className="">
            <Card
              onClick={handleLocationClick}
              mode="outline"
              className="geoBtn"
            >
              <IconButton>
                <Icon24LocationOutline />
              </IconButton>
            </Card>
            <Button
              className={"vkBtn"}
              href={"https://vk.com/jobazavr"}
              target={"_blank"}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {t({
                  defaultValue: "Вступить в группу",
                  key: "join_group",
                  language: selectedLanguage,
                })}
                <Icon24LogoVk />
              </div>
            </Button>
          </Div>
        </div>
      )}
    </FixedLayout>
  );
};
