import "./styles.scss";
import { useEffect, useState } from "react";
import {
  Cell,
  Footer,
  FormField,
  FormItem,
  FormLayout,
  Group,
  Input,
  List,
  PanelSpinner,
} from "@vkontakte/vkui";
import api from "../../../modules/apiRequest";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getAfterSelectingCity,
  getCurrentTab,
  getFilterCities,
  getListCities,
  getSelectedCity,
  getTabbarHidden,
} from "../../../storage/selectors/main";
import { InfScroll } from "kokateam-infscroll";
import { Icon20Check } from "@vkontakte/icons";
import { useSearch } from "./useSearch";
import bridge from "@vkontakte/vk-bridge";

export const CitiesSelect = ({ toModal, toBack }) => {
  const [selectedCity, setSelectedCity] = useRecoilState(getSelectedCity);
  const [, setCurrentTab] = useRecoilState(getCurrentTab);
  const filterCities = useRecoilValue(getFilterCities);
  const [, setTabbarHidden] = useRecoilState(getTabbarHidden);
  const [isFirstLoading, setIsFirstLoading] = useState(false);
  const [, setIsAfterSelectingCities] = useRecoilState(getAfterSelectingCity);

  // search hook
  const {
    handleInputChange,
    searchQuery,
    setListCities,
    get,
    listCities,
    listOver,
    updateList,
    showLoader,
  } = useSearch();

  useEffect(() => {
    setCurrentTab("cities");
    setTabbarHidden(true);
    return () => setTabbarHidden(false);
  }, []);

  useEffect(() => {
    const getFunc = async () => {
      setIsFirstLoading(true);
      await get();
      setIsFirstLoading(false);
    };
    if (!listCities) getFunc();
    return () => toModal("filters");
  }, []);

  useEffect(() => {
    bridge.send("VKWebAppSetSwipeSettings", { history: false });
  }, []);
  return (
    <Group className={"citiesGroup"}>
      <FormLayout>
        <FormItem top={"Поиск"}>
          <Input
            value={searchQuery}
            onChange={handleInputChange}
            placeholder={"Санкт-Петербург"}
          />
        </FormItem>
      </FormLayout>
      {!isFirstLoading ? (
        <>
          {listCities && listCities.length > 0 ? (
            <List>
              <InfScroll onReachEnd={updateList} showLoader={showLoader}>
                {listCities &&
                  listCities
                    .filter((i) =>
                      filterCities ? filterCities.includes(i.id) : true
                    )
                    .map((item) => (
                      <Cell
                        after={
                          selectedCity && selectedCity.id === item.id ? (
                            <Icon20Check />
                          ) : undefined
                        }
                        onClick={() => {
                          setIsAfterSelectingCities(true);
                          setSelectedCity(item);
                          toBack();
                        }}
                        key={item.id}
                      >
                        {item.title}
                      </Cell>
                    ))}
              </InfScroll>
            </List>
          ) : (
            <Footer>Ничего не найдено</Footer>
          )}
        </>
      ) : (
        <PanelSpinner />
      )}
    </Group>
  );
};
