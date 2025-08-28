import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/AppRoutes";
import LanguageSwitcher from "./utils/LanguageSwitch/LanguageSwitcher";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./i18n"; // Import i18n config
import { InboxProvider } from "./components/features/Mail/SideBar/InboxContext";
const App = () => {
  return (
    <BrowserRouter>
      {/* <LanguageSwitcher /> */}
      <InboxProvider>
      <ToastContainer/>
      <AppRoutes />
      </InboxProvider>
    </BrowserRouter>
  );
};

export default App;
