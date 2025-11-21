import {
  Icon12ChevronOutline,
  Icon56NotePenOutline,
  Icon96NotePenOutline,
} from "@vkontakte/icons";
import {
  Button,
  CellButton,
  CustomSelect,
  Div,
  FixedLayout,
  Footer,
  FormItem,
  FormLayout,
  FormLayoutGroup,
  Group,
  Header,
  Headline,
  Input,
  Link,
  Placeholder,
  Select,
  Separator,
  Text,
  Title,
} from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";
import { useEffect } from "react";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getAppType,
  getCitiesData,
  getCitizenshipsData,
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
import { popularCities } from "../../storage/atoms/main";
import nameValidation from "../../modules/nameValidation";
import { tagRegisterButton } from "../../modules/tagManager";
import { T, useTranslate } from "@tolgee/react";

const Register = ({ openPage, toModal, close }) => {
  const { t } = useTranslate();
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const [ageBlur, setAgeBlur] = useState(false);
  const instance = new SexByRussianName();
  const [savedPhone, setSavedPhone] = useRecoilState(getSavedPhone);
  const [registerPhone, setRegisterPhone] = useRecoilState(getRegisterPhone);
  const phoneInputRef = useRef(null);
  const [phoneInputClicked, setPhoneInputClicked] = useState(false);
  const [tgWindowOpened, setTgWindowOpened] = useRecoilState(getTgWindowOpened);
  const platformType = localStorage.getItem("platformType");
  const [mount, setMount] = useState(0);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [query, setQuery] = useState("");
  const [defaultCities, setDefaultCities] = useState(null);
  const [, setOnBoarding] = useRecoilState(getOnboarding);
  const [initData, setInitData] = useRecoilState(getInitData);
  const [nameBlur, setNameBlur] = useState(false);
  const [citizenshipsData, setCitizenshipsData] =
    useRecoilState(getCitizenshipsData);
  const [citiesData, setCitiesData] = useRecoilState(getCitiesData);
  const [, setDataForPatch] = useRecoilState(getDataForPatch);

  const [isLoading, setIsLoading] = useState({ cities: false });
  const [data, setData] = useState({
    name: initData.name ?? "",
    phone: initData.phone ?? "",
    age: initData.age ?? "",
    sex: initData.sex ?? "",
    citizenship_id: initData?.citizenship_id?.id ?? "1",
    city: initData?.city?.id ?? "",
  });
  async function get() {
    if (platformType === "vk") {
      const res = await bridge.send("VKWebAppGetUserInfo");
      if (res.bdate_visibility === 1) {
        const resMonth = parseInt(res.bdate.split(".")[1]);
        const resDay = parseInt(res.bdate.split(".")[0]);
        const resYear = parseInt(res.bdate.split(".")[2]);
        const date_birth = new Date(`${resYear}-${resMonth}-${resDay}`);

        setData((e) => ({
          ...e,
          age: parseInt(
            (Date.now() - date_birth) / (1000 * 24 * 60 * 60 * 30 * 12)
          ),
        }));
        setAgeBlur(true);
      }
      let instanceSex = instance.getSex({
        firstName: res.first_name,
        lastName: res.last_name,
      });
      if (instanceSex) {
        instanceSex = instanceSex === "male" ? "2" : "1";
      }

      const { data: citizensData } = await api("citizenships");
      let citiesData;
      res?.city?.title
        ? (citiesData = await api(`cities?query=${res.city.title}`))
        : undefined;
      setCitizenshipsData(
        citizensData.map((i) => ({ value: i.id, label: i.title }))
      );
      citiesData?.data && citiesData?.data?.length > 0
        ? setCitiesData(
            citiesData.data.map((i) => ({ value: i.id, label: i.title }))
          )
        : undefined;
      citiesData?.data && citiesData?.data?.length > 0
        ? setInitData((e) => ({
            ...e,
            city: {
              label: citiesData.data[0].title,
              value: citiesData.data[0].id,
            },
          }))
        : undefined;
      citiesData?.data && citiesData?.data?.length > 0
        ? setData((e) => ({ ...e, city: citiesData.data[0].id }))
        : undefined;
      setDefaultCities(popularCities);

      setData((prevState) => ({
        ...prevState,
        name: res.first_name + " " + res.last_name,
        sex: instanceSex ?? res.sex.toString(),
      }));
    } else {
      const { data: citizensData } = await api("citizenships");
      let citiesData;
      if (initData.city?.title) {
        citiesData = await api(`cities?limit=100&query=${initData.city.title}`);
      } else {
        citiesData = await api(`cities?limit=100`);
      }

      setCitizenshipsData(
        citizensData.map((i) => ({ value: i.id, label: i.title }))
      );
      setCitiesData(
        citiesData.data.map((i) => ({ value: i.id, label: i.title }))
      );
      setDefaultCities(
        citiesData.data.map((i) => ({ value: i.id, label: i.title }))
      );
      const { user: tgUserInfo } = window.Telegram.WebApp.initDataUnsafe;

      let instanceSex = instance.getSex({
        firstName: tgUserInfo.first_name,
      });

      if (instanceSex) {
        instanceSex = instanceSex === "male" ? "2" : "1";
      }
      setData((prevState) => ({
        ...prevState,
        name: prevState?.name?.length
          ? prevState.name
          : (tgUserInfo.first_name ?? "") + " " + (tgUserInfo.last_name ?? ""),
        sex: initData?.sex ? initData.sex : instanceSex ?? "2",
      }));
    }
  }

  const handleGetPhone = async (param = false) => {
    phoneInputRef.current.blur();
    if (param === true && (initData.phone || savedPhone)) {
      setData((prevState) => ({
        ...prevState,
        phone: initData.phone ? initData.phone : savedPhone,
      }));
      return;
    }
    if (platformType === "vk") {
      try {
        const { phone_number } = await bridge.send("VKWebAppGetPhoneNumber");
        setData((prevState) => ({ ...prevState, phone: phone_number }));
        setSavedPhone(phone_number);
      } catch (error) {}
      setTgWindowOpened(true);
    } else {
      setDataForPatch(data);
      toModal("phoneRequest");
    }
  };

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
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toString(),
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
            bottom={nameBlur ? nameValidation(data.name) : null}
            top={
              <T keyName={"n_and_s"} language={selectedLanguage}>
                Имя и Фамилия
              </T>
            }
            status={nameValidation(data.name) && nameBlur ? "error" : "default"}
          >
            <Input
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
                    value: "1",
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
            {initData.city ? (
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
                defaultValue={initData.city.id ?? initData.city.value}
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
            bottom={
              tgWindowOpened ? (
                <Link className="tgLink" onClick={() => handleGetPhone(true)}>
                  Автозаполнить телефон
                </Link>
              ) : undefined
            }
          >
            <Input
              onClick={() => {
                setPhoneInputClicked(true);
                data.phone.length === 0 && !tgWindowOpened
                  ? handleGetPhone()
                  : null;
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
                data.sex.length === 0 ||
                nameValidation(data.name) ||
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
