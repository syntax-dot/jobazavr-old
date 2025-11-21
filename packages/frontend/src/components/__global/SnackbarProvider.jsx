import React from "react";
import { useRecoilValue } from "recoil";
import { Toaster } from "react-hot-toast";
import { getIsDesktop } from "../../storage/selectors/main";

export default function SnackbarProvider({ children }) {
  const isDesktop = useRecoilValue(getIsDesktop);

  return (
    <>
      {children}
      <Toaster
        toastOptions={{
          className: "toast",
        }}
        gutter={isDesktop ? 8 : 5}
        position={isDesktop ? "bottom-left" : "top-center"}
        style={{ marginTop: 20 }}
        reverseOrder={false}
      />
    </>
  );
}
