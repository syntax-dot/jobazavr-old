import { useState } from "react";
import api from "../../../modules/apiRequest";
import { useRecoilState } from "recoil";
import { getClubData } from "../../../storage/selectors/main";

export const useFormHooks = ({ toPanel }) => {
  const [data, setData] = useState({
    name: "",
    serial: "",
    number: "",
    date_of_issue: null,
    issued_by: "",
    division_code: "",
    register_address: "",
    email: "",
  });
  const [error, setError] = useState({ email: false });
  const [isLoading, setIsLoading] = useState({ submit: false, upload: false });
  const [, setClubData] = useRecoilState(getClubData);

  const handleChange = ({ target }) => {
    switch (target.name) {
      case "name":
        setData((p) => ({
          ...p,
          [target.name]: target.value.replaceAll(/[^а-яА-ЯËё -]*/g, ""),
        }));
        break;
      case "division_code":
        setData((p) => ({
          ...p,
          [target.name]: target.value.replaceAll(/[^0-9]*/g, ""),
        }));
        break;
      case "serial":
        setData((p) => ({
          ...p,
          [target.name]: target.value.replaceAll(/[^0-9]*/g, ""),
        }));
        break;
      case "number":
        setData((p) => ({
          ...p,
          [target.name]: target.value.replaceAll(/[^0-9]*/g, ""),
        }));
        break;
      default:
        setData((p) => ({
          ...p,
          [target.name]: target.value,
        }));
        break;
    }
  };

  const isEmail = (email = data.email) =>
    typeof email === "string"
      ? /[a-zA-Z]*[а-яА-ЯËё]*@[a-zA-Z]*[а-яА-ЯËё]*.[a-zA-Z]*[а-яА-ЯËё]*/g.test(
          email.trim()
        )
      : false;

  const handleEmailInputBlur = () =>
    data.email.trim().length === 0
      ? setError((p) => ({ ...p, email: false }))
      : isEmail() === true
      ? setError((p) => ({ ...p, email: false }))
      : setError((p) => ({ ...p, email: true }));

  const isAllFieldsValid = () => isEmail(data.email);

  const isNothingEmpty = () => data.email.length > 0;

  const handleSubmit = async () => {
    setIsLoading((p) => ({ ...p, submit: true }));
    try {
      const { data: responseData, statusCode } = await api(
        "club/form",
        "POST",
        {
          email: data.email,
        }
      );
      if (responseData) {
        setClubData(responseData);
        toPanel("Jclub");
      } else {
        throw new Error(statusCode);
      }
    } catch (e) {
    } finally {
      setIsLoading((p) => ({ ...p, submit: false }));
    }
  };

  const handleUpload = async (e) => {
    setIsLoading((p) => ({ ...p, upload: true }));
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("email", data.email);
    try {
      const { data: responseData, statusCode } = await api(
        "club/image",
        "POST",
        formData,
        true
      );
      if (responseData) {
        setClubData(responseData);
        toPanel("Jclub");
      } else {
        throw new Error(statusCode);
      }
    } catch (e) {
    } finally {
      setIsLoading((p) => ({ ...p, upload: false }));
    }
    e.target.files = null;
  };

  return {
    data,
    setData,
    handleChange,
    error,
    setError,
    handleEmailInputBlur,
    isAllFieldsValid,
    isNothingEmpty,
    handleSubmit,
    isLoading,
    handleUpload,
    isEmail,
  };
};
