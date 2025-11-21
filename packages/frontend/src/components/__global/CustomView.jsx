import React from "react";
import { withRouter } from "@reyzitwo/react-router-vkminiapps";
import { View } from "@vkontakte/vkui";
import useRouterHooks from "../../hooks/useRouterHooks";
import { toast } from "react-hot-toast";

const CustomView = ({ id, children, router }) => {
  const routerHooks = useRouterHooks({ router });

  const handleSwipeBackStart = React.useCallback((activePanel) => {}, []);

  const historyView = Array.from(router.arrPanelsView, (x) => {
    return x.id;
  });

  return (
    <View
      id={id}
      activePanel={router.activePanel}
      onSwipeBack={handleSwipeBackStart}
      history={historyView}
    >
      {children}
    </View>
  );
};

export default withRouter(CustomView);
