import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { HiOutlineMoon } from "react-icons/hi";
import { FiSun } from "react-icons/fi";
import "./navBar.css";

const NavBar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const svgStyle = {
    marginRight: "16px",
    marginLeft: "14px",
  };

  return (
    <div className={`navbar-${theme}`} id="NavBar">
      <div className="mainSide">
        <svg
          width="30"
          height="36"
          viewBox="0 0 27 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.63427 34.71L5.8273 35.149L6.23098 34.8906C11.7097 31.3809 23.1611 24.0861 25.2485 22.9108C26.535 22.1865 26.9788 21.3032 26.9655 20.5035C26.9591 20.1217 26.8476 19.7883 26.7129 19.5368C26.6454 19.4109 26.5693 19.3005 26.492 19.211C26.428 19.1368 26.3444 19.055 26.2462 18.9988L18.0618 13.4248L14.2219 16.2828L14.6001 16.6181C15.5748 17.4822 17.9445 19.265 19.0757 20.0199C19.528 20.3216 19.6144 20.5424 19.6242 20.6248C19.6306 20.6793 19.6107 20.7427 19.5108 20.7996C17.4146 21.9926 14.162 23.9065 11.3406 25.7294C9.93069 26.6404 8.62202 27.5328 7.6175 28.3037C7.1157 28.6888 6.68327 29.0486 6.35008 29.3689C6.02832 29.6783 5.7595 29.9876 5.63427 30.2724C4.84999 32.0563 5.30564 33.9625 5.63427 34.71Z"
            fill="#1A3B54"
          />
          <path
            d="M21.3315 0.949831L21.1385 0.510742L20.7347 0.769325C15.2561 4.27896 3.80467 11.5737 1.71727 12.749C0.430787 13.4733 -0.0130953 14.3566 0.000292788 15.1563C0.00668582 15.5382 0.1181 15.8716 0.252873 16.123C0.320391 16.2489 0.396433 16.3594 0.473719 16.4489C0.537753 16.523 0.621385 16.6048 0.719508 16.661L8.90393 22.235L12.7438 19.377L12.3657 19.0418C11.391 18.1776 9.02125 16.3948 7.89003 15.64C7.43781 15.3382 7.35141 15.1174 7.34157 15.035C7.33509 14.9805 7.35506 14.9171 7.45497 14.8602C9.55111 13.6672 12.8038 11.7534 15.6251 9.93042C17.035 9.01944 18.3437 8.12702 19.3482 7.35615C19.85 6.971 20.2825 6.61126 20.6156 6.29089C20.9374 5.98149 21.2063 5.67225 21.3315 5.38737C22.1158 3.60334 21.6601 1.69737 21.3315 0.949831Z"
            fill="#4FA6A9"
          />
        </svg>

        <h2
          className="titleMain"
          style={{ color: theme === "light" ? "inherit" : "#08436c" }}
        >
          enior.az
        </h2>
      </div>

     

<div className="buttons">
        <label className={`switch ${theme}`}>
          <input type="checkbox" onChange={() => toggleTheme(theme)} />
          <span className="slider round">
            <div
              className="parent"
              style={{ backgroundColor: theme === "light" ? "#222" : "" }}
            >
              <p
                id="iconSun"
                className={`toggle-icon ${theme === "dark" ? "active" : ""}`}
                style={{
                  backgroundColor: theme === "light" ? "#000" : "",
                  borderRadius: "6px",
                }}
              >
                <p
                  style={{ color: theme === "light" ? "#333" : "" }}
                  className="iconElement"
                >
                  <FiSun />
                </p>
                <p
                  className="toggleText"
                  style={{ color: theme === "light" ? "#333" : "" }}
                >
                  Light
                </p>
              </p>

              <p
                id="iconMoon"
                className={`toggle-icon ${theme === "light" ? "active" : ""}`}
                style={{ backgroundColor: theme === "light" ? "#222" : "" }}
              >
                <p className="iconElement">
                  <HiOutlineMoon />
                </p>
                <p className="toggleText">Dark</p>
              </p>
            </div>
          </span>
        </label>
      </div>
    </div>
  );
};

export default NavBar;
