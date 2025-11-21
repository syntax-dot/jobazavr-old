import {
  Button,
  DateInput,
  DatePicker,
  Div,
  FormItem,
  FormLayout,
  Group,
  Input,
  Placeholder,
  Separator,
} from "@vkontakte/vkui";
import {
  Icon24Camera,
  Icon24CameraOutline,
  Icon56DocumentOutline,
} from "@vkontakte/icons";
import { useState } from "react";
import { useFormHooks } from "./useFormHooks";
import api from "../../../modules/apiRequest";
import { getSelectedLanguage } from "../../../storage/selectors/main";
import { useTranslate } from "@tolgee/react";
import { useRecoilValue } from "recoil";

export const FormPanel = ({ toPanel }) => {
  const { t } = useTranslate();
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const {
    data,
    handleChange,
    error,
    setError,
    handleEmailInputBlur,
    setData,
    isAllFieldsValid,
    isNothingEmpty,
    handleSubmit,
    isLoading,
    handleUpload,
    isEmail,
  } = useFormHooks({ toPanel });

  return (
    <Group>
      <Placeholder
        className={"customPlaceholder"}
        header={t({
          key: "fill_form",
          defaultValue: "Заполните анкету",
          language: selectedLanguage,
        })}
        icon={<Icon56DocumentOutline />}
      >
        {t({
          key: "for_club_card",
          defaultValue: "Для получения карты клуба",
          language: selectedLanguage,
        })}
      </Placeholder>
      <FormItem
        top={"E-Mail"}
        status={error.email ? "error" : "default"}
        bottom={error.email ? "E-mail введён неверно." : undefined}
      >
        <Input
          onBlur={handleEmailInputBlur}
          value={data.email}
          name={"email"}
          maxLength={100}
          onChange={handleChange}
          placeholder={"email@example.com"}
          inputMode={"email"}
        />
      </FormItem>
      <Div className={"DivFix"}>
        <Button
          disabled={!isNothingEmpty() || !isAllFieldsValid()}
          className={""}
          size={"l"}
          loading={isLoading.submit}
          onClick={handleSubmit}
          stretched={true}
        >
          {t({
            key: "continue",
            defaultValue: "Продолжить",
            language: selectedLanguage,
          })}
        </Button>
      </Div>
    </Group>
  );
};

const FormItems = ({
  data,
  handleChange,
  error,
  handleEmailInputBlur,
  setData,
}) => (
  <FormLayout>
    <FormItem
      top={"E-Mail"}
      status={error.email ? "error" : "default"}
      bottom={error.email ? "E-mail введён неверно." : undefined}
    >
      <Input
        onBlur={handleEmailInputBlur}
        value={data.email}
        name={"email"}
        maxLength={100}
        onChange={handleChange}
        placeholder={"email@example.com"}
        inputMode={"email"}
      />
    </FormItem>
  </FormLayout>
);
