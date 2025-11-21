import { Icon56GlobeCrossOutline } from "@vkontakte/icons";
import { Div, Group, Placeholder } from "@vkontakte/vkui";

const InitializeError = ({ error }) => {
  return (
    <Div
      style={{
        width: "100vw",
        height: "100vh",
        background: "var(--vkui--color_background)",
        padding: 0,
      }}
    >
      <Placeholder
        stretched
        header="Сервис не запустился"
        icon={<Icon56GlobeCrossOutline className="icon" />}
      >
        {error === 403
          ? "Незащищенное интернет-соединение. Проверьте настройки сети."
          : error === 429
          ? "Превышен лимит запросов. Пожалуйста, подождите немного и попробуйте позже."
          : "Произошла ошибка. Пожалуйста, попробуйте позже."}
      </Placeholder>
    </Div>
  );
};

export default InitializeError;
