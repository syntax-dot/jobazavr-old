import { Alert } from "@vkontakte/vkui";
import api from "../../../modules/apiRequest";
import { Preferences } from "@capacitor/preferences";
import { toast } from "react-hot-toast";
import { useRecoilState } from "recoil";
import { getAuthFirst, getInitData } from "../../../storage/selectors/main";
import { useState } from "react";

export const useAccountDeletionAndExit = ({ toPopout, openPage }) => {
  const [, setAuthFirst] = useRecoilState(getAuthFirst);
  const [initData, setInitData] = useRecoilState(getInitData);

  async function handleExit() {
    window.localStorage.removeItem("pushNotificationShown");
    await Preferences.remove({ key: "access_token" });
    await Preferences.remove({ key: "refresh_token" });
    setAuthFirst(true);
    setInitData(null);
    await openPage("map", "map");
  }
  async function removeAccount() {
    const { data: responseData } = await api("profile", "DELETE");
    console.log(responseData);
    if (responseData) {
      window.localStorage.removeItem("pushNotificationShown");
      await Preferences.remove({ key: "access_token" });
      await Preferences.remove({ key: "refresh_token" });
      setAuthFirst(true);
      setInitData(null);
      toast.success("Ваш аккаунт был успешно удалён");
      await openPage("map", "map");
    } else {
      toPopout(null);
      toast.error("Произошла ошибка. Пожалуйста, попробуйте ещё раз");
    }
  }
  async function handleDeleteAccount() {
    toPopout(
      <Alert
        actions={[
          {
            title: "Отмена",
            autoclose: true,
            mode: "cancel",
          },
          {
            title: "Удалить",
            autoclose: true,
            mode: "destructive",
            action: () => removeAccount(),
          },
        ]}
        actionsLayout="horizontal"
        onClose={() => toPopout(null)}
        header="Удаление аккаунта"
        text="Вы уверены, что хотите удалить свой аккаунт? Это действие будет нельзя отменить."
      />
    );
  }
  return { handleDeleteAccount, handleExit };
};
