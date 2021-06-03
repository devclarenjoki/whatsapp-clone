import React, { useState, useContext } from "react";
import "./SideBar.scss";

import {
  Avatar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
} from "@material-ui/core";
import {
  RoundedCorner,
  MessageRounded,
  MoreVert,
  KeyboardArrowDown,
  Check,
  ReplyAllRounded,
} from "@material-ui/icons";
import { Context } from "../../../context/Context";

const SideBar = () => {
  const [state, dispatch] = useContext(Context);
  const [isMenuOpen, setMenuVisible] = useState(false);

  // Select a contact to chat
  const handleContactChange = (contactId) => {
    dispatch({
      type: "SELECT_CONTACT",
      payload: contactId,
    });
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__headerLeft">
          <Avatar style={{ backgroundColor: "#ff5722" }}>H</Avatar>
        </div>
        <div className="sidebar__headerRight">
          <IconButton>
            <RoundedCorner />
          </IconButton>
          <IconButton>
            <MessageRounded />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      {/* Search Bar */}
      <div className="sidebar__search">
        <input type="text" placeholder="Search or start new chat" />
      </div>
      {/* Chat List */}
      {state.chats !== undefined
        ? state.chats.map((chat, index) => {
            return (
              <div
                className="chat__tile"
                onClick={() => handleContactChange(chat._id)}
                key={index}
              >
                <div className="chat__tileLeft">
                  <div className="chat__tileInnerContainer">
                    <div>
                      <Avatar
                        style={{
                          backgroundColor: chat.user.imgColor || "#8e44ad",
                          width: 50,
                          height: 50,
                        }}
                      >
                        {chat.user._id !== state.user._id
                          ? chat.user.name.charAt(0)
                          : chat.to.name.charAt(0)}{" "}
                      </Avatar>
                    </div>
                    <div
                      className={
                        chat.messages[chat.messages.length - 1].isRead
                          ? " chat__tileName read"
                          : "chat__tileName "
                      }
                    >
                      <Typography
                        variant="body1"
                        className="chat__tileNameText"
                      >
                        {chat.user._id !== state.user._id
                          ? chat.user.name
                          : chat.to.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        className="chat__tileNameSubText"
                      >
                        {chat.messages[chat.messages.length - 1].isRead ? (
                          <ReplyAllRounded />
                        ) : chat.messages[chat.messages.length - 1].user ===
                          state.user._id ? (
                          <Check />
                        ) : null}
                        {chat.messages[chat.messages.length - 1].message
                          .length > 15
                          ? chat.messages[
                              chat.messages.length - 1
                            ].message.substr(0, 15) + "..."
                          : chat.messages[chat.messages.length - 1].message}
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="chat__tileRight">
                  <Typography variant="caption">
                    {chat.messages[chat.messages.length - 1].time.substr(
                      11,
                      12
                    )}
                  </Typography>

                  <div className="chat__badges">
                    <KeyboardArrowDown className="chat__tileDropDownIcon" />
                    {chat.badges !== undefined ? (
                      <Badge
                        color="secondary"
                        badgeContent={1}
                        className="chat__sideBaBadge"
                      ></Badge>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};
export default SideBar;
