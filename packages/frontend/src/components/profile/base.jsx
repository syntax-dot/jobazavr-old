import {
  Icon20MoreVertical,
  Icon24NotificationOutline,
  Icon24Settings,
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
  Header,
  Input,
  MiniInfoCell,
  Placeholder,
  RichCell,
  Select,
  Separator,
  SimpleCell,
  Spacing,
  Text,
  Title,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import declOfTime from "../../modules/declOfTime";
import bridge from "@vkontakte/vk-bridge";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getChangeProfile,
  getCitiesData,
  getCitizenshipsData,
  getCurrentView,
  getFavouriteShow,
  getInitData,
  getListInitDataHandler,
  getSelectedLanguage,
  getSnackbar,
  getUserPhoto,
} from "../../storage/selectors/main";
import api from "../../modules/apiRequest";
import { toast } from "react-hot-toast";
import ageValidation from "../../modules/ageValidation";
import { popularCities } from "../../storage/atoms/main";
import nameValidation from "../../modules/nameValidation";
import { T, useTranslate } from "@tolgee/react";
import RuFlag from "../../assets/images/flags/ru.webp";
import KgFlag from "../../assets/images/flags/kg.webp";
import UzFlag from "../../assets/images/flags/uz.webp";
import TjFlag from "../../assets/images/flags/tj.webp";

const Profile = ({ toPanel }) => {
  const storageItem = window.localStorage.getItem("fav");
  const [showFavouriteState, setShowFavourite] =
    useRecoilState(getFavouriteShow);
  let showFavourite = storageItem
    ? storageItem === "true"
      ? true
      : false
    : showFavouriteState;
  const [selectedLanguage, setSelectedLanguage] =
    useRecoilState(getSelectedLanguage);
  const { t } = useTranslate();
  const [changed, setChanged] = useState(false);
  const [selectClicked, setSelectClicked] = useState(false);
  const [changedCitizen, setChangedCitizen] = useState(false);
  const [clickedCitizen, setClickedCitizen] = useState(false);
  const [changedSelect, setChangedSelect] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [changeProfile, setChangeProfile] = useRecoilState(getChangeProfile);
  const [mount, setMount] = useState(0);
  const [, setSnackbar] = useRecoilState(getSnackbar);
  const [photo, setPhoto] = useRecoilState(getUserPhoto);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [defaultCities, setDefaultCities] = useState(null);
  const [initData, setInitData] = useRecoilState(getInitData);
  const [query, setQuery] = useState("");
  const [citizenshipsData, setCitizenshipsData] =
    useRecoilState(getCitizenshipsData);
  const [citiesData, setCitiesData] = useRecoilState(getCitiesData);
  const [, setListChangeHandler] = useRecoilState(getListInitDataHandler);
  const [isLoadingFavourite, setIsLoadingFavourite] = useState(false);

  const [selectCity, setSelectCity] = useState(initData.city.id);
  const [, setCurrentTab] = useRecoilState(getCurrentView);
  useEffect(() => {
    setCurrentTab("profile");
  }, []);
  const [isLoading, setIsLoading] = useState({ cities: false });
  const [data, setData] = useState({
    name: initData.name,
    phone: initData.phone,
    age: initData.age,
    sex: initData.sex,
    citizenship_id: initData.citizenship.id,
    city: initData.city,
  });

  useEffect(() => {
    bridge.send("VKWebAppSetSwipeSettings", { history: false });
  }, []);

  async function get() {
    let citizensData;
    let citiesDataRes;

    citizenshipsData.length === 1
      ? (citizensData = await api("citizenships"))
      : null;
    citiesData.length === 1
      ? (citiesDataRes = await api(
          `cities?limit=100&query=${data.city.title.slice(0, 2)}`
        ))
      : null;
    citizenshipsData.length === 1
      ? setCitizenshipsData(
          citizensData.data.map((i) => ({ value: i.id, label: i.title }))
        )
      : null;
    citiesData.length === 1
      ? setCitiesData(
          citiesDataRes.data.map((i) => ({ value: i.id, label: i.title }))
        )
      : null;
    citiesData.length === 1
      ? setDefaultCities(
          citiesDataRes.data.map((i) => ({ value: i.id, label: i.title }))
        )
      : null;
  }

  const handleChange = ({ target }) => {
    mount === 1 ? setChanged(true) : undefined;
    if (target.name === "age") {
      if (!/^[0-9]*$/g.test(target.value)) return;
      setData((prevState) => ({
        ...prevState,
        [target.name]:
          target.value.trim()[0] === "0"
            ? target.value.trim().replace("0", "")
            : target.value.trim(),
      }));
      return;
    }
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toString(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubLoading(true);
    const dataToSend = {
      phone: parseInt(data.phone.split("+").join("")).toString(),
      sex: parseInt(data.sex),
      name: data.name,

      age: parseInt(data.age),
    };
    if (changedSelect) {
      dataToSend.city_id = parseInt(selectCity);
      setListChangeHandler(true);
    }
    if (changedCitizen) {
      dataToSend.citizenship_id = parseInt(data.citizenship_id);
    }
    const { data: resData } = await api(`profile`, "PATCH", dataToSend);
    if (resData) {
      const { data: resData } = await api("initialize");
      setInitData(resData);
      setChanged(false);
      setSubLoading(false);
      setChangeProfile(true);
      toast.success("Данные успешно изменены.");
    } else {
      setSubLoading(false);
      toast.error(
        "Произошла ошибка. Пожалуйста, попробуйте позже, или измените данные"
      );
    }
    setSubLoading(false);
  };

  const setCitiesFilter = (e) => {
    setQuery(e.target.value.trim());
  };

  useEffect(() => {
    get();
    setMount(1);
  }, []);

  const handleFavouriteClick = async () => {
    try {
      setIsLoadingFavourite(true);
      await bridge.send("VKWebAppAddToFavorites");
      setShowFavourite(false);
      window.localStorage.removeItem("fav");
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoadingFavourite(false);
    }
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

  useEffect(() => {
    if (mount === 1) {
      // if (query.length === 0) {
      //   setCitiesData(defaultCities);
      //   setIsLoading((prevState) => ({ ...prevState, cities: false }));
      // }

      setIsLoading((prevState) => ({ ...prevState, cities: true }));
      const timeout = setTimeout(() => {
        changeCities(query);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [query]);

  return (
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
                before={<Avatar mode={"image"} size={24} src={option.avatar} />}
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
          <Card onClick={() => toPanel("notifications")} mode={"outline"}>
            <SimpleCell
              multiline={true}
              Component="label"
              after={<Icon24NotificationOutline className={"icon"} />}
            >
              <T keyName={"vacs_sub"} language={selectedLanguage}>
                Подписка на вакансии
              </T>
            </SimpleCell>
          </Card>
        </FormItem>
        <Spacing size={6} />
        {showFavourite ? (
          <>
            <Separator />
            <Spacing size={6} />
            <Div className={"DivFix"}>
              <Card
                onClick={() =>
                  isLoadingFavourite ? null : handleFavouriteClick()
                }
                mode={"outline"}
              >
                <SimpleCell before={<Icon24StarsOutline className={"icon"} />}>
                  <T keyName={"add_app_fav"} language={selectedLanguage}>
                    Добавить приложение в избранное
                  </T>
                </SimpleCell>
              </Card>
            </Div>
          </>
        ) : null}
      </Group>
      <Spacing size={12} />
      <Group className="clearGroup" separator="hide">
        <FormLayout onSubmit={handleSubmit}>
          <FormItem
            bottom={nameValidation(data.name)}
            top={
              <T keyName={"n_and_s"} language={selectedLanguage}>
                Имя и Фамилия
              </T>
            }
            status={nameValidation(data.name) ? "error" : "default"}
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
                  e.target.value.length === 0 ? e.preventDefault() : undefined;
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
                  i.label.toLowerCase().startsWith(value.toLowerCase().trim())
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
              disabled={
                !changed ||
                (initData.sex.toString() === data.sex &&
                  data.phone?.split("+")?.join("") === initData.phone &&
                  initData.name === data.name.trim() &&
                  (changedSelect
                    ? initData.city.id.toString() === selectCity?.toString()
                    : true) &&
                  (changedCitizen
                    ? initData.citizenship.id.toString() ===
                      data?.citizenship_id.toString()
                    : true) &&
                  initData.age.toString() === data?.age.toString().trim()) ||
                data.age.length === 0 ||
                ageValidation(data?.age) ||
                data.name.trim().length === 0 ||
                data.sex.length === 0 ||
                data.phone.length === 0 ||
                nameValidation(data.name) ||
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
              </a>
            </Footer>
          </Div>
        </FormLayout>
      </Group>
    </>
  );
};

export default Profile;
