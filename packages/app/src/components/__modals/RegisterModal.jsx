import Register from "../home/register";
import {useRecoilValue} from "recoil";
import {getInitData} from "../../storage/selectors/main";
import {useEffect} from "react";
import {CodeForm} from "../authorization/CodeForm/base";
import {PhoneForm} from "../authorization/PhoneForm/base";

export const RegisterModal = ({ close, toPanel }) => {
    const initData = useRecoilValue(getInitData)
    useEffect(() => {
        // if(!initData) toPanel('phoneForm')
    }, [])
    if(!initData) return <PhoneForm toPanel={toPanel} />
  return (
    <>
      <Register close={() => close()} />
    </>
  );
};
