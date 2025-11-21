import { Button } from "@vkontakte/vkui";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRecoilState, useRecoilValue } from "recoil";
import api from "../../modules/apiRequest";
import {
  getDataForPatch,
  getInitData,
  getRegisterPhone,
  getTgWindowOpened,
} from "../../storage/selectors/main";

const PhoneRequest = ({ close }) => {
  const initData = useRecoilValue(getInitData);
  const [, setTgWindowOpened] = useRecoilState(getTgWindowOpened);
  const data = useRecoilValue(getDataForPatch);
  const [, setRegisterPhone] = useRecoilState(getRegisterPhone);
  const handleClick = async () => {
    if (initData.phone) {
      setRegisterPhone(true);
      close();
      return;
    }
    try {
      const dataToPatch = {};
      if (data.name?.length > 0) dataToPatch.name = data.name;
      if (data.age?.toString().length > 0) dataToPatch.age = parseInt(data.age);
      if (data.sex?.toString().length > 0) dataToPatch.sex = parseInt(data.sex);
      if (data.city?.toString().length > 0)
        dataToPatch.city_id = parseInt(data.city);
      if (data.citizenship_id?.toString().length > 0)
        dataToPatch.citizenship_id = parseInt(data.citizenship_id);
      const { data: resData, message: errorMesasge } = await api(
        "profile",
        "PATCH",
        dataToPatch
      );
      // if (resData) {
      //
      //

      //
      // } else if (errorMesasge) {
      //   if (errorMesasge.includes("age must not be less than 18")) {
      //     toast.error("Необходим возраст старше 18 лет.");
      //   } else if (
      //     errorMesasge.includes("phone must be a valid phone number")
      //   ) {
      //     toast.error("Введите корректный номер телефона.");
      //   } else {
      //     toast.error("Произошла ошибка, пожалуйста, попробуйте позже.");
      //   }
      // } else {
      //   toast.error("Произошла ошибка, пожалуйста, попробуйте позже.");
      // }
    } catch (error) {
      console.log(error);
      // toast.error("Произошла ошибка. Пожалуйста, попробуйте позже");
    }
    try {
      await api("bot/phone", "POST");
      window.Telegram.WebApp.close();
    } catch (error) {}
  };

  useEffect(() => {
    return () => {
      setTgWindowOpened(true);
    };
  }, []);
  return (
    <>
      <Button onClick={handleClick} className="mt10" stretched size="l">
        Автозаполнить номер
      </Button>
    </>
  );
};

export default PhoneRequest;
