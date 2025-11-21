import { useEffect, useState } from "react";
import api from "../../../modules/apiRequest";
import { useRecoilState } from "recoil";
import {
  getAfterSelectingCity,
  getListCities,
} from "../../../storage/selectors/main";

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [listOver, setListOver] = useState(false);
  const [listCities, setListCities] = useRecoilState(getListCities);
  const [foundCities, setFoundCities] = useState(null);
  const [foundListOver, setFoundListOver] = useState(false);
  const [, setIsAfterSelectingCities] = useRecoilState(getAfterSelectingCity);

  async function updateList() {
    if (foundCities) {
      if (Array.isArray(foundCities) && !foundListOver) {
        setShowLoader(true);
        const { data: responseData } = await api(
          `cities?limit=250&offset=${
            foundCities.length
          }&query=${searchQuery.trim()}`
        );
        if (responseData) {
          if (responseData.length === 0) setFoundListOver(true);
          setFoundCities((p) => [...p, ...responseData]);
        }
        setShowLoader(false);
      }
    } else {
      if (Array.isArray(listCities) && !listOver) {
        setShowLoader(true);
        const { data: responseData } = await api(
          `cities?limit=250&offset=${listCities.length}`
        );
        if (responseData) {
          if (responseData.length === 0) setListOver(true);
          setListCities((p) => [...p, ...responseData]);
        }
        setShowLoader(false);
      }
    }
  }

  async function get() {
    const { data: responseData } = await api("cities?limit=250");
    if (responseData) {
      setListCities(responseData);
    }
    return true;
  }

  const handleSearchCity = async () => {
    setFoundListOver(false);
    if (searchQuery.trim().length > 0) {
      const { data: responseData } = await api(
        `cities?query=${searchQuery.trim()}&limit=250`
      );
      if (responseData) {
        setFoundCities(responseData);
      }
    } else {
      setFoundCities(null);
    }
  };

  useEffect(() => {
    const to = setTimeout(() => handleSearchCity(), 600);
    return () => clearTimeout(to);
  }, [searchQuery]);

  const handleInputChange = ({ target }) => setSearchQuery(target.value);
  return {
    handleInputChange,
    searchQuery,
    setListCities,
    get,
    listCities: foundCities ? foundCities : listCities,
    listOver,
    updateList,
    showLoader,
  };
};
