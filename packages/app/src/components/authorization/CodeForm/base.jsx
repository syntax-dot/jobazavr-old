import "./styles.scss";
import {
  Button,
  CellButton,
  Div,
  FormItem,
  FormLayout,
  Input,
  Placeholder,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import api from "../../../modules/apiRequest";
import {
  getAfterLogin,
  getCurrentTab,
  getInitData,
  getSelectedLanguage,
  getSentPhone,
  getTabbarHidden,
} from "../../../storage/selectors/main";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "react-hot-toast";
import setTokens from "../../../modules/setTokens";
import { T } from "@tolgee/react";

export const CodeForm = ({ toPanel, openPage }) => {
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const [, setAfterLogin] = useRecoilState(getAfterLogin);
  const nextCodeTime = window.localStorage.getItem("nextCode");
  const [timesToRetry, setTimesToRetry] = useState(60);
  const [isError, setIsError] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [initData, setInitData] = useRecoilState(getInitData);
  const sentPhone = useRecoilValue(getSentPhone);
  const [, setTabbarHidden] = useRecoilState(getTabbarHidden);
  const [, setCurrentTab] = useRecoilState(getCurrentTab);

  useEffect(() => setCurrentTab("codeform"), []);

  async function login() {
    setIsLoading(true);
    const { data: responseData, message: errorMessage } = await api(
      "auth/signin",
      "POST",
      {
        phone: sentPhone,
        code,
      }
    );
    if (responseData) {
      setAfterLogin(true);
      await setTokens(responseData);
      setTabbarHidden(false);
      const { data: resData } = await api("initialize");
      setInitData(resData);

      if (resData?.onboarding && resData) {
        toPanel("register");
      } else {
        openPage("map", "map");
      }
    } else {
      if (errorMessage) {
        if (errorMessage === "auth params not valid") {
        }
      }
      setCode("");
      setIsError(true);
      setIsLoading(false);
    }
  }

  async function repeatCode() {
    const dateNextCode = window.localStorage.getItem("nextCode");
    if (Date.now() >= parseInt(dateNextCode)) {
      const { data: responseData, message: errorMessage } = await api(
        "auth/signin",
        "POST",
        { phone: sentPhone }
      );
      if (responseData) {
        window.localStorage.setItem("nextCode", Date.now() + 60000);
        setTimesToRetry(60);
      } else {
        if (errorMessage === "wait before next code")
          toast.error(
            "Пожалуйста, подождите перед тем, как запрашивать новый код."
          );
      }
    } else {
      toast.error("Пожалуйста, подождите немного и повторите запрос");
    }
  }

  useEffect(() => {
    if (code.length === 6) {
      console.log("code recieved");
      login();
    }
    if (isError) {
      setIsError(false);
    }
  }, [code]);

  useEffect(() => {
    let times = 60;
    if (timesToRetry === 60) {
      const interval = setInterval(() => {
        times--;
        setTimesToRetry(times);
        if (times === 0) clearInterval(interval);
      }, 1000);
    }
  }, [timesToRetry]);

  if (initData) {
    return null;
  }
  return (
    <>
      <Placeholder
        className={"maxWidth"}
        stretched={true}
        header={
          <T language={selectedLanguage} keyName={"fill_code"}>
            Введите код из СМС
          </T>
        }
      >
        <T language={selectedLanguage} keyName={"fill_code_info"}>
          Код отправлен на номер телефона
        </T>
        <br /> +
        {sentPhone.slice(0, 1) +
          " " +
          sentPhone.slice(1, 4) +
          " " +
          sentPhone.slice(4, 7) +
          " " +
          sentPhone.slice(7, 9) +
          " " +
          sentPhone.slice(9, 11)}
        <FormLayout style={{ textAlign: "start" }}>
          <div
            className={
              "pincode__numbers" +
              (isLoading ? " is-loading" : isError ? " is-error" : "")
            }
          >
            <div
              className={
                "pincode__number" + (code.length === 0 ? " is-current" : "")
              }
            >
              {code.at(0)}
            </div>
            <div
              className={
                "pincode__number" + (code.length === 1 ? " is-current" : "")
              }
            >
              {code.at(1)}
            </div>
            <div
              className={
                "pincode__number" + (code.length === 2 ? " is-current" : "")
              }
            >
              {code.at(2)}
            </div>
            <div
              className={
                "pincode__number" + (code.length === 3 ? " is-current" : "")
              }
            >
              {code.at(3)}
            </div>
            <div
              className={
                "pincode__number" + (code.length === 4 ? " is-current" : "")
              }
            >
              {code.at(4)}
            </div>
            <div
              className={
                "pincode__number" + (code.length >= 5 ? " is-current" : "")
              }
            >
              {code.at(5)}
            </div>
            <input
              autoComplete={"one-time-code"}
              maxLength={6}
              autoFocus={true}
              inputMode={"numeric"}
              value={code}
              onChange={({ target }) =>
                ((target.value.length <= 6 && /^\d+$/.test(target.value)) ||
                  target.value === "") &&
                !isLoading
                  ? setCode(target.value)
                  : undefined
              }
              type={"text"}
              className={"pincode__hidden-control-input"}
            />
          </div>
          {isError && (
            <div className={"errorMessages"}>
              <T language={selectedLanguage} keyName={"code_error"}>
                Неверный код
              </T>
            </div>
          )}

          <CellButton
            className={"mt20"}
            onClick={() => repeatCode()}
            size={"l"}
            disabled={timesToRetry > 0}
            stretched={true}
            centered={true}
          >
            {timesToRetry > 0 ? (
              <>
                <T
                  language={selectedLanguage}
                  keyName={"code_repeat_first_part"}
                >
                  Отправить повторно через
                </T>{" "}
                {timesToRetry}{" "}
                <T
                  language={selectedLanguage}
                  keyName={"code_repeat_second_part"}
                >
                  сек.
                </T>
              </>
            ) : (
              <T language={selectedLanguage} keyName={"code_repeat"}>
                Отправить код повторно
              </T>
            )}
          </CellButton>
        </FormLayout>
      </Placeholder>
    </>
  );
};
