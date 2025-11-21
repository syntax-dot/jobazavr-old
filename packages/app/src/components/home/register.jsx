import {
  Button,
  CustomSelect,
  Div,
  Footer,
  FormItem,
  FormLayout,
  FormLayoutGroup,
  Header,
  Input,
  Select,
} from "@vkontakte/vkui";
import { useEffect } from "react";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getCitiesData,
  getCitizenshipsData,
  getCurrentTab,
  getDataForPatch,
  getInitData,
  getOnboarding,
  getRegisterPhone,
  getSavedPhone,
  getSelectedLanguage,
  getTgWindowOpened,
} from "../../storage/selectors/main";
import api from "../../modules/apiRequest";
import { toast } from "react-hot-toast";
import { SexByRussianName } from "sex-by-russian-name";
import { useRef } from "react";
import ageValidation from "../../modules/ageValidation";
import nameValidation from "../../modules/nameValidation";
import { tagRegisterButton } from "../../modules/tagManager";
import { T, useTranslate } from "@tolgee/react";

const Register = ({ openPage, toModal, close }) => {
  const { t } = useTranslate();
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const [ageBlur, setAgeBlur] = useState(false);
  const instance = new SexByRussianName();
  const registerPhone = useRecoilValue(getRegisterPhone);
  const phoneInputRef = useRef(null);
  const [phoneInputClicked, setPhoneInputClicked] = useState(false);
  const [mount, setMount] = useState(0);
  const [query, setQuery] = useState("");
  const [defaultCities, setDefaultCities] = useState(null);
  const [initData, setInitData] = useRecoilState(getInitData);
  const [nameBlur, setNameBlur] = useState(false);
  const [citizenshipsData, setCitizenshipsData] =
    useRecoilState(getCitizenshipsData);
  const [citiesData, setCitiesData] = useRecoilState(getCitiesData);

  const [isLoading, setIsLoading] = useState({ cities: false });
  const [data, setData] = useState({
    name: initData._name ?? "",
    phone: initData.phone ?? "",
    age: initData._age ?? "",
    sex: initData._sex ?? "0",
    citizenship_id: initData._citizenship_id ?? "1",
    city: initData?._city?.value ?? "",
  });
  const [, setCurrentTab] = useRecoilState(getCurrentTab);

  useEffect(() => setCurrentTab("register"), []);
  async function get() {
    try {
      const { data: citizensData } = await api("citizenships");
      setCitizenshipsData(
        citizensData.map((i) => ({ value: i.id, label: i.title }))
      );
    } catch (e) {}

    if (initData._city) {
      console.log(initData._city);
    } else {
    }

    setCitiesData(
      citiesData.map((i) => (i.id ? { value: i.id, label: i.title } : i))
    );
    setDefaultCities(
      citiesData.map((i) => (i.id ? { value: i.id, label: i.title } : i))
    );
  }

  async function handleAutoEditSex() {
    if (data.name.split(" ")[0] && data.name.split(" ")[1]) {
      let instanceSex = instance.getSex({
        firstName: data.name.split(" ")[0],
        lastName: data.name.split(" ")[1],
      });
      if (instanceSex) {
        instanceSex === "male"
          ? setData((e) => ({ ...e, sex: "2" }))
          : instanceSex === "female"
          ? setData((e) => ({ ...e, sex: "1" }))
          : undefined;
      }
      if (instanceSex) {
        instanceSex === "male"
          ? setInitData((e) => ({ ...e, _sex: "2" }))
          : instanceSex === "female"
          ? setInitData((e) => ({ ...e, _sex: "1" }))
          : undefined;
      }
    }
  }

  const handleChange = ({ target }) => {
    if (target.name === "age") {
      if (!/^[0-9]*$/g.test(target.value)) return;
      setData((prevState) => ({
        ...prevState,
        [target.name]:
          target.value.trim()[0] === "0"
            ? target.value.trim().replace("0", "")
            : target.value.trim(),
      }));
    } else {
      if ((target.name !== "age" ** target.name) !== "city")
        setInitData((e) => ({
          ...e,
          [`_${target.name}`]: target.value.toString(),
        }));
      if (target.name === "city") {
        setInitData((e) => ({
          ...e,
          [`_${target.name}`]: {
            value: target.value.toString(),
            label: citiesData.find(
              (i) => i.value.toString() === target.value.toString()
            ).label,
          },
        }));
      }

      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toString(),
      }));
    }
    if (target.name === "age") {
      if (!/^[0-9]*$/g.test(target.value)) return;
      setInitData((e) => ({
        ...e,
        [`_${target.name}`]:
          target.value.trim()[0] === "0"
            ? target.value.trim().replace("0", "")
            : target.value.trim(),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      data.age.length === 0 ||
      data.name.length === 0 ||
      data.sex.length === 0 ||
      data.phone.length === 0 ||
      data.citizenship_id.length === 0 ||
      data.city.length === 0
    )
      return;
    const patchData = {
      citizenship_id: parseInt(data.citizenship_id),
      city_id: parseInt(data.city),
      age: parseInt(data.age),
      sex: parseInt(data.sex),
      onboarding: false,
      phone: data.phone.split("+").join(""),
      name: data.name,
    };

    const { data: resData, message: errorMesasge } = await api(
      "profile",
      "PATCH",
      patchData
    );
    if (resData) {
      tagRegisterButton();
      const { data } = await api("initialize", `GET`);
      setInitData(data);
      // openPage("home", "home");
      close();
    } else if (errorMesasge) {
      if (errorMesasge.includes("age must not be less than 18")) {
        toast.error("Необходим возраст старше 18 лет.");
      } else if (errorMesasge.includes("phone must be a valid phone number")) {
        toast.error("Введите корректный номер телефона.");
      } else {
        toast.error("Произошла ошибка, пожалуйста, попробуйте позже.");
      }
    } else {
      toast.error("Произошла ошибка, пожалуйста, попробуйте позже.");
    }
  };

  const setCitiesFilter = (e) => {
    setQuery(e.target.value.trim());
  };

  useEffect(() => {
    console.log("initData", initData);
    if (initData._name) setNameBlur(true);
    if (initData._age) setAgeBlur(true);
    get();
    setMount(1);
  }, []);

  async function changeCities(query) {
    const { data: citiesResData } = await api(
      `cities?query=${query}&limit=100`
    );
    setCitiesData(citiesResData.map((i) => ({ value: i.id, label: i.title })));
    setIsLoading((prevState) => ({ ...prevState, cities: false }));
  }

  useEffect(() => {
    if (mount === 1) {
      if (query.length === 0) {
        setCitiesData(defaultCities);
        setIsLoading((prevState) => ({ ...prevState, cities: false }));
      }
      if (query.length > 0) {
        setIsLoading((prevState) => ({ ...prevState, cities: true }));
        const timeout = setTimeout(() => {
          changeCities(query);
        }, 800);
        return () => clearTimeout(timeout);
      }
    }
  }, [query]);

  useEffect(() => {
    if (mount === 1) {
      if (registerPhone === true) {
        setData((prevState) => ({ ...prevState, phone: initData.phone }));
      }
    }
  }, [registerPhone]);

  return (
    <>
      <>
        <Header mode="primary" className="mb5 anketa" multiline>
          <T keyName={"otclick_fill_info"} language={selectedLanguage}>
            Заполните анкету для отклика на вакансию.
          </T>
        </Header>

        <FormLayout onSubmit={handleSubmit}>
          <FormItem
            bottom={
              nameBlur
                ? nameValidation({ value: data.name, t, selectedLanguage })
                : null
            }
            top={
              <T keyName={"n_and_s"} language={selectedLanguage}>
                Имя и Фамилия
              </T>
            }
            status={
              nameValidation({ value: data.name, t, selectedLanguage }) &&
              nameBlur
                ? "error"
                : "default"
            }
          >
            <Input
              onBlurCapture={handleAutoEditSex}
              placeholder={t({
                defaultValue: "Иван Иванов",
                key: "n_and_s_ex",
                language: selectedLanguage,
              })}
              onBlur={() => setNameBlur(true)}
              maxLength={40}
              onChange={(e) => {
                if (e.target.value.length <= 40) {
                  handleChange(e);
                }
              }}
              name="name"
              value={data.name}
            />
          </FormItem>
          <FormLayoutGroup mode="horizontal">
            <FormItem
              top={
                <T keyName={"sex"} language={selectedLanguage}>
                  Пол
                </T>
              }
            >
              <Select
                value={data.sex}
                onChange={handleChange}
                name="sex"
                options={[
                  {
                    value: "0",
                    label: t({
                      defaultValue: "Не выбран",
                      key: "not_stated",
                      language: selectedLanguage,
                    }),
                  },
                  {
                    value: "2",
                    label: t({
                      defaultValue: "Мужской",
                      key: "male",
                      language: selectedLanguage,
                    }),
                  },
                  {
                    value: "1",
                    label: t({
                      defaultValue: "Женский",
                      key: "female",
                      language: selectedLanguage,
                    }),
                  },
                ]}
              />
            </FormItem>
            <FormItem
              top={
                <T keyName={"age"} language={selectedLanguage}>
                  Возраст
                </T>
              }
              status={ageValidation(data?.age) && ageBlur ? "error" : "default"}
              bottom={ageBlur ? ageValidation(data?.age) : null}
            >
              <Input
                type={"text"}
                inputMode="numeric"
                maxLength={2}
                status={
                  ageValidation(data?.age) && ageBlur ? "error" : "default"
                }
                placeholder="18"
                onBlur={() => setAgeBlur(true)}
                onPaste={(e) => {
                  console.log(e.target.value);
                  (e.target.value.length === 0) === "."
                    ? e.preventDefault()
                    : undefined;
                }}
                onChange={handleChange}
                name="age"
                value={data.age}
              />
            </FormItem>
          </FormLayoutGroup>
          <FormItem
            top={
              <T keyName={"citizenship"} language={selectedLanguage}>
                Гражданство
              </T>
            }
          >
            <CustomSelect
              placeholder={t({
                defaultValue: "Введите название страны",
                key: "fill_country",
                language: selectedLanguage,
              })}
              name="citizenship_id"
              popupDirection="top"
              autoCorrect="off"
              autoComplete="off"
              onChange={handleChange}
              defaultValue={1}
              filterFn={(value, option) =>
                option.label
                  .toLowerCase()
                  .startsWith(value.toLowerCase().trim())
              }
              searchable
              options={citizenshipsData}
            />
          </FormItem>
          <FormItem
            top={
              <T keyName={"city"} language={selectedLanguage}>
                Город
              </T>
            }
          >
            {initData._city ? (
              <CustomSelect
                autoComplete="off"
                autoCorrect="off"
                onChange={handleChange}
                placeholder={t({
                  defaultValue: "Введите название города",
                  key: "fill_city",
                  language: selectedLanguage,
                })}
                onInputChange={setCitiesFilter}
                searchable
                popupDirection="top"
                filterFn={(value, option) =>
                  citiesData.find((i) =>
                    i.label.toLowerCase().startsWith(value.toLowerCase().trim())
                  )
                    ? option.label
                        .toLowerCase()
                        .startsWith(value.toLowerCase().trim())
                    : option.label
                        .toLowerCase()
                        .includes(value.toLowerCase().trim())
                }
                name="city"
                defaultValue={parseInt(initData._city.value) ?? null}
                fetching={isLoading.cities}
                options={citiesData}
              />
            ) : (
              <CustomSelect
                autoCorrect="off"
                autoComplete="off"
                onChange={handleChange}
                popupDirection="top"
                filterFn={(value, option) =>
                  citiesData.find((i) =>
                    i.label.toLowerCase().startsWith(value.toLowerCase().trim())
                  )
                    ? option.label
                        .toLowerCase()
                        .startsWith(value.toLowerCase().trim())
                    : option.label
                        .toLowerCase()
                        .includes(value.toLowerCase().trim())
                }
                placeholder={t({
                  defaultValue: "Введите название города",
                  key: "fill_city",
                  language: selectedLanguage,
                })}
                onInputChange={setCitiesFilter}
                searchable
                name="city"
                fetching={isLoading.cities}
                options={citiesData}
              />
            )}
          </FormItem>
          <FormItem
            top={
              <T keyName={"phone"} language={selectedLanguage}>
                Телефон
              </T>
            }
          >
            <Input
              disabled={true}
              onClick={() => {
                setPhoneInputClicked(true);
              }}
              onChange={(e) => {
                if (
                  ((e?.target?.value?.toString()?.length === 1 &&
                    e?.target?.value?.toString().at(0) === "+") ||
                    !e.target.value
                      .toString()
                      .replace("+", "")
                      .trim()
                      .split("")
                      .some((i) => !"0123456789".includes(i)) ||
                    e?.target?.value?.toString()?.length === 0) &&
                  e.target.value.split("+").join("").length <= 11
                ) {
                  handleChange(e);
                }
              }}
              name="phone"
              type={"tel"}
              inputMode={"tel"}
              placeholder="79001234567"
              status={
                data?.phone?.split("+")?.join("")?.length !== 11 &&
                phoneInputClicked
                  ? "error"
                  : "default"
              }
              value={data.phone}
              getRef={phoneInputRef}
            />
          </FormItem>

          <Div className="" style={{ marginTop: 0 }}>
            <Button
              type="submit"
              disabled={
                data.age.length === 0 ||
                parseInt(data?.age) < 18 ||
                parseInt(data?.age) > 99 ||
                data.name.trim().length === 0 ||
                data.sex === "0" ||
                nameValidation({ value: data.name, t, selectedLanguage }) ||
                data.phone.length === 0 ||
                data.citizenship_id.length === 0 ||
                data.city.length === 0 ||
                data?.phone?.split("+")?.join("")?.length !== 11
              }
              size="l"
              stretched
            >
              <T keyName={"continue"} language={selectedLanguage}>
                Продолжить
              </T>
            </Button>
            <Footer style={{ margin: "14px 0 0" }}>
              <T keyName={"continue_click_info"} language={selectedLanguage}>
                Нажимая «Продолжить», Вы принимаете
              </T>{" "}
              <a
                className="muted-link"
                href="https://vk-mini-app.jobazavr.ru/static/agreement.pdf"
                target={"_blank"}
              >
                <T keyName={"sogl"} language={selectedLanguage}>
                  пользовательское соглашение
                </T>
              </a>{" "}
              <T keyName={"and"} language={selectedLanguage}>
                и
              </T>{" "}
              <a
                className="muted-link"
                target={"_blank"}
                href="https://vk-mini-app.jobazavr.ru/static/privacy.pdf"
              >
                <T keyName={"privacy"} language={selectedLanguage}>
                  политику конфиденциальности
                </T>
              </a>
            </Footer>
          </Div>
        </FormLayout>
      </>
    </>
  );
};

export default Register;
