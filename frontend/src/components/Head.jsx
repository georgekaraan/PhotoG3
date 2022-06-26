import { useEffect } from "react";
import { createPortal } from "react-dom";
const Head = ({ children }) => {
  return createPortal(children, document.querySelector("head"));
};

export default Head;
