import {
  Icon24Bookmark,
  Icon24BookmarkOutline,
  Icon56MessageReadOutline,
} from "@vkontakte/icons";
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  Div,
  Group,
  IconButton,
  Placeholder,
  Separator,
  Text,
  Title,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRecoilState, useRecoilValue } from "recoil";
import api from "../../modules/apiRequest";
import dividePrice from "../../modules/dividePrice";
import {
  getCurrentTab,
  getFavouriteJobs,
  getInitData,
  getListPlacemarks,
  getMarksData,
  getSelectedLanguage,
  getSelectedVacancy,
  getSelectedVacancyForEdit,
  getSimillarPoints,
} from "../../storage/selectors/main";
import reactStringReplace from "react-string-replace";
import {
  tagFavouriteMarkAdd,
  tagResponseCard,
  tagSimillarButton,
} from "../../modules/tagManager";
import { T, useTranslate } from "@tolgee/react";
import CyrillicToTranslit from "cyrillic-to-translit-js";

const ShowTerms = ({ toPanel, openPage, toModal, view, toBack, toPopout }) => {
  const [, setVacancyForEdit] = useRecoilState(getSelectedVacancyForEdit);
  const { t } = useTranslate();
  const Translit = new CyrillicToTranslit({ preset: "ru" });
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const initData = useRecoilValue(getInitData);
  const [state, setState] = useState(1);
  const [, setSimillarPoints] = useRecoilState(getSimillarPoints);
  const [placemarks, setPlacemarks] = useRecoilState(getMarksData);
  const [, setListPlacemarks] = useRecoilState(getListPlacemarks);
  const selectedVacancy = useRecoilValue(getSelectedVacancy);
  const [isLoading, setIsLoading] = useState(false);
  const [favouriteMarks, setFavouriteMarks] = useRecoilState(getFavouriteJobs);
  const [, setCurrentTab] = useRecoilState(getCurrentTab);

  useEffect(() => {
    setCurrentTab("terms");
    try {
      api(`jobs/view/${selectedVacancy.id}`, "POST").then((res) =>
        console.log("thenres", res)
      );
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handleClickRemove = async () => {
    async function removeItem() {
      try {
        const { data: responseData } = await api(
          `admin/jobs/${selectedVacancy.id}`,
          "DELETE"
        );
        console.log('responseDelete', responseData)
        if (responseData) {
          setPlacemarks((p) =>
            p ? p.filter((i) => i.id !== selectedVacancy.id) : null
          );
          setListPlacemarks((p) =>
            p ? p.filter((i) => i.id !== selectedVacancy.id) : null
          );
          toPanel(view);
        } else {
          throw new Error();
        }
      } catch (e) {
        console.log(e)
        toast.error("Произошла ошибка. Попробуйте позже.");
      }
    }
    toPopout(
      <Alert
        actions={[
          {
            title: "Отмена",
            autoclose: true,
            mode: "cancel",
          },
          {
            title: "Удалить",
            autoclose: true,
            mode: "destructive",
            action: removeItem,
          },
        ]}
        actionsLayout="horizontal"
        onClose={() => toPopout()}
        header="Удаление вакансии"
        text="Вы уверены, что хотите удалить эту вакансию?"
      />
    );
  };

  const handleReply = async () => {
    if (initData?.onboarding || !initData) {
      toPanel("register");
      tagResponseCard();
      await api("events", "POST", {
        event_key: "response",
        event_data: JSON.stringify({ card_id: selectedVacancy.id }),
      });
      return;
    }
    setIsLoading(true);
    tagResponseCard();

    try {
      const { data: resData, message: messageRes } = await api(
        `jobs/reply/${selectedVacancy.id}`,
        "POST"
      );
      if (resData) {
        await api("events", "POST", {
          event_key: "response",
          event_data: JSON.stringify({ card_id: selectedVacancy.id }),
        });
        setFavouriteMarks((prevState) => [
          { ...selectedVacancy, replied: true },
          ...prevState.filter((i) => i.id !== selectedVacancy.id),
        ]);
        setState(2);
      } else {
        if (messageRes) {
          if (messageRes === "ThrottlerException: Too Many Requests")
            toast.error("Превышен лимит запросов. Пожалуйста, подождите");
          if (messageRes === "already responded")
            toast.error("Заявка уже была отправлена");
          if (messageRes === "access denied") toPanel("register");
        }
      }
    } catch (e) {
      console.log(e);
      toast.error("Произошла ошибка. Пожалуйста, попробуйте позже.");
    }

    setIsLoading(false);
  };

  const handleClickSimmilar = () => {
    tagSimillarButton();
    const filtered = placemarks.filter(
      (i) =>
        selectedVacancy.description === i.description &&
        i.id !== selectedVacancy.id
    );
    setSimillarPoints(filtered);
    toPanel("showSimmilar");
  };

  useEffect(async () => {
    await api("events", "POST", {
      event_key: "openCard",
      event_data: JSON.stringify({ card_id: selectedVacancy.id }),
    });
  }, []);

  const handleClickBookmark = async () => {
    if (favouriteMarks.some((i) => i.id === selectedVacancy.id)) {
      setFavouriteMarks((prevState) =>
        prevState.filter((i) => i.id !== selectedVacancy.id)
      );
      const { data: resData } = await api(
        `jobs/favorites/${selectedVacancy.id}`,
        "DELETE"
      );
      if (!resData) {
        toast.error("Произошла ошибка. Попробуйте позже");
      } else {
      }
    } else {
      tagFavouriteMarkAdd();
      setFavouriteMarks((prevState) => [...prevState, selectedVacancy]);
      const { data: resData } = await api(
        `jobs/favorites/${selectedVacancy.id}`,
        "POST"
      );

      if (!resData) {
        toast.error("Произошла ошибка. Попробуйте позже.");
      } else {
      }
    }
  };

  const handleClickEdit = () => {
    setVacancyForEdit(selectedVacancy);
    toPanel("editVacancy");
  };
  return (
    <>
      {state === 1 ? (
        <>
          {selectedVacancy && (
            <Group separator="hide">
              <Div className="DivFix">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Title level="2" className="flex aic" style={{ gap: 5 }}>
                    {selectedVacancy.title}
                  </Title>
                  <Title level="2" style={{ whiteSpace: "nowrap" }}>
                    {dividePrice(selectedVacancy.salary)}
                  </Title>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    margintop: 10,
                  }}
                >
                  <div className="">
                    <Text weight="2">{selectedVacancy.description}</Text>

                    <Text
                      className="addressText"
                      style={{ marginBottom: 5, marginTop: 0 }}
                    >
                      {selectedLanguage === "en" || selectedVacancy === "uz"
                        ? Translit.transform(selectedVacancy.address)
                        : selectedVacancy.address}
                    </Text>
                  </div>
                  {!favouriteMarks.some(
                    (i) => i.id === selectedVacancy.id && i.replied
                  ) && (
                    <Card mode="tint mt5">
                      <IconButton
                        className="markbtn"
                        style={{ borderRadius: 8 }}
                      >
                        {favouriteMarks.some(
                          (i) => i.id === selectedVacancy.id
                        ) ? (
                          <Icon24Bookmark
                            onClick={handleClickBookmark}
                            className="tap icon"
                          />
                        ) : (
                          <Icon24BookmarkOutline
                            onClick={handleClickBookmark}
                            className="tap icon"
                          />
                        )}
                      </IconButton>
                    </Card>
                  )}
                </div>
                <Separator wide style={{ marginBlock: 8 }} />

                <Text weight="3" style={{ whiteSpace: "pre-wrap" }}>
                  <span style={{ fontWeight: 600 }}>
                    <T keyName={"schedule"} language={selectedLanguage}>
                      График работы
                    </T>
                    :
                  </span>
                  <br />
                  {reactStringReplace(
                    selectedVacancy.terms,
                    "Обязанности:",
                    (match, i) => {
                      return (
                        <span style={{ fontWeight: 600 }}>
                          <T keyName={"obyazs"} language={selectedLanguage}>
                            Обязанности
                          </T>
                          :
                        </span>
                      );
                    }
                  )}
                </Text>
                <ButtonGroup mode="vertical" stretched>
                  <Button
                    size="l"
                    loading={isLoading}
                    appearance="positive"
                    onClick={handleReply}
                    stretched
                    disabled={isLoading}
                    style={{ marginTop: 15 }}
                  >
                    <T keyName={"otclick"} language={selectedLanguage}>
                      Откликнуться
                    </T>
                  </Button>
                  {!selectedVacancy.favourite && (
                    <Button
                      size="l"
                      stretched
                      appearance="neutral"
                      mode="secondary"
                      className="simbtn"
                      onClick={handleClickSimmilar}
                      style={{ marginTop: 10 }}
                    >
                      <T keyName={"simillar_vacs"} language={selectedLanguage}>
                        Похожие вакансии
                      </T>
                    </Button>
                  )}
                  {initData && initData?.is_admin ? (
                    <Button
                      size="l"
                      stretched
                      appearance="neutral"
                      mode="secondary"
                      className="simbtn"
                      onClick={handleClickEdit}
                      style={{ marginTop: 10 }}
                    >
                      Внести изменения [ Админ-Панель ]
                    </Button>
                  ) : null}
                  {initData && initData?.is_admin ? (
                    <Button
                      size="l"
                      stretched
                      appearance="negative"
                      className="simbtn"
                      onClick={handleClickRemove}
                      style={{ marginTop: 10, marginBottom: 10 }}
                    >
                      Удалить вакансию [ Админ-Панель ]
                    </Button>
                  ) : null}
                </ButtonGroup>
              </Div>
            </Group>
          )}
        </>
      ) : (
        <>
          <Group separator="hide">
            <Placeholder
              className="customPlaceholder"
              icon={<Icon56MessageReadOutline className="icon" />}
              header={t({
                key: "account_info_send",
                defaultValue: "Ваша заявка отправлена",
                language: selectedLanguage,
              })}
              stretched
            >
              {t({
                key: "wait_until_check",
                defaultValue:
                  "Пожалуйста, немного подождите, пока работодатель её проверит.",
                language: selectedLanguage,
              })}
              <Button
                style={{ marginTop: 15 }}
                size="l"
                stretched
                onClick={() => openPage("map", "map")}
              >
                {t({
                  key: "go_card",
                  defaultValue: "Перейти к карте",
                  language: selectedLanguage,
                })}
              </Button>
            </Placeholder>
          </Group>
        </>
      )}
    </>
  );
};

export default ShowTerms;
