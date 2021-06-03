import React from "react";
import "./DefaultScreen.scss";
import { Typography } from "@material-ui/core";
import Pic from "../../../images/Pic.png";

const DefaultScreen = () => {
  return (
    <div className="screen">
      <img src={Pic} style={{ marginBottom: 10 }} />
      <Typography variant="h4" className="screen__title">
        Keep your phone connected
      </Typography>

      <Typography
        variant="body1"
        style={{ marginTop: 10, color: "#b1b3b5", textAlign: "center" }}
      >
        Whatsapp connects to your phone to sync messages. To reduce data usage,
        <br />
        connect your phone to WiFi.
      </Typography>
    </div>
  );
};

export default DefaultScreen;
