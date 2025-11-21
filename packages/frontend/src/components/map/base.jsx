import React, { useEffect, useMemo } from "react";
import {
  YMaps,
  Map,
  Placemark,
  GeolocationControl,
  ObjectManager,
  withYMaps,
  Clusterer,
} from "@pbe/react-yandex-maps";
import bridge from "@vkontakte/vk-bridge";
import { useState } from "react";
import {
  Button,
  Card,
  Div,
  FixedLayout,
  Group,
  IconButton,
  PanelSpinner,
} from "@vkontakte/vkui";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getAppType,
  getChangeProfile,
  getClickedLocation,
  getClickedOnWorkplace,
  getCurrentTab,
  getCurrentView,
  getFavouriteJobs,
  getInitData,
  getIsDesktop,
  getLastGeolocation,
  getMapData,
  getMapFilterQuery,
  getMarksData,
  getMockMarks,
  getNearestData,
  getPlaceData,
  getSelectedCity,
  getSelectedLanguage,
  getStateCoords,
  getZoom,
} from "../../storage/selectors/main";
import api from "../../modules/apiRequest";
import jobazavrIcon from "../../assets/images/logo.png";
import distance from "../../modules/distance";
import dividePrice from "../../modules/dividePrice";
import { toast, Toaster } from "react-hot-toast";
import { useRef } from "react";
import { useCallback } from "react";
import {
  Icon24LocationOutline,
  Icon24LogoVk,
  Icon28LocationOutline,
} from "@vkontakte/icons";
import { tagLogoOnMap } from "../../modules/tagManager";
import { useTranslate } from "@tolgee/react";

const MapPanel = ({ toPanel, rhooks, activeModal }) => {
  const { t } = useTranslate();
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const [changeProfile, setChangeProfile] = useRecoilState(getChangeProfile);
  const [data, setData] = useRecoilState(getMapData);
  const [stateCoords, setStateCoords] = useRecoilState(getStateCoords);
  const [placemarks, setPlacemarks] = useRecoilState(getMarksData);
  const [, setPlaceData] = useRecoilState(getPlaceData);
  const [, setNearest] = useRecoilState(getNearestData);
  const [initData, setInitData] = useRecoilState(getInitData);
  const [favouiteJobs, setFavouriteJobs] = useRecoilState(getFavouriteJobs);
  const platformType = localStorage.getItem("platformType");
  const isDesktop = useRecoilValue(getIsDesktop);
  const [zoom, setZoom] = useRecoilState(getZoom);
  const [, setMockMarks] = useRecoilState(getMockMarks);
  const [, setCurrentTab] = useRecoilState(getCurrentView);
  const mapFilterQuery = useRecoilValue(getMapFilterQuery);
  const selectedCity = useRecoilValue(getSelectedCity);
  const [clickedOnWorkplace, setClickedOnWorkplace] = useRecoilState(
    getClickedOnWorkplace
  );
  const [actualMapRef, setActualMapRef] = useState(null);
  useEffect(() => {
    setCurrentTab("map");
  }, []);
  const newMapsRef = useRef(null);

  // GeoControl
  const [lastGeoLocation, setLastGeolocation] =
    useRecoilState(getLastGeolocation);

  async function get() {
    if (!clickedOnWorkplace) {
      if (selectedCity) {
        let resData;
        !placemarks || changeProfile
          ? (resData = await api(
              `jobs/nearby?latitude=${selectedCity.latitude}&longitude=${
                selectedCity.longitude
              }&radius=0.2&limit=200&offset=0${
                mapFilterQuery ? `${mapFilterQuery}` : ""
              }`
            ))
          : null;
        !placemarks || changeProfile ? setPlacemarks(resData.data) : null;
        !placemarks || changeProfile ? setMockMarks(resData.data) : null;
        setStateCoords([selectedCity.latitude, selectedCity.longitude]);
        setData({
          lat: selectedCity.latitude,
          long: selectedCity.longitude,
        });
        setChangeProfile(false);
        if (!favouiteJobs) {
          try {
            const { data: favoriteData } = await api("jobs/favorites");
            if (favoriteData) {
              setFavouriteJobs(favoriteData);
            } else {
              setFavouriteJobs([]);
            }
          } catch (error) {
            setFavouriteJobs([]);
          }
        }
        return;
      }
      if (platformType === "vk") {
        if (initData.onboarding) {
          let latitude;
          let longitude;

          setData({
            lat: 55.75583,
            long: 37.61778,
          });
          setStateCoords([55.75583, 37.61778]);
          latitude = 55.75583;
          longitude = 37.61778;

          let resData;
          !placemarks || changeProfile
            ? (resData = await api(
                `jobs/nearby?latitude=${latitude}&longitude=${longitude}&radius=0.2&limit=200&offset=0`
              ))
            : null;
          !placemarks || changeProfile ? setPlacemarks(resData.data) : null;
          setMockMarks(resData.data);
          setChangeProfile(false);
          if (!favouiteJobs) {
            try {
              const { data: favoriteData } = await api("jobs/favorites");
              if (favoriteData) {
                setFavouriteJobs(favoriteData);
              } else {
                setFavouriteJobs([]);
              }
            } catch (error) {
              setFavouriteJobs([]);
            }
          }
        } else {
          if (stateCoords.length !== 0 && changeProfile !== true) {
            setData(stateCoords);
            return;
          }
          let latitude;
          let longitude;

          setData({
            lat: initData.city.latitude,
            long: initData.city.longitude,
          });
          setStateCoords([initData.city.latitude, initData.city.longitude]);
          latitude = initData.city.latitude;
          longitude = initData.city.longitude;

          let resData;
          !placemarks || changeProfile
            ? (resData = await api(
                `jobs/nearby?latitude=${latitude}&longitude=${longitude}&radius=0.2&limit=200&offset=0`
              ))
            : null;
          !placemarks || changeProfile ? setPlacemarks(resData.data) : null;
          setChangeProfile(false);
          if (!favouiteJobs) {
            try {
              const { data: favoriteData } = await api("jobs/favorites");
              if (favoriteData) {
                setFavouriteJobs(favoriteData);
              } else {
                setFavouriteJobs([]);
              }
            } catch (error) {
              setFavouriteJobs([]);
            }
          }
        }
      } else {
        if (initData.onboarding) {
          let latitude;
          let longitude;

          setData({
            lat: 55.75583,
            long: 37.61778,
          });
          setStateCoords([55.75583, 37.61778]);
          latitude = 55.75583;
          longitude = 37.61778;

          let resData;
          !placemarks || changeProfile
            ? (resData = await api(
                `jobs/nearby?latitude=${latitude}&longitude=${longitude}&radius=0.2&limit=200&offset=0${
                  mapFilterQuery ? `${mapFilterQuery}` : ""
                }`
              ))
            : null;
          !placemarks || changeProfile ? setPlacemarks(resData.data) : null;
          setMockMarks(resData.data);
          setChangeProfile(false);
          if (!favouiteJobs) {
            try {
              const { data: favoriteData } = await api("jobs/favorites");
              if (favoriteData) {
                setFavouriteJobs(favoriteData);
              } else {
                setFavouriteJobs([]);
              }
            } catch (error) {
              setFavouriteJobs([]);
            }
          }
        } else {
          if (stateCoords.length !== 0 && changeProfile !== true) {
            setData(stateCoords);
            return;
          }
          let latitude;
          let longitude;

          setData({
            lat: initData.city.latitude,
            long: initData.city.longitude,
          });
          setStateCoords([initData.city.latitude, initData.city.longitude]);
          latitude = initData.city.latitude;
          longitude = initData.city.longitude;
          let resData;
          !placemarks || changeProfile
            ? (resData = await api(
                `jobs/nearby?latitude=${latitude}&longitude=${longitude}&radius=0.2&limit=200&offset=0${
                  mapFilterQuery ? `${mapFilterQuery}` : ""
                }`
              ))
            : null;
          !placemarks || changeProfile ? setPlacemarks(resData.data) : null;

          setChangeProfile(false);
          if (!favouiteJobs) {
            try {
              const { data: favoriteData } = await api("jobs/favorites");
              if (favoriteData) {
                setFavouriteJobs(favoriteData);
              } else {
                setFavouriteJobs([]);
              }
            } catch (error) {
              setFavouriteJobs([]);
            }
          }
        }
      }
    }
  }

  const callbackFunc = (event) => {
    if (event.originalEvent.newZoom <= 7) {
      handleChangeRef(
        event.get("newCenter")[0],
        event.get("newCenter")[1],
        true,
        event.originalEvent.newZoom
      );
    } else {
      handleChangeRef(
        event.get("newCenter")[0],
        event.get("newCenter")[1],
        false,
        event.originalEvent.newZoom
      );
    }
  };

  const mapsRef = useCallback((newMapsRef) => {
    setActualMapRef(newMapsRef);
  }, []);

  useEffect(() => {
    console.log(platformType);
    if (actualMapRef) {
      actualMapRef.events.add("boundschange", callbackFunc);

      return () => actualMapRef.events.remove("boundschange", callbackFunc);
    }
  }, [mapFilterQuery, newMapsRef.current, actualMapRef, activeModal]);

  const handleChangeRef = async (
    latitude,
    longitude,
    param = false,
    zoom = 12
  ) => {
    setZoom(zoom);

    setStateCoords([latitude, longitude]);
    try {
      const { data: resData } = await api(
        `jobs/nearby?latitude=${latitude}&longitude=${longitude}&radius=${
          param === false ? "0.2" : "10"
        }&limit=${
          zoom >= 12 ? "150" : zoom < 12 && zoom >= 6 ? "200" : "250"
        }&offset=0${mapFilterQuery ? `${mapFilterQuery}` : ""}`
      );
      if (resData) {
        setPlacemarks(resData);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (selectedCity) {
      const to = setTimeout(() => {
        handleChangeRef(
          Number(selectedCity.latitude),
          Number(selectedCity.longitude)
        );
      }, 800);
      return () => clearTimeout(to);
    }
  }, [selectedCity]);

  const handleClickMark = async (mark) => {
    tagLogoOnMap();
    const mappedData = placemarks.map((i, index) => [
      distance(mark.latitude, mark.longitude, i.latitude, i.longitude),
      index,
    ]);
    const sorted = mappedData
      .sort((a, b) => a[0] - b[0])
      .filter((i) => i[0] <= 0.001);
    setNearest(sorted.map((i) => placemarks[i[1]]));

    setPlaceData(mark);
    setStateCoords([mark.latitude, mark.longitude]);
    setClickedOnWorkplace(true);
    toPanel("showWork");
  };

  useEffect(() => {
    get();
  }, [initData]);

  async function handleLocationClick() {
    if (platformType === "vk") {
      let latitude;
      let longitude;
      try {
        const { lat, long } = await bridge.send("VKWebAppGetGeodata");
        if (lat) {
          setData({ lat: lat, long: long });
          setStateCoords([lat, long]);
          latitude = lat;
          longitude = long;
          setLastGeolocation([lat, long]);
          const { data: responseData } = await api(
            `jobs/nearby?latitude=${latitude}&longitude=${longitude}&radius=0.2&limit=200&offset=0${
              mapFilterQuery ? `${mapFilterQuery}` : ""
            }`
          );
          if (responseData) {
            setPlacemarks(responseData);
          }
        } else {
          toast.error("Разрешите приложению доступ к геолокации в настройках.");
          setLastGeolocation(null);
        }
      } catch (e) {
        toast.error("Разрешите приложению доступ к геолокации в настройках.");
        setLastGeolocation(null);
      }
    } else {
      let latitude;
      let longitude;
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setData({
            lat: pos.coords.latitude,
            long: pos.coords.longitude,
          });
          setStateCoords([pos.coords.latitude, pos.coords.longitude]);
          latitude = pos.coords.latitude;
          longitude = pos.coords.longitude;
          setLastGeolocation([latitude, longitude]);
          const { data: responseData } = await api(
            `jobs/nearby?latitude=${latitude}&longitude=${longitude}&radius=0.2&limit=200&offset=0`
          );
          if (responseData) {
            setPlacemarks(responseData);
          }
        },
        async () => {
          let latitude;
          let longitude;

          setData({
            lat: initData.city.latitude,
            long: initData.city.longitude,
          });
          setStateCoords([initData.city.latitude, initData.city.longitude]);
          latitude = initData.city.latitude;
          longitude = initData.city.longitude;

          const { data: resData } = await api(
            `jobs/nearby?latitude=${latitude}&longitude=${longitude}&radius=0.2&limit=200&offset=0`
          );
          if (resData) {
            setPlacemarks(resData);
          }
        }
      );
    }
  }

  useEffect(() => {
    async function refresh() {
      if (stateCoords && stateCoords[0]) {
        const { data: resData } = await api(
          `jobs/nearby?latitude=${stateCoords[0]}&longitude=${
            stateCoords[1]
          }&radius=0.2&limit=200&offset=0${
            mapFilterQuery ? `${mapFilterQuery}` : ""
          }`
        );
        if (resData) {
          setMockMarks(resData);
          setPlacemarks(resData);
        }
      }
    }
    if (!clickedOnWorkplace) refresh();
    if (clickedOnWorkplace) setClickedOnWorkplace(false);
  }, [mapFilterQuery]);

  return (
    <>
      {data && placemarks !== null && initData ? (
        <Group separator="hide">
          <Map
            instanceRef={mapsRef}
            defaultState={{
              center:
                stateCoords.length !== 0 ? stateCoords : [data.lat, data.long],
              zoom: zoom,
            }}
            state={{
              center:
                stateCoords.length !== 0 ? stateCoords : [data.lat, data.long],
              zoom: zoom,
            }}
            width="100%"
            height={platformType === "vk" && isDesktop ? "83vh" : "95vh"}
          >
            {lastGeoLocation && (
              <Placemark
                geometry={lastGeoLocation}
                options={{
                  preset: "islands#blueCircleDotIcon",
                }}
              />
            )}
            {zoom < 12 ? (
              <>
                <Clusterer
                  options={{
                    groupByCoordinates: false,
                    preset: "islands#darkBlueClusterIcons",
                  }}
                >
                  {placemarks.map((mark) => (
                    <Placemark
                      key={mark.id}
                      geometry={[mark.latitude, mark.longitude]}
                      properties={{}}
                      onClick={() => handleClickMark(mark)}
                      options={{
                        iconLayout: "default#image",
                        iconImageHref: jobazavrIcon,
                        iconImageOffset: [-5, -38],
                      }}
                    />
                  ))}
                </Clusterer>
              </>
            ) : (
              <>
                {placemarks.map((mark) => (
                  <Placemark
                    key={mark.id}
                    geometry={[mark.latitude, mark.longitude]}
                    properties={{}}
                    onClick={() => handleClickMark(mark)}
                    options={{
                      iconLayout: "default#image",
                      iconImageHref: jobazavrIcon,
                      iconImageOffset: [-5, -38],
                    }}
                  />
                ))}
              </>
            )}
          </Map>
          <FixedLayout
            vertical={window.screen.width >= 1000 ? "top" : "bottom"}
          >
            <Div className="DivFix containerDiv">
              <Card
                onClick={handleLocationClick}
                mode="outline"
                className="geoBtn"
              >
                <IconButton>
                  <Icon24LocationOutline />
                </IconButton>
              </Card>
              <Button
                className={"vkBtn"}
                href={"https://vk.com/jobazavr"}
                target={"_blank"}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {t({
                    defaultValue: "Вступить в группу",
                    key: "join_group",
                    language: selectedLanguage,
                  })}
                  <Icon24LogoVk />
                </div>
              </Button>
            </Div>
          </FixedLayout>
        </Group>
      ) : (
        <PanelSpinner />
      )}
    </>
  );
};

export default MapPanel;
