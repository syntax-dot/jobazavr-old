import {
  Card,
  FormItem,
  FormLayout,
  FormLayoutGroup,
  IconButton,
  Input,
  NativeSelect,
  Placeholder,
  RangeSlider,
  SelectMimicry,
  Slider,
} from "@vkontakte/vkui";
import {
  Icon24Cancel,
  Icon24ChevronDown,
  Icon56SettingsOutline,
} from "@vkontakte/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getAfterSelectingCity,
  getEmployers,
  getFilterCities,
  getFilterCity,
  getFilterEmployer,
  getFilterEmployersData,
  getFilterJob,
  getFilterVacanciesData,
  getFilterWorkPlace,
  getIsFirstLoad,
  getMapFilterQuery,
  getMarksData,
  getSalaryFilter,
  getSalaryFilterMax,
  getSavedMarks,
  getSelectedCity,
  getSelectedLanguage,
  getUpdateFilters,
} from "../../storage/selectors/main";
import { useEffect, useState } from "react";
import api from "../../modules/apiRequest";
import { useTranslate } from "@tolgee/react";
import dividePrice from "../../modules/dividePrice";

export const FiltersModal = ({ routerHooks, close }) => {
  const [isFirstLoad, setIsFirstLoad] = useRecoilState(getIsFirstLoad);
  const [salaryFilter, setSalaryFilter] = useRecoilState(getSalaryFilter);
  const [salaryFilterMax, setSalaryFilterMax] =
    useRecoilState(getSalaryFilterMax);
  const [mount, setMount] = useState(0);
  const { t } = useTranslate();
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const marksData = useRecoilValue(getMarksData);
  const [savedMarks, setSavedMarks] = useRecoilState(getSavedMarks);
  const [filterJob, setFilterJob] = useRecoilState(getFilterJob);
  const [filterCity, setFilterCity] = useRecoilState(getFilterCity);
  const [, setFilterCities] = useRecoilState(getFilterCities);
  const [isAfterSelectingCities, setIsAfterSelectingCities] = useRecoilState(
    getAfterSelectingCity
  );
  const [, setMapFilterQuery] = useRecoilState(getMapFilterQuery);
  const [selectedCity, setSelectedCity] = useRecoilState(getSelectedCity);
  const [employers, setEmployers] = useRecoilState(getEmployers);
  const [, setFilterWorkPlace] = useRecoilState(getFilterWorkPlace);
  const [filterEmployer, setFilterEmployer] = useRecoilState(getFilterEmployer);
  const [filterEmployersData, setFilterEmployersData] = useRecoilState(
    getFilterEmployersData
  );
  const [filterVacanciesData, setFilterVacanciesData] = useRecoilState(
    getFilterVacanciesData
  );
  const [updateFilters, setUpdateFilter] = useRecoilState(getUpdateFilters);

  useEffect(() => {
    if (!savedMarks) {
      setSavedMarks(marksData);
    }
  }, []);

  useEffect(() => {
    setSavedMarks(marksData);
  }, [marksData]);

  useEffect(() => {
    let to;
    let queryString = "";
    if (filterJob && filterJob !== "ns") {
      queryString += `&vacancy=${filterJob}`;
    }
    if (filterEmployer && filterEmployer !== "ns") {
      queryString += `&employer=${filterEmployer}`;
    }
    if (
      salaryFilter.length !== 0 &&
      (salaryFilterMax.length === 0 ||
        (salaryFilterMax.length > 0 &&
          Number(salaryFilterMax) > Number(salaryFilter)))
    ) {
      queryString += `&salary_from=${salaryFilter}`;
    }
    if (
      salaryFilterMax.length !== 0 &&
      (salaryFilter.length === 0 ||
        (salaryFilter.length > 0 &&
          Number(salaryFilter) < Number(salaryFilterMax)))
    ) {
      queryString += `&salary_to=${salaryFilterMax}`;
    }
    if (typeof selectedCity?.id === "number") {
      queryString += `&city_id=${selectedCity.id}`;
    }
    if (queryString.length === 0) {
      setMapFilterQuery(null);
    } else {
      to = setTimeout(() => {
        setMapFilterQuery(queryString);
      }, 800);
    }
    return () => (to ? clearTimeout(to) : null);
  }, [filterJob, filterEmployer, salaryFilter, salaryFilterMax]);

  async function getEmployersFetch(afterCitiesSelecting = false) {
    const { data: responseData } = await api(
      `jobs/filtersData?${selectedCity ? `&city_id=${selectedCity.id}` : ""}${
        filterEmployer && !afterCitiesSelecting && filterEmployer !== "ns"
          ? `&employer=${filterEmployer}`
          : ""
      }${
        filterJob && !afterCitiesSelecting && filterJob !== "ns"
          ? `&vacancy=${filterJob}`
          : ""
      }`
    );
    if (responseData) {
      setEmployers(responseData);
      if (responseData.employers)
        setFilterVacanciesData(responseData.employers);
      if (responseData.vacancies)
        setFilterEmployersData(responseData.vacancies);
      if (responseData.cities) {
        setFilterCities(responseData.cities);
      } else {
        setFilterCities(null);
      }
    } else {
      setEmployers({});
    }
  }

  useEffect(() => {
    if (isAfterSelectingCities) {
      setIsAfterSelectingCities(false);
      getEmployersFetch(true)
        .then(() => console.log("done"))
        .finally(() => getEmployersFetch());
    } else {
      if (mount === 1 || !isFirstLoad) getEmployersFetch();
      if (mount === 0) setMount(1);
      if (!isFirstLoad) setIsFirstLoad(true);
    }
  }, [selectedCity, filterEmployer, filterJob]);

  useEffect(() => {
    if (updateFilters) {
      setFilterJob(null);
      setFilterEmployer(null);
      setUpdateFilter(false);
    }
  }, [updateFilters]);

  async function handleFilterSelect({ target }) {
    switch (target.name) {
      case "job":
        setFilterJob(target.value.length === 0 ? "ns" : target.value);
        break;
      case "employer":
        if (target.value.length === 0) setFilterEmployersData([]);
        setFilterEmployer(target.value.length === 0 ? "ns" : target.value);
        break;
      case "city":
        setFilterCity(target.value);
        break;
      case "workPlace":
        setFilterWorkPlace(target.value);
        break;
    }
  }

  const handleChange = ({ target }) => {
    switch (target.name) {
      case "salary_min":
        setSalaryFilter(
          target.value
            .toString()
            .replace(/[^0-9]*/g, "")
            .slice(0, 6)
        );
        break;
      case "salary_max":
        setSalaryFilterMax(
          target.value
            .toString()
            .replace(/[^0-9]*/g, "")
            .slice(0, 6)
        );
        break;
      default:
        break;
    }
  };

  const employersOptions = filterVacanciesData
    ? [...filterVacanciesData.map((i) => <option value={i}>{i}</option>)]
    : [];
  const vacanciesOptions = filterEmployersData
    ? [...filterEmployersData.map((i) => <option value={i}>{i}</option>)]
    : [];

  return (
    <>
      <Placeholder
        className={"customPlaceholder"}
        header={t({
          key: "build_list_by_yself",
          defaultValue: "Настройте список вакансий под себя",
          language: selectedLanguage,
        })}
        icon={<Icon56SettingsOutline />}
      >
        {t({
          key: "select_giver",
          defaultValue: "Просто выберите работодателя или название вакансии",
          language: selectedLanguage,
        })}
      </Placeholder>
      <FormLayout>
        <FormItem
          top={t({
            key: "city",
            defaultValue: "Город",
            language: selectedLanguage,
          })}
        >
          <SelectMimicry
            onClick={({ target }) => {
              if (target.closest("#not-click")) {
              } else {
                routerHooks.openPage("cities", "cities");
                close();
              }
            }}
            after={
              selectedCity ? (
                <IconButton
                  onClick={() => {
                    setSelectedCity(null);
                  }}
                  id={"not-click"}
                >
                  <Icon24Cancel />
                </IconButton>
              ) : (
                <IconButton style={{ pointerEvents: "none" }}>
                  <Icon24ChevronDown />
                </IconButton>
              )
            }
          >
            {selectedCity
              ? selectedCity.title
              : t({
                  key: "ns",
                  defaultValue: "Не выбрано",
                  language: selectedLanguage,
                })}
          </SelectMimicry>
        </FormItem>
        <FormItem
          top={t({
            key: "job_giver",
            defaultValue: "Работодатель",
            language: selectedLanguage,
          })}
        >
          <NativeSelect
            after={
              <IconButton
                onClick={() => {
                  setMapFilterQuery(null);
                  setFilterEmployer(null);
                }}
              >
                <Icon24Cancel />
              </IconButton>
            }
            name={"employer"}
            placeholder={t({
              key: "ns",
              defaultValue: "Не выбрано",
              language: selectedLanguage,
            })}
            value={
              employersOptions?.find((i) => {
                return i.props.value === filterEmployer;
              })?.props?.value ?? ""
            }
            options={employersOptions}
            onChange={(e) => handleFilterSelect(e)}
          >
            {...employersOptions}
          </NativeSelect>
        </FormItem>
        <FormItem
          top={t({
            key: "vac",
            defaultValue: "Вакансия",
            language: selectedLanguage,
          })}
        >
          <NativeSelect
            after={
              <IconButton
                onClick={() => {
                  setMapFilterQuery(null);
                  setFilterJob(null);
                }}
              >
                <Icon24Cancel />
              </IconButton>
            }
            name={"job"}
            placeholder={t({
              key: "ns",
              defaultValue: "Не выбрано",
              language: selectedLanguage,
            })}
            value={
              vacanciesOptions?.find((i) => {
                return i.props.value === filterJob;
              })?.props?.value ?? ""
            }
            options={vacanciesOptions}
            onChange={(e) => handleFilterSelect(e)}
          >
            {...vacanciesOptions}
          </NativeSelect>
        </FormItem>
        <FormLayoutGroup mode={"horizontal"}>
          <FormItem
            top={t({
              key: "salary_from",
              defaultValue: "Зарплата от",
              language: selectedLanguage,
            })}
          >
            <Input
              onBlur={({ target }) => {
                if (
                  salaryFilterMax.length > 0 &&
                  !isNaN(Number(salaryFilterMax)) &&
                  Number(target.value) > Number(salaryFilterMax)
                ) {
                  console.log(Number(salaryFilterMax));
                  setSalaryFilter("");
                }
              }}
              after={
                salaryFilter.length > 0 && (
                  <IconButton
                    style={{ borderRadius: 9 }}
                    onClick={() => {
                      setSalaryFilter("");
                    }}
                  >
                    <Icon24Cancel />
                  </IconButton>
                )
              }
              type={"text"}
              inputMode={"numeric"}
              name={"salary_min"}
              placeholder={"10000"}
              value={salaryFilter}
              onChange={handleChange}
            />
          </FormItem>
          <FormItem
            top={t({
              key: "till",
              defaultValue: "До",
              language: selectedLanguage,
            })}
          >
            <Input
              onBlur={({ target }) => {
                if (
                  salaryFilter.length > 0 &&
                  !isNaN(Number(salaryFilter)) &&
                  Number(target.value) < Number(salaryFilter)
                ) {
                  setSalaryFilterMax("");
                }
              }}
              after={
                salaryFilterMax.length > 0 && (
                  <IconButton
                    style={{ borderRadius: 9 }}
                    onClick={() => {
                      setSalaryFilterMax("");
                    }}
                  >
                    <Icon24Cancel />
                  </IconButton>
                )
              }
              onChange={handleChange}
              type={"text"}
              inputMode={"numeric"}
              name={"salary_max"}
              placeholder={"30000"}
              value={salaryFilterMax}
            />
          </FormItem>
        </FormLayoutGroup>
      </FormLayout>
    </>
  );
};
