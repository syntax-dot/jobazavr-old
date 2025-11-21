import React from "react";
import { ModalCard } from "@vkontakte/vkui";

const ModalCardConstructor = ({
  id,
  close,
  title = "",
  icon = "",
  children,
  className = "",
  actions,
}) => {
  return (
    <ModalCard
      className={className}
      id={id}
      onClose={() => close()}
      header={id !== "legal-aid" ? title : null}
      icon={id !== "legal-aid" ? icon : null}
      actions={actions}
    >
      {children}
    </ModalCard>
  );
};

export default ModalCardConstructor;
