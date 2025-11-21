import {
  Button,
  DateInput,
  Div,
  FormItem,
  FormLayout,
  Input,
  Placeholder,
} from "@vkontakte/vkui";
import { Icon56DocumentOutline } from "@vkontakte/icons";
import { useFormHooks } from "./useFormHooks";
import { useTranslate } from "@tolgee/react";
import { useRecoilValue } from "recoil";
import { getSelectedLanguage } from "../../../storage/selectors/main";

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
    <>
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
      {/*<Div className={"DivFix"}>*/}
      {/*  <label*/}
      {/*    style={{ position: "relative" }}*/}
      {/*    className={"upload-label"}*/}
      {/*    htmlFor={"upload"}*/}
      {/*  >*/}
      {/*    <Button*/}
      {/*      appearance={"positive"}*/}
      {/*      size={"m"}*/}
      {/*      stretched={true}*/}
      {/*      loading={isLoading.upload}*/}
      {/*      disabled={*/}
      {/*        data.email.trim().length === 0 || error.email || !isEmail()*/}
      {/*      }*/}
      {/*      className={""}*/}
      {/*      after={<Icon24Camera />}*/}
      {/*    >*/}
      {/*      Загрузить с помощью фото*/}
      {/*      {!isLoading.upload &&*/}
      {/*        !(*/}
      {/*          data.email.trim().length === 0 ||*/}
      {/*          error.email ||*/}
      {/*          !isEmail()*/}
      {/*        ) && (*/}
      {/*          <input*/}
      {/*            accept="image/png, image/jpeg, image/jpg, image/webp"*/}
      {/*            onChange={handleUpload}*/}
      {/*            style={{*/}
      {/*              width: "100%",*/}
      {/*              height: "100%",*/}
      {/*              left: 0,*/}
      {/*              top: 0,*/}
      {/*              opacity: 0,*/}
      {/*              position: "absolute",*/}
      {/*            }}*/}
      {/*            id={"upload"}*/}
      {/*            type={"file"}*/}
      {/*            name={"upload"}*/}
      {/*          />*/}
      {/*        )}*/}
      {/*    </Button>*/}
      {/*  </label>*/}
      {/*</Div>*/}
      {/*<Separator />*/}
      {/*<FormItems*/}
      {/*  {...{*/}
      {/*    data,*/}
      {/*    handleChange,*/}
      {/*    error,*/}
      {/*    handleEmailInputBlur,*/}
      {/*    setData,*/}
      {/*  }}*/}
      {/*/>*/}
      <Div className={"DivFix"}>
        <Button
          disabled={!isNothingEmpty() || !isAllFieldsValid()}
          className={"mt10"}
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
    </>
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
    <FormItem top={"Фамилия, Имя, Отчество"}>
      <Input
        value={data.name}
        name={"name"}
        maxLength={28}
        onChange={handleChange}
        placeholder={"Иванов Иван Иванович"}
      />
    </FormItem>
    <FormItem top={"Серия паспорта"}>
      <Input
        value={data.serial}
        inputMode={"numeric"}
        maxLength={4}
        name={"serial"}
        onChange={handleChange}
        placeholder={"1234"}
      />
    </FormItem>
    <FormItem top={"Номер паспорта"}>
      <Input
        value={data.number}
        name={"number"}
        inputMode={"numeric"}
        maxLength={6}
        onChange={handleChange}
        placeholder={"123456"}
      />
    </FormItem>
    <FormItem top={"Дата выдачи"}>
      <DateInput
        disableFuture={true}
        value={data.date_of_issue}
        name={"date_of_issue"}
        onChange={(val) => setData((p) => ({ ...p, date_of_issue: val }))}
        placeholder={"123456"}
      />
    </FormItem>
    <FormItem top={"Кем выдан"}>
      <Input
        value={data.issued_by}
        name={"issued_by"}
        maxLength={100}
        type={"text"}
        onChange={handleChange}
        placeholder={"ГУ МВД..."}
        inputMode={"text"}
      />
    </FormItem>
    <FormItem top={"Код подразделения"}>
      <Input
        value={data.division_code}
        name={"division_code"}
        maxLength={6}
        onChange={handleChange}
        placeholder={"123456"}
        type={"text"}
        inputMode={"numeric"}
      />
    </FormItem>
    <FormItem top={"Адрес регистрации"}>
      <Input
        value={data.register_address}
        name={"register_address"}
        maxLength={100}
        onChange={handleChange}
        placeholder={"г. Москва, ул. Ленина, д. 1"}
      />
    </FormItem>
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
