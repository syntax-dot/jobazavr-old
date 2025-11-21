import {
  Icon24Notification,
  Icon24NotificationOutline,
  Icon24StarsOutline,
  Icon56UserCircleOutline,
} from "@vkontakte/icons";
import {
  Avatar,
  Button,
  Card,
  CustomSelect,
  CustomSelectOption,
  Div,
  Footer,
  FormItem,
  FormLayout,
  FormLayoutGroup,
  Group,
  Input,
  Placeholder,
  Select,
  Separator,
  SimpleCell,
  Spacing,
  Switch,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getCurrentTab,
  getCurrentView,
  getNotificationsData,
  getSelectedLanguage,
} from "../../../storage/selectors/main";
import api from "../../../modules/apiRequest";
import ageValidation from "../../../modules/ageValidation";
import { popularCities } from "../../../storage/atoms/main";
import nameValidation from "../../../modules/nameValidation";
import JobazavrIcon from "../../../assets/images/logo.png";
import { useAccountDeletionAndExit } from "../hooks/useAccountDeletionAndExit";
import { useFormHooks } from "../hooks/useFormHooks";
import { T, useTranslate } from "@tolgee/react";
import RuFlag from "../../../assets/images/flags/ru.webp";
import KgFlag from "../../../assets/images/flags/kg.webp";
import UzFlag from "../../../assets/images/flags/uz.webp";
import TjFlag from "../../../assets/images/flags/tj.webp";
import { Preferences } from "@capacitor/preferences";
import { toast } from "react-hot-toast";
const Profile = ({ openPage, toPanel, toPopout }) => {
  const { t } = useTranslate();
  const [selectedLanguage, setSelectedLanguage] =
    useRecoilState(getSelectedLanguage);
  const {
    handleChange,
    handleSubmit,
    initData,
    changed,
    setChanged,
    mount,
    changedSelect,
    setChangedSelect,
    citizenshipsData,
    subLoading,
    setChangedCitizen,
    changedCitizen,
    citiesData,
    setCitiesData,
    setSelectCity,
    selectCity,
    data,
  } = useFormHooks();
  const [selectClicked, setSelectClicked] = useState(false);
  const [clickedCitizen, setClickedCitizen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState({ cities: false });
  const [, setCurrentTab] = useRecoilState(getCurrentTab);
  const [, setCurrentView] = useRecoilState(getCurrentView);
  const { handleDeleteAccount, handleExit } = useAccountDeletionAndExit({
    toPopout,
    openPage,
  });
  const [notificationsData, setNotificationsData] =
    useRecoilState(getNotificationsData);

  useEffect(() => {
    setCurrentTab("profile");
    setCurrentView("profile");
  }, []);

  const setCitiesFilter = (e) => {
    setQuery(e.target.value.trim());
  };

  async function changeCities(query) {
    if (query.length > 0) {
      const { data: citiesResData } = await api(
        `cities?query=${query}&limit=100`
      );
      setCitiesData(
        citiesResData.map((i) => ({ value: i.id, label: i.title }))
      );
      setIsLoading((prevState) => ({ ...prevState, cities: false }));
    } else {
      setCitiesData(popularCities);
      setIsLoading((prevState) => ({ ...prevState, cities: false }));
    }
  }
  console.log("lang", selectedLanguage);

  useEffect(() => {
    if (mount === 1) {
      setIsLoading((prevState) => ({ ...prevState, cities: true }));
      const timeout = setTimeout(() => {
        changeCities(query);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [query]);

  return (
    <>
      <>
        {!initData?.onboarding && initData && (
          <>
            <Group className="clearGroup" separator="hide">
              <Placeholder
                icon={<Icon56UserCircleOutline className="icon" />}
                className="customPlaceholder"
                header={
                  <T keyName={"edit_pd"} language={selectedLanguage}>
                    Редактирование персональных данных
                  </T>
                }
              >
                <T keyName={"edit_pd_info"} language={selectedLanguage}>
                  Эти данные видят работодатели. Необходимо указать достоверную
                  информацию.
                </T>
              </Placeholder>
            </Group>
            <Spacing size={12} />
            <Group className="clearGroup" separator="hide">
              <FormLayout onSubmit={handleSubmit}>
                <FormItem
                  top={
                    <T keyName={"app_lang"} language={selectedLanguage}>
                      Язык приложения
                    </T>
                  }
                >
                  <CustomSelect
                    renderOption={({ option, ...restProps }) => (
                      <CustomSelectOption
                        {...restProps}
                        before={
                          <Avatar
                            mode={"image"}
                            size={24}
                            src={option.avatar}
                          />
                        }
                        description={option.description}
                      />
                    )}
                    value={selectedLanguage}
                    onChange={({ target }) => setSelectedLanguage(target.value)}
                    options={[
                      {
                        value: "ru",
                        label: "Русский",
                        avatar: RuFlag,
                      },
                      {
                        value: "uz",
                        label: "Oʻzbek tili",
                        avatar: UzFlag,
                      },
                      { value: "tg", label: "Тоҷикӣ", avatar: TjFlag },
                      { value: "ky", label: "Кыргыз тили", avatar: KgFlag },
                    ]}
                  />
                </FormItem>
                <FormItem>
                  <Card
                    onClick={() => toPanel("notifications")}
                    mode={"outline"}
                  >
                    <SimpleCell
                      multiline={true}
                      Component="label"
                      disabled
                      after={<Icon24NotificationOutline className={"icon"} />}
                    >
                      <T keyName={"vacs_sub"} language={selectedLanguage}>
                        Подписка на вакансии
                      </T>
                    </SimpleCell>
                  </Card>
                </FormItem>
                <Spacing size={6} />
                <Separator />
                <Spacing size={6} />
                <FormItem
                  bottom={nameValidation({
                    value: data.name,
                    t: t,
                    selectedLanguage,
                  })}
                  top={
                    <T keyName={"n_and_s"} language={selectedLanguage}>
                      Имя и Фамилия
                    </T>
                  }
                  status={
                    nameValidation({ value: data.name, t, selectedLanguage })
                      ? "error"
                      : "default"
                  }
                >
                  <Input
                    maxLength={40}
                    onChange={(e) => {
                      if (e.target.value.length <= 40) {
                        handleChange(e);
                      }
                    }}
                    name="name"
                    placeholder={t({
                      key: "n_and_s_ex",
                      defaultValue: "Иван Иванов",
                      language: selectedLanguage,
                    })}
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
                            key: "female",
                            defaultValue: "Женский",
                            language: selectedLanguage,
                          }),
                        },
                        {
                          value: "2",
                          label: t({
                            key: "male",
                            defaultValue: "Мужской",
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
                    status={ageValidation(data?.age) ? "error" : "default"}
                    bottom={ageValidation(data?.age)}
                  >
                    <Input
                      inputMode="numeric"
                      type={"text"}
                      max={99}
                      maxLength={2}
                      onInput={handleChange}
                      status={ageValidation(data?.age) ? "error" : "default"}
                      min={18}
                      onPaste={(e) => {
                        e.target.value.length === 0
                          ? e.preventDefault()
                          : undefined;
                      }}
                      onChange={handleChange}
                      name="age"
                      placeholder={"18"}
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
                      key: "fill_country",
                      defaultValue: "Введите название страны",
                      language: selectedLanguage,
                    })}
                    name="citizenship_id"
                    autoCorrect="off"
                    onClick={() => setClickedCitizen(true)}
                    autoComplete="off"
                    popupDirection="top"
                    filterFn={(value, option) =>
                      option.label
                        .toLowerCase()
                        .startsWith(value.toLowerCase().trim())
                    }
                    onChange={(e) => {
                      clickedCitizen ? setChangedCitizen(true) : undefined;
                      handleChange(e);
                    }}
                    defaultValue={data.citizenship_id}
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
                  <CustomSelect
                    onChange={({ target }) => {
                      selectClicked ? setChanged(true) : undefined;
                      selectClicked ? setChangedSelect(true) : undefined;

                      setSelectCity(target.value);
                    }}
                    placeholder={t({
                      key: "fill_city",
                      defaultValue: "Введите название города",
                      language: selectedLanguage,
                    })}
                    onInputChange={setCitiesFilter}
                    onClick={() => setSelectClicked(true)}
                    searchable
                    autoCorrect="off"
                    autoComplete="off"
                    popupDirection="top"
                    defaultValue={initData.city.id}
                    name="city"
                    fetching={isLoading.cities}
                    filterFn={(value, option) =>
                      citiesData.find((i) =>
                        i.label
                          .toLowerCase()
                          .startsWith(value.toLowerCase().trim())
                      )
                        ? option.label
                            .toLowerCase()
                            .startsWith(value.toLowerCase().trim())
                        : option.label
                            .toLowerCase()
                            .includes(value.toLowerCase().trim())
                    }
                    options={citiesData}
                  />
                </FormItem>
                <FormItem
                  status={
                    data?.phone?.split("+")?.join("")?.length !== 11
                      ? "error"
                      : "default"
                  }
                  bottom={
                    data?.phone?.split("+")?.join("")?.length !== 11
                      ? t({
                          key: "phone_error",
                          defaultValue: "Введите корректный номер телефона.",
                          language: selectedLanguage,
                        })
                      : null
                  }
                  top={
                    <T keyName={"phone"} language={selectedLanguage}>
                      Телефон
                    </T>
                  }
                >
                  <Input
                    disabled={true}
                    type={"tel"}
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
                    placeholder={"79001234567"}
                    status={
                      data?.phone?.split("+")?.join("")?.length !== 11
                        ? "error"
                        : "default"
                    }
                    inputMode="tel"
                    value={data.phone}
                  />
                </FormItem>

                <Div className="" style={{ marginTop: -3 }}>
                  <Button
                    type="submit"
                    loading={subLoading}
                    appearance={"positive"}
                    disabled={
                      !changed ||
                      (initData.sex.toString() === data.sex &&
                        data.phone?.split("+")?.join("") === initData.phone &&
                        initData.name === data.name.trim() &&
                        (changedSelect
                          ? initData.city.id.toString() ===
                            selectCity?.toString()
                          : true) &&
                        (changedCitizen
                          ? initData.citizenship.id.toString() ===
                            data?.citizenship_id.toString()
                          : true) &&
                        initData.age.toString() ===
                          data?.age.toString().trim()) ||
                      data.age.length === 0 ||
                      ageValidation(data?.age) ||
                      data.name.trim().length === 0 ||
                      data.sex.length === 0 ||
                      data.phone.length === 0 ||
                      nameValidation({
                        value: data.name,
                        t,
                        selectedLanguage,
                      }) ||
                      data.citizenship_id.length === 0 ||
                      data.city.length === 0 ||
                      data?.phone?.split("+")?.join("")?.length !== 11
                    }
                    size="l"
                    stretched
                  >
                    <T keyName={"save"} language={selectedLanguage}>
                      Сохранить
                    </T>
                  </Button>
                  <Button
                    onClick={handleExit}
                    className={"mt10"}
                    stretched={true}
                    size={"l"}
                    mode={"secondary"}
                  >
                    <T keyName={"exit"} language={selectedLanguage}>
                      Выйти
                    </T>
                  </Button>
                  <Footer style={{ margin: "24px 16px 10px" }}>
                    <a
                      className="muted-link"
                      href="https://vk-mini-app.jobazavr.ru/static/agreement.pdf"
                      target={"_blank"}
                    >
                      <T keyName={"sogl"} language={selectedLanguage}>
                        Пользовательское соглашение
                      </T>
                    </a>{" "}
                    •{" "}
                    <a
                      className="muted-link"
                      target={"_blank"}
                      href="https://vk-mini-app.jobazavr.ru/static/privacy.pdf"
                    >
                      <T keyName={"privacy"} language={selectedLanguage}>
                        Политика конфиденциальности
                      </T>
                    </a>{" "}
                    •{" "}
                    <a className="muted-link" onClick={handleDeleteAccount}>
                      <T keyName={"remove_acc"} language={selectedLanguage}>
                        Удалить аккаунт
                      </T>
                    </a>{" "}
                  </Footer>
                </Div>
              </FormLayout>
            </Group>
          </>
        )}
        {(initData?.onboarding || !initData) && (
          <>
            <Placeholder
              icon={<img style={{ width: "50%" }} src={JobazavrIcon} />}
              header={
                <T keyName={"fill_info"} language={selectedLanguage}>
                  Заполните свою анкету
                </T>
              }
            >
              <T keyName={"info_fill_info"} language={selectedLanguage}>
                Добавьте информацию о себе, чтобы работодатели смогли оценить
                Ваши профессионалные навыки
              </T>
            </Placeholder>
            <FormItem
              top={
                <T keyName={"app_lang"} language={selectedLanguage}>
                  Язык приложения
                </T>
              }
            >
              <CustomSelect
                renderOption={({ option, ...restProps }) => (
                  <CustomSelectOption
                    {...restProps}
                    before={
                      <Avatar mode={"image"} size={24} src={option.avatar} />
                    }
                    description={option.description}
                  />
                )}
                value={selectedLanguage}
                onChange={({ target }) => setSelectedLanguage(target.value)}
                options={[
                  {
                    value: "ru",
                    label: "Русский",
                    avatar: RuFlag,
                  },
                  {
                    value: "uz",
                    label: "Oʻzbek tili",
                    avatar: UzFlag,
                  },
                  { value: "tg", label: "Тоҷикӣ", avatar: TjFlag },
                  { value: "ky", label: "Кыргыз тили", avatar: KgFlag },
                ]}
              />
            </FormItem>
            <Spacing size={6} />
            <Separator />
            <Spacing size={6} />
            <Div className={"DivFix"}>
              <Button
                onClick={() => toPanel("register")}
                size={"l"}
                stretched={true}
                appearance={"positive"}
              >
                {initData ? (
                  <T keyName={"fill_info_action"} language={selectedLanguage}>
                    Заполнить анкету
                  </T>
                ) : (
                  <T keyName={"login_action"} language={selectedLanguage}>
                    Вход в аккаунт
                  </T>
                )}
              </Button>
              {initData && (
                <Button
                  onClick={handleExit}
                  className={"mt10"}
                  stretched={true}
                  size={"l"}
                  mode={"secondary"}
                >
                  <T keyName={"exit"} language={selectedLanguage}>
                    Выйти
                  </T>
                </Button>
              )}
              <Div className="" style={{ marginTop: -3 }}>
                <Footer style={{ margin: "24px 16px 10px" }}>
                  <a
                    className="muted-link"
                    href="https://vk-mini-app.jobazavr.ru/static/agreement.pdf"
                    target={"_blank"}
                  >
                    <T keyName={"sogl"} language={selectedLanguage}>
                      Пользовательское соглашение
                    </T>
                  </a>{" "}
                  •{" "}
                  <a
                    className="muted-link"
                    target={"_blank"}
                    href="https://vk-mini-app.jobazavr.ru/static/privacy.pdf"
                  >
                    <T keyName={"privacy"} language={selectedLanguage}>
                      Политика конфиденциальности
                    </T>
                  </a>{" "}
                  {initData && (
                    <>
                      •{" "}
                      <a className="muted-link" onClick={handleDeleteAccount}>
                        <T keyName={"remove_acc"} language={selectedLanguage}>
                          Удалить аккаунт
                        </T>
                      </a>
                    </>
                  )}
                </Footer>
              </Div>
            </Div>
          </>
        )}
      </>
    </>
  );
};

export default Profile;
