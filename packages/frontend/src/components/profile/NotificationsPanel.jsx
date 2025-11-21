import {
  Alert,
  Card,
  Div,
  Footer,
  Group,
  PanelSpinner,
  Placeholder,
  Separator,
  SimpleCell,
  Spacing,
} from "@vkontakte/vkui";
import {
  Icon56NotificationOutline,
  Icon56UserCircleOutline,
} from "@vkontakte/icons";
import { T } from "@tolgee/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  getNotificationsData,
  getSelectedLanguage,
} from "../../storage/selectors/main";
import api from "../../modules/apiRequest";

export const NotificationsPanel = ({ toPopout }) => {
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const [notificationsData, setNotificationsData] =
    useRecoilState(getNotificationsData);
  const [isLoading, setIsLoading] = useState(false);

  async function get() {
    setIsLoading(true);
    const { data: responseData } = await api("subscriptions");
    if (responseData) setNotificationsData(responseData);
    setIsLoading(false);
  }

  useEffect(() => {
    if (!notificationsData) get();
  }, []);

  const handleVacClick = async (item) => {
    async function removeSubscription() {
      const { data: responseData } = await api(
        `subscriptions/${item.id}`,
        "DELETE"
      );
      if (responseData) {
        setNotificationsData((p) => p.filter((i) => i.id !== item.id));
      } else {
        toast.error("Произошла ошибка. Попробуйте позже");
      }
    }
    toPopout(
      <Alert
        actions={[
          {
            title: "Отписаться",
            mode: "destructive",
            autoclose: true,
            action: () => removeSubscription(),
          },
          {
            title: "Отмена",
            autoclose: true,
            mode: "cancel",
          },
        ]}
        actionsLayout="vertical"
        onClose={() => toPopout(null)}
        header="Подтвердите действие"
        text="Вы уверены, что хотите отменить подписку на вакансию?"
      />
    );
  };
  return (
    <Group>
      <Placeholder
        icon={<Icon56NotificationOutline className="icon" />}
        className="customPlaceholder"
        header={
          <T keyName={"vacs_info_subs"} language={selectedLanguage}>
            Подписки на вакансии
          </T>
        }
      >
        <T keyName={"vacs_info_subs_info"} language={selectedLanguage}>
          Нажмите на вакансию для того, чтобы отписаться от неё
        </T>
      </Placeholder>

      <Div className={"DivFix"}>
        {!isLoading ? (
          <>
            {notificationsData && notificationsData.length > 0 ? (
              <>
                {notificationsData.map((item) => (
                  <Card
                    className={"mb10"}
                    key={item.id + "va_subsc"}
                    onClick={() => handleVacClick(item)}
                    mode={"outline"}
                  >
                    <SimpleCell>{item.title}</SimpleCell>
                  </Card>
                ))}
              </>
            ) : (
              <Footer>
                <T keyName={"nf"} language={selectedLanguage}>
                  Ничего не найдено
                </T>
              </Footer>
            )}
          </>
        ) : (
          <PanelSpinner />
        )}
      </Div>
    </Group>
  );
};
