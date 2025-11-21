import {
  Icon16CopyOutline,
  Icon20ArticleOutline,
  Icon20CakeOutline,
  Icon20CalendarOutline,
  Icon20CommunityName,
  Icon20CopyOutline,
  Icon20Phone,
  Icon20PinOutline,
  Icon20RoubleOutline,
  Icon28UploadOutline,
  Icon56DownloadOutline,
  Icon56GalleryOutline,
  Icon56ServicesOutline,
  Icon56VideoOutline,
} from "@vkontakte/icons";
import {
  Button,
  Caption,
  Card,
  Div,
  File,
  FormItem,
  FormLayout,
  Group,
  Header,
  Headline,
  Input,
  Link,
  MiniInfoCell,
  Placeholder,
  Spacing,
  Tabbar,
  Tabs,
  TabsItem,
  Title,
} from "@vkontakte/vkui";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRecoilValue } from "recoil";
import api from "../../modules/apiRequest";
import { getIsDesktop } from "../../storage/selectors/main";
import bridge from "@vkontakte/vk-bridge";

const AdminPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isDesktop = useRecoilValue(getIsDesktop);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState("");
  const [select, setSelect] = useState(1);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [employerName, setEmployerName] = useState('')
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)

  const handleDeleteVacancies = async () => {
    try {
      setIsLoadingDelete(true)
      const {data: responseData, errorCode} = await api('admin/jobs', "DELETE", {title: employerName})
      if(responseData){
        toast.success('Вакансии удалены')
      }else if(errorCode === 1){
        toast.error('Вакансии у этого работодателя не найдены')
      } else {
        toast.error(`Произошла ошибка.${errorCode ? ' Код ошибки: ' + `${errorCode}` : ''}`)
      }
    }catch (e) {
      toast.error('Произошла ошибка')
    }finally {
      setIsLoadingDelete(false)
    }
  }
  async function handleDownload() {
    setIsLoading(true);
    const { data } = await api("admin/replies", "POST");
    if (data) {
      if (isDesktop) {
        window
          .open(
            data +
              "?" +
              window.location.href
                .slice(window.location.href.indexOf("?") + 1)
                .split("#")[0],
            "_blank"
          )
          .focus();
      } else {
        try {
          const { result } = await bridge.send("VKWebAppCopyText", {
            text:
              data +
              "?" +
              window.location.href
                .slice(window.location.href.indexOf("?") + 1)
                .split("#")[0],
          });
          if (result) {
            toast.success("Ссылка на файл скопирована в буфер обмена");
          } else {
            toast.error("Ссылка на файл не скопирована в буфер обмена");
          }
        } catch (error) {
          toast.error("Ссылка на файл не скопирована в буфер обмена");
        }
      }
    } else {
      toast.error("Произошла ошибка. Попробуйте позже");
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  const uploadPhoto = async (e) => {
    setIsLoadingPhoto(true);

    for (let index = 0; index < e.target.files.length; index++) {
      const formData = new FormData();
      formData.append("file", e.target.files[index]);
      try {
        const { data: uploadData, message: uploadMessage } = await api(
          "admin/parser",
          "POST",
          formData,
          true
        );
        if (uploadMessage) {
          toast.error("Произошла ошибка. Попробуйте прикрепить другой файл");
        } else {
          setUploaded(true);
          toast.success("Успешно. Ожидайте 1-2 минуты до загрузки данных");
        }
      } catch (e) {
        toast.error("Произошла ошибка. Попробуйте прикрепить другой файл");
      }
    }

    setIsLoadingPhoto(false);
    e.target.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: resData, message: errorMessage } = await api(
      `admin/user/${userId}`
    );
    if (resData) {
      setUserData(resData);
    } else {
      if (errorMessage) {
        toast.error("Произошла ошибка. Превышен лимит запросов");
      } else {
        toast.error("Пользователь не найден");
      }
    }
  };

  const handleCopy = async () => {
    try {
      const { result } = await bridge.send("VKWebAppCopyText", {
        text: userData.user.phone,
      });
      if (result) {
        toast.success("Номер телефона скопирован в буфер обмена");
      } else {
        toast.error("Номер телефона не скопирован в буфер обмена");
      }
    } catch (error) {
      toast.error("Номер телефона не скопирован в буфер обмена");
    }
  };
  return (
    <>
      <>
        <Group separator="hide">
          <Placeholder
            icon={<Icon56ServicesOutline className="icon" />}
            className="adminPlaceholder"
            header="Удаление вакансий"
          >
            Удалите все вакансии работодателя, введя его имя
          </Placeholder>
        </Group>
        <Spacing size={12} />
        {select === 1 && (
          <>
            <Group
              separator="hide"
            >
              <FormItem top={'Имя работодателя'}>
                <Input value={employerName} onChange={({target}) => setEmployerName(target.value)} placeholder={'Fix Price'} maxLength={100} />
              </FormItem>
              <Div className="DivFix">
                <Button
                    disabled={employerName.trim().length === 0}
                  stretched
                  size="l"
                  mode={'destructive'}
                  loading={isLoadingDelete}
                  onClick={() => employerName.trim().length === 0 || isLoadingDelete ? null :handleDeleteVacancies()}
                >
                  Удалить вакансии
                </Button>
              </Div>
            </Group>
          </>
        )}
        {select === 2 && (
          <>
            <Group separator="hide">
              <FormLayout onSubmit={handleSubmit}>
                <FormItem top="ID Пользователя ВКонтакте">
                  <Input
                    onChange={({ target }) => setUserId(target.value)}
                    placeholder="123456789"
                    type={"number"}
                    inputMode="numeric"
                  />
                </FormItem>
                <Div className="DivFix">
                  <Button
                    disabled={userId.trim().length === 0}
                    className="blackBtn"
                    type="submit"
                    stretched
                    size="l"
                  >
                    Далее
                  </Button>
                </Div>
              </FormLayout>
            </Group>
            <Spacing size={12} />
            {userData && (
              <Group separator="hide">
                <Div className="DivFix">
                  <Title weight="2" level="3" className="mb5">
                    {userData.user.name}
                  </Title>
                  <MiniInfoCell before={<Icon20CakeOutline />}>
                    Возраст: {userData.user.age}
                  </MiniInfoCell>
                  <MiniInfoCell before={<Icon20Phone />}>
                    <div className="flex aie">
                      Телефон:{" "}
                      <Link
                        style={{ marginLeft: 5, marginRight: 3 }}
                        onClick={handleCopy}
                      >
                        {userData.user.phone}
                      </Link>{" "}
                      <Icon16CopyOutline />
                    </div>
                  </MiniInfoCell>
                  <MiniInfoCell before={<Icon20CommunityName />}>
                    Гражданство: {userData.user.citizenship.title}
                  </MiniInfoCell>
                  {userData.replies.length !== 0 && (
                    <>
                      <Header mode="secondary" style={{ paddingLeft: 0 }}>
                        Отклики
                      </Header>
                      {userData.replies.map((rep) => (
                        <Card key={rep.id} mode="outline mt10 mb10">
                          <Div className="DivFix">
                            <MiniInfoCell before={<Icon20PinOutline />}>
                              {rep.city}
                            </MiniInfoCell>
                            <MiniInfoCell before={<Icon20CalendarOutline />}>
                              {new Date(rep.created_at * 1000).toLocaleString(
                                "ru",
                                {
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </MiniInfoCell>
                            <MiniInfoCell before={<Icon20ArticleOutline />}>
                              {rep.title}
                            </MiniInfoCell>
                            <MiniInfoCell before={<Icon20ArticleOutline />}>
                              {rep.description}
                            </MiniInfoCell>
                            <MiniInfoCell before={<Icon20RoubleOutline />}>
                              {rep.salary} ₽
                            </MiniInfoCell>
                          </Div>
                        </Card>
                      ))}
                    </>
                  )}
                </Div>
              </Group>
            )}
          </>
        )}
      </>
    </>
  );
};

export default AdminPanel;
