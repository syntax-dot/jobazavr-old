import React, { useEffect } from "react";
import {
  ANDROID,
  Group,
  IOS,
  ModalCard,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  PanelHeaderClose,
  Separator,
  withModalRootContext,
} from "@vkontakte/vkui";
import { Icon24Dismiss } from "@vkontakte/icons";
import { getIsDesktop, getPlatform } from "/src/storage/selectors/main";
import { useRecoilState, useRecoilValue } from "recoil";
import { getModalState } from "../../storage/selectors/main";

const ModalConstructor = ({
  disabledMargin = false,
  id,
  close,
  title = "",
  children,
  className = "",
  dynamicContentHeight = false,
  settlingHeight = 100,
}) => {
  const isDesktop = useRecoilValue(getIsDesktop);
  const platform = useRecoilValue(getPlatform);
  const [modalState, setModalState] = useRecoilState(getModalState);

  return (
    <ModalPage
      className={className}
      dynamicContentHeight={true}
      // settlingHeight={100}
      nav={id}
      id={id}
      onClose={close}
      onClosed={() => setModalState(1)}
      header={
        id !== "tutorial" && (
          <ModalPageHeader
            separator={true}
            after={
              !isDesktop &&
              platform === IOS && (
                <PanelHeaderButton
                  aria-label={"Закрытие модального окна"}
                  onClick={close}
                >
                  <Icon24Dismiss />
                </PanelHeaderButton>
              )
            }
            before={
              !isDesktop &&
              platform === ANDROID && <PanelHeaderClose onClick={close} />
            }
          >
            {title}
          </ModalPageHeader>
        )
      }
    >
      {id !== "tutorial" && <Separator wide />}
      <Group>
        <div className={disabledMargin ? "" : "panelPadding"}>{children}</div>
      </Group>
    </ModalPage>
  );
};

export default ModalConstructor;
