import {
  Icon28InfoCircleOutline,
  Icon56ListBulletSquareOutline,
} from "@vkontakte/icons";
import {
  Avatar,
  Button,
  Card,
  Div,
  Group,
  Headline,
  Placeholder,
  RichCell,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import declOfNum from "../../modules/declOfNum";
import distance from "../../modules/distance";
import dividePrice from "../../modules/dividePrice";
import {
  getCurrentTab,
  getIsDesktop,
  getMarksData,
  getNearestData,
  getPlaceData,
  getSelectedLanguage,
  getSimillarPoints,
  getStateCoords,
} from "../../storage/selectors/main";
import { T, useTranslate } from "@tolgee/react";
import CyrillicToTranslit from "cyrillic-to-translit-js";

const ShowSimmilar = ({ toPanel, activeView }) => {
  const Tranlist = new CyrillicToTranslit({ preset: "ru" });
  const { t } = useTranslate();
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const isDesktop = useRecoilValue(getIsDesktop);
  const simillarPoints = useRecoilValue(getSimillarPoints);
  const [, setState] = useState(1);
  const [, setStateCoords] = useRecoilState(getStateCoords);
  const [, setPlaceData] = useRecoilState(getPlaceData);
  const placemarks = useRecoilValue(getMarksData);
  const [, setNearest] = useRecoilState(getNearestData);
  const [, setCurrentTab] = useRecoilState(getCurrentTab);

  useEffect(() => setCurrentTab("simillar"), []);

  const handleClickMark = async (mark) => {
    setStateCoords([mark.latitude, mark.longitude]);
    const mappedData = placemarks.map((i, index) => [
      distance(mark.latitude, mark.longitude, i.latitude, i.longitude),
      index,
    ]);
    const sorted = mappedData
      .sort((a, b) => a[0] - b[0])
      .filter((i) => i[0] <= 0.001);
    setNearest(sorted.map((i) => placemarks[i[1]]));
    setPlaceData(mark);
    setState(1);
    if (activeView === "map") {
      toPanel("map");
      const time = setTimeout(() => {
        toPanel("showWork");
        return clearTimeout(time);
      }, 700);
    } else {
      toPanel("showWork");
    }
  };
  return (
    <>
      {simillarPoints.length !== 0 && (
        <Group separator="hide">
          <Div className="DivFix">
            <Placeholder
              icon={<Icon56ListBulletSquareOutline className="icon" />}
              className="customPlaceholder"
              header={
                <T keyName={"list_of_similar"} language={selectedLanguage}>
                  Список похожих объявлений
                </T>
              }
            >
              {t({
                key: "we_suggest",
                defaultValue: "Мы подобрали",
                language: selectedLanguage,
              })}{" "}
              {declOfNum(simillarPoints.length, [
                t({
                  key: "announc_1",
                  defaultValue: "объявление, похожее",
                  language: selectedLanguage,
                }).toLowerCase() + " ",
                t({
                  key: "announc_2",
                  defaultValue: "объявления, похожих",
                  language: selectedLanguage,
                }).toLowerCase() + " ",
                t({
                  key: "announc_3",
                  defaultValue: "объявлений, похожих",
                  language: selectedLanguage,
                }).toLowerCase() + " ",
              ])}
              {t({
                key: "on_rev_nby",
                defaultValue: "на предыдущее, неподалёку",
                language: selectedLanguage,
              }).toLowerCase()}
            </Placeholder>
            {simillarPoints.map((point) => (
              <Card
                mode="outline tap mb10"
                onClick={() => handleClickMark(point)}
              >
                <RichCell
                  multiline
                  style={{ borderRadius: 12 }}
                  before={
                    point.avatar ? (
                      <Avatar size={28} src={point.avatar} mode="app" />
                    ) : (
                      <Icon28InfoCircleOutline />
                    )
                  }
                  onClick={() => null}
                  children={
                    <Headline level="1" weight="1">
                      {point.title}
                    </Headline>
                  }
                  text={point.description}
                  after={
                    <Headline level="1" weight="1">
                      {dividePrice(point.salary)}
                    </Headline>
                  }
                  caption={
                    selectedLanguage === "uz" || selectedLanguage === "en"
                      ? Tranlist.transform(point.address)
                      : point.address
                  }
                />
              </Card>
            ))}
          </Div>
        </Group>
      )}
      {simillarPoints.length === 0 && (
        <Group separator="hide">
          <Div className="DivFix">
            <Placeholder
              stretched
              icon={<Icon56ListBulletSquareOutline className="icon" />}
              className="customPlaceholder"
              header={t({
                key: "empty_simillar",
                defaultValue: "Список похожих объявлений пуст",
                language: selectedLanguage,
              })}
            >
              {t({
                key: "return_map_similar",
                defaultValue:
                  "Кажется, в вашем городе нет похожих объявлений. Вернитесь к карте для продолжения поиска работы",
                language: selectedLanguage,
              })}
              <Button
                style={{ marginTop: 20 }}
                stretched
                size="l"
                onClick={() => toPanel("map")}
              >
                {t({
                  key: "go_card",
                  defaultValue: "Перейти к карте",
                  language: selectedLanguage,
                })}
              </Button>
            </Placeholder>
          </Div>
        </Group>
      )}
    </>
  );
};

export default ShowSimmilar;
