import {
  Button,
  Div,
  FormItem,
  FormLayout,
  Input,
  Placeholder,
  Title,
} from "@vkontakte/vkui";
import api from "../../../modules/apiRequest";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getCurrentTab,
  getSelectedLanguage,
  getSentPhone,
} from "../../../storage/selectors/main";
import ReactInputMask from "react-input-mask";
import { T } from "@tolgee/react";

export const PhoneForm = ({ toPanel }) => {
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [, setPhoneSent] = useRecoilState(getSentPhone);
  const [, setCurrentTab] = useRecoilState(getCurrentTab);

  useEffect(() => setCurrentTab("phoneform"), []);

  async function getCode() {
    setIsLoading(true);
    const formatedPhone = parseInt(
      phone
        .replace("(", "")
        .replace(")", "")
        .split("-")
        .join("")
        .replace("+", "")
    ).toString();
    const { data: responseData, message: errorMessage } = await api(
      "auth/signin",
      "POST",
      { phone: formatedPhone }
    );
    if (responseData) {
      setPhoneSent(responseData.phone);
      if (responseData?.code) {
        toast.success(responseData.code, { duration: 5000 });
      }
      window.localStorage.setItem("nextCode", Date.now() + 60000);
      toPanel("codeForm");
    } else {
      if (errorMessage === "wait before next code")
        toast.error(
          "Пожалуйста, подождите перед тем, как запрашивать новый код."
        );
      if ("phone must be a valid phone number".includes(errorMessage))
        toast.error("Введите свой настоящий номер телефона");
    }
    setIsLoading(false);
  }
  return (
    <Placeholder
      className={"stretchedPlaceholder"}
      stretched={true}
      header={
        <T language={selectedLanguage} keyName={"fill_phone"}>
          Введите номер телефона
        </T>
      }
    >
      <T language={selectedLanguage} keyName={"fill_phone_info"}>
        Чтобы войти или зарегистрироваться в приложении
      </T>

      <FormLayout style={{ textAlign: "start" }}>
        <ReactInputMask
          mask="+7(999)-999-99-99"
          alwaysShowMask
          disabled={false}
          maskChar="_"
          className={"mt10"}
          value={phone}
          placeholder={"Телефон"}
          onChange={({ target }) => setPhone(target.value)}
          inputMode={"tel"}
        >
          {() => <Input className={"mt10"} inputMode={"tel"} />}
        </ReactInputMask>

        <Button
          loading={isLoading}
          disabled={
            parseInt(
              phone
                .replace("(", "")
                .replace(")", "")
                .split("-")
                .join("")
                .replace("+", "")
            ).toString().length !== 11
          }
          className={"mt10"}
          onClick={getCode}
          size={"l"}
          stretched={true}
        >
          <T language={selectedLanguage} keyName={"continue"}>
            Продолжить
          </T>
        </Button>
      </FormLayout>
    </Placeholder>
  );
};
