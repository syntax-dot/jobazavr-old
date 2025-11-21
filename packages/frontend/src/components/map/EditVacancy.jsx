import {
  Button,
  CustomSelect,
  Div,
  FormItem,
  FormLayout,
  Group,
  Input,
  Textarea,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import api from "../../modules/apiRequest";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getCitiesData,
  getMarksData,
  getNearestData,
  getPlaceData,
  getSelectedVacancy,
  getSelectedVacancyForEdit,
  getShowPageHeader,
} from "../../storage/selectors/main";
import { toast } from "react-hot-toast";

export const EditVacancy = ({ toBack }) => {
  const vacancyData = useRecoilValue(getSelectedVacancyForEdit);

  // Change above
  const [, setPlaceMarksMap] = useRecoilState(getMarksData);
  const [, setPlaceDataMap] = useRecoilState(getPlaceData);
  const [, setSelectedVacancyMap] = useRecoilState(getSelectedVacancy);
  const [, setPageHeader] = useRecoilState(getShowPageHeader);
  const [, setNearestMapData] = useRecoilState(getNearestData);

  const [data, setData] = useState(vacancyData);
  const [isLoading, setIsLoading] = useState({ cities: false });
  const [citiesData, setCitiesData] = useRecoilState(getCitiesData);
  const [query, setQuery] = useState("");
  const [mount, setMount] = useState(0);
  const [defaultCities, setDefaultCities] = useState(null);

  const handleChange = ({ target }) => {
    if (target.name === "city") {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toString(),
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      }));
    }
  };

  const setCitiesFilter = (e) => {
    setQuery(e.target.value.trim());
  };
  async function changeCities(query) {
    const { data: citiesResData } = await api(
      `cities?query=${query}&limit=100`
    );
    setCitiesData(citiesResData.map((i) => ({ value: i.id, label: i.title })));
    setIsLoading((prevState) => ({ ...prevState, cities: false }));
  }
  useEffect(() => {
    if (mount === 0) setMount(1);
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

  const handleSubmit = async () => {
    const dataToPatch = {
      address: data.address,
      title: data.title,
      description: data.description,
      terms: data.terms,
      salary: data.salary,
      city_id: data.city_id,
    };
    const { data: responseData } = await api(
      `admin/jobs/${vacancyData.id}`,
      "PATCH",
      dataToPatch
    );
    if (responseData) {
      setSelectedVacancyMap((p) => ({ ...p, ...dataToPatch }));
      setPlaceDataMap((p) => ({ ...p, ...dataToPatch }));
      setPlaceMarksMap((p) =>
        p.map((i) => (i.id === vacancyData.id ? { ...i, ...dataToPatch } : i))
      );
      setPageHeader(data.title);
      setNearestMapData((p) =>
        p.map((i) => (i.id === vacancyData.id ? { ...i, ...dataToPatch } : i))
      );
      toBack();
    } else {
      toast.error("Произошла ошибка. Пожалуйста, попробуйте позже.");
    }
  };
  return (
    <Group>
      <FormLayout>
        <FormItem top={"Название места"}>
          <Input
            name={"title"}
            value={data.title}
            onChange={handleChange}
            placeholder={"Пятёрочка"}
          />
        </FormItem>
        <FormItem top={"Вакансия"}>
          <Input
            name={"description"}
            value={data.description}
            onChange={handleChange}
            placeholder={"Уборщица"}
          />
        </FormItem>
        <FormItem top={"Условия работы"}>
          <Textarea
            name={"terms"}
            value={data.terms}
            onChange={handleChange}
            placeholder={"График..."}
          />
        </FormItem>
        <FormItem top={"Зарплата"}>
          <Input
            name={"salary"}
            value={data.salary}
            onChange={handleChange}
            placeholder={"10000"}
          />
        </FormItem>
        <FormItem top={"Город"}>
          <CustomSelect
            autoComplete="off"
            autoCorrect="off"
            onChange={handleChange}
            placeholder={"Введите название города"}
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
            name="city_id"
            value={Number(data.city_id)}
            fetching={isLoading.cities}
            options={citiesData}
          />
        </FormItem>
        <FormItem top={"Адрес"}>
          <Input
            name={"address"}
            value={data.address}
            onChange={handleChange}
            placeholder={"Москва, ул. Ленина, д. 1"}
          />
        </FormItem>
      </FormLayout>
      <Div className={"DivFix"}>
        <Button
          appearance={"positive"}
          className={"mt10"}
          size={"l"}
          stretched={true}
          onClick={handleSubmit}
        >
          Сохранить
        </Button>
      </Div>
    </Group>
  );
};
