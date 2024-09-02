// import { useState } from "react";
import { Outlet } from "react-router-dom";
// import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
// import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";

export default function Layout() {
  return (
    <>
      <ModalProvider>
        <Navigation />
        <Outlet />
        <Modal />
      </ModalProvider>
    </>
  );
}
