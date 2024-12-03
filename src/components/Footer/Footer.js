import React from "react";
import FooterIcon from "../Icons/FooterIcon";
import s from "./Footer.module.scss";

const Footer = () => {
  return (
    <div className={s.footer}>
      <span className={s.footerLabel}>2024 &copy; No Sleep.</span>
    </div>
  )
}

export default Footer;
