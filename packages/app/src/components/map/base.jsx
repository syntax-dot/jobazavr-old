import React, { useEffect } from "react";
import { Map, Placemark, Clusterer } from "@pbe/react-yandex-maps";
import {
  Button,
  Card,
  Div,
  FixedLayout,
  Group,
  IconButton,
  PanelSpinner,
  Placeholder,
} from "@vkontakte/vkui";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getAfterClickPlacemark,
  getAfterLogin,
  getChangeProfile,
  getCurrentTab,
  getCurrentView,
  getDropdownOpened,
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
  getSalaryFilter,
  getSelectedCity,
  getSelectedLanguage,
  getStateCoords,
  getZoom,
} from "../../storage/selectors/main";
import structure from "/src/structure";
import api from "../../modules/apiRequest";
import jobazavrIcon from "../../assets/images/logo.png";
import distance from "../../modules/distance";
import { useRef } from "react";
import { Icon24LocationOutline, Icon24LogoVk } from "@vkontakte/icons";
import { tagLogoOnMap } from "../../modules/tagManager";
import { Geolocation } from "@capacitor/geolocation";
import { useTranslate } from "@tolgee/react";
import { motion } from "framer-motion";
import { BottomContainer } from "./BottomContainer";

const MapPanel = ({ toPanel, rhooks, toModal }) => {
  console.log(structure);
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const selectedCity = useRecoilValue(getSelectedCity);
  const [afterLogin, setAfterLogin] = useRecoilState(getAfterLogin);
  const [changeProfile, setChangeProfile] = useRecoilState(getChangeProfile);
  const [data, setData] = useRecoilState(getMapData);
  const [stateCoords, setStateCoords] = useRecoilState(getStateCoords);
  const [placemarks, setPlacemarks] = useRecoilState(getMarksData);
  const [, setPlaceData] = useRecoilState(getPlaceData);
  const [, setNearest] = useRecoilState(getNearestData);
  const initData = useRecoilValue(getInitData);
  const [favouiteJobs, setFavouriteJobs] = useRecoilState(getFavouriteJobs);
  const platformType = "mob";
  const isDesktop = useRecoilValue(getIsDesktop);
  const [zoom, setZoom] = useRecoilState(getZoom);
  const [, setMockMarks] = useRecoilState(getMockMarks);
  const [, setCurrentTab] = useRecoilState(getCurrentTab);
  const [, setCurrentView] = useRecoilState(getCurrentView);
  const mapFilterQuery = useRecoilValue(getMapFilterQuery);
  const newMapsRef = useRef(null);
  const [afterClickPlacemark, setAfterClickPlacemark] = useRecoilState(
    getAfterClickPlacemark
  );
  // GeoControl
  const [lastGeoLocation, setLastGeolocation] =
    useRecoilState(getLastGeolocation);
  useEffect(() => {
    setCurrentView("map");
    setCurrentTab("map");
  }, []);

  async function get() {
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
          console.log(error);
        }
      }
    } else {
      if (platformType === "mob") {
        if (initData?.onboarding || !initData) {
          let latitude;
          let longitude;
          latitude = 55.75583;
          longitude = 37.61778;

          if (window.localStorage.getItem("recievedLocation")) {
            const coords = JSON.parse(
              window.localStorage.getItem("recievedLocation")
            );
            latitude = coords[0];
            longitude = coords[1];
          }
          setData({
            lat: latitude,
            long: longitude,
          });
          setStateCoords([latitude, longitude]);

          let resData;
          !placemarks || changeProfile
            ? (resData = await api(
                `jobs/nearby?latitude=${latitude}&longitude=${longitude}&radius=0.2&limit=200&offset=0${
                  mapFilterQuery ? `${mapFilterQuery}` : ""
                }`
              ))
            : null;
          !placemarks || changeProfile ? setPlacemarks(resData.data) : null;
          !placemarks || changeProfile ? setMockMarks(resData.data) : null;
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
              console.log(error);
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
              console.log(error);
            }
          }
        }
      } else {
        if (initData?.onboarding || !initData) {
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
              console.log(error);
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
              console.log(error);
            }
          }
        }
      }
    }
  }

  const callbackFunc = (event) => {
    if (event.originalEvent.newZoom <= 7) {
      console.log("mapFilterQuery", mapFilterQuery);
      handleChangeRef(
        event.get("newCenter")[0],
        event.get("newCenter")[1],
        true,
        event.originalEvent.newZoom
      );
    } else {
      console.log("mapFilterQuery", mapFilterQuery);
      handleChangeRef(
        event.get("newCenter")[0],
        event.get("newCenter")[1],
        false,
        event.originalEvent.newZoom
      );
    }
  };

  useEffect(() => {
    if (newMapsRef.current) {
      newMapsRef.current.events.add("boundschange", callbackFunc);

      return () => {
        newMapsRef.current
          ? newMapsRef.current.events.remove("boundschange", callbackFunc)
          : null;
      };
    }
  }, [mapFilterQuery, newMapsRef.current]);

  const handleChangeRef = async (
    latitude,
    longitude,
    param = false,
    zoom = 12
  ) => {
    setZoom(zoom);
    console.log("cooordsdsdsds", [latitude, longitude]);
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
    } catch (error) {
      console.log(error);
    }
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
    setAfterClickPlacemark(true);
    toPanel("showWork");
  };

  useEffect(() => {
    if (!afterClickPlacemark) get();
    if (afterClickPlacemark) setAfterClickPlacemark(false);
    setCurrentTab("map");
    if (afterLogin) {
      // rhooks.resetHistory(structure);
      console.log("history reset");
      setAfterLogin(false);
    }
    console.log("rhooks", rhooks);

    // Push Notification Handler

    const isShown = window.localStorage.getItem("pushNotificationShown");
    if (isShown) {
    } else {
      if (initData?.onboarding || !initData) {
        // toModal("push");
        window.localStorage.setItem("pushNotificationShown", "true");
      }
    }
  }, [initData]);

  async function handleLocationClick() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log(coordinates.coords);
    if (coordinates?.coords) {
      window.localStorage.setItem(
        "recievedLocation",
        JSON.stringify([
          coordinates.coords.latitude,
          coordinates.coords.longitude,
        ])
      );
      let latitude;
      let longitude;
      setData({
        lat: coordinates.coords.latitude,
        long: coordinates.coords.longitude,
      });
      setStateCoords([
        coordinates.coords.latitude,
        coordinates.coords.longitude,
      ]);
      latitude = coordinates.coords.latitude;
      longitude = coordinates.coords.longitude;
      setLastGeolocation([latitude, longitude]);
      const { data: responseData } = await api(
        `jobs/nearby?latitude=${latitude}&longitude=${longitude}&radius=0.2&limit=200&offset=0${
          mapFilterQuery ? `${mapFilterQuery}` : ""
        }`
      );
      if (responseData) {
        setPlacemarks(responseData);
      }
    } else {
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
        `jobs/nearby?latitude=${latitude}&longitude=${longitude}&radius=0.2&limit=200&offset=0${
          mapFilterQuery ? `${mapFilterQuery}` : ""
        }`
      );
      if (resData) {
        setPlacemarks(resData);
      }
    }
  }

  useEffect(() => {
    async function refresh() {
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
    refresh();
  }, [mapFilterQuery]);

  return (
    <>
      {data && placemarks !== null ? (
        <Group separator="hide">
          <Map
            instanceRef={newMapsRef}
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
            height={platformType === "vk" && isDesktop ? "83vh" : "100vh"}
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
          <BottomContainer {...{ handleLocationClick, selectedLanguage }} />
        </Group>
      ) : (
        <Placeholder stretched={true}>
          <PanelSpinner />
        </Placeholder>
      )}
    </>
  );
};

export default MapPanel;
