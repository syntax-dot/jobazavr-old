import api from "../../../modules/apiRequest";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  getChangeProfile,
  getCitiesData,
  getCitizenshipsData,
  getInitData,
  getListInitDataHandler,
} from "../../../storage/selectors/main";

export const useFormHooks = () => {
  const [, setListChangeHandler] = useRecoilState(getListInitDataHandler);
  const [citiesData, setCitiesData] = useRecoilState(getCitiesData);
  const [, setChangeProfile] = useRecoilState(getChangeProfile);
  const [initData, setInitData] = useRecoilState(getInitData);
  const [changed, setChanged] = useState(false);
  const [changedSelect, setChangedSelect] = useState(false);
  const [changedCitizen, setChangedCitizen] = useState(false);
  const [mount, setMount] = useState(0);
  const [selectCity, setSelectCity] = useState(initData?.city?.id);
  const [citizenshipsData, setCitizenshipsData] =
    useRecoilState(getCitizenshipsData);
  const [subLoading, setSubLoading] = useState(false);
  const [data, setData] = useState({
    name: initData?.name,
    phone: initData?.phone,
    age: initData?.age,
    sex: initData?.sex,
    citizenship_id: initData?.citizenship?.id,
    city: initData?.city,
  });
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
    // citiesData.length === 1
    //   ? setDefaultCities(
    //       citiesDataRes.data.map((i) => ({ value: i.id, label: i.title }))
    //     )
    //   : null;
  }

  useEffect(() => {
    if (initData) {
      get();
    }

    setMount(1);
  }, []);
  return {
    handleSubmit,
    handleChange,
    initData,
    changed,
    setChanged,
    mount,
    data,
    subLoading,
    citizenshipsData,
    changedSelect,
    setChangedSelect,
    citiesData,
    setCitiesData,
    setChangedCitizen,
    changedCitizen,
    setSelectCity,
    selectCity,
  };
};
