import React from "react";
import { Button, IconButton } from "@mui/material";
import { primary, primaryColor, primaryHover, white } from "../../utils/colors";

export const withPanelButtonStyles = (Component) => {
  const Wrapped = ({ panel = "green", sx, ...props }) => {
    const isWhitePanel = panel === "white";

    const baseSx = {
      boxShadow:
        "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
      backgroundColor: isWhitePanel ? primaryColor : primary,
      color: isWhitePanel ? white : primaryColor,
      fontWeight: "bold",
      "&:hover": {
        backgroundColor: isWhitePanel ? primaryHover : white,
        color: isWhitePanel ? white : primaryColor,
        fontWeight: "bold",
      },
    };

    return <Component {...props} sx={{ ...baseSx, ...sx }} />;
  };

  Wrapped.displayName = `withPanelButtonStyles(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
};

const PanelButton = withPanelButtonStyles(Button);

export const PanelIconButton = withPanelButtonStyles(IconButton);

export default PanelButton;
