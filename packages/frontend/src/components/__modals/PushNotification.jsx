import { Button, Text } from "@vkontakte/vkui";

export const PushNotification = ({ toPanel, close }) => {
  return (
    <>
      <Text muted={true} className={"centered"}>
        добавьте информацию о себе, чтобы работодатели смогли оценить Ваши
        профессионалные навыки при отклике
      </Text>
      <Button
        onClick={() => {
          close();
          toPanel("register");
        }}
        size={"l"}
        className={"mt20"}
      >
        Далее
      </Button>
    </>
  );
};
