import React, { useContext, useState } from "react";
import "./ChatBox.scss";
import { Context } from "../../../context/Context";
import axios from "axios";
import { Avatar, Typography, IconButton } from "@material-ui/core";
import {
  MoreVert,
  Search,
  InsertEmoticon,
  Mic,
  Attachment,
  Check,
  Send,
} from "@material-ui/icons";
import { animateScroll } from "react-scroll";
import DefaultScreen from "../DefaultScreen/DefaultScreen";

const ChatBox = () => {
  const [state] = useContext(Context);
  const { chats, selectedContactId } = state;

  // Local State
  const [inputMessage, setInputMessage] = useState("");

  //   Find the selected contacts
  const chat = chats.find((chat) => chat._id === selectedContactId);

  // Set the input message to the state
  const handleChange = (e) => {
    setInputMessage(e.target.value);
  };

  // Scroll to bottom when overflows
  const scrollToBottom = () => {
    animateScroll.scrollToBottom({
      containerId: "chatBox",
    });
  };

  // Send message
  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      axios
        .post("http://localhost:8000/api/v1/message/send", {
          user: state.user._id,
          to: chat.user._id === state.user._id ? chat.to._id : chat.user._id,
          message: inputMessage,
        })
        .then(() => {
          setInputMessage("");
          scrollToBottom();
        });
    }
  };
  return (
    <div className="chatBox" id="chatBox">
      {chat !== undefined ? (
        <div>
          <div className="chatBox__header">
            <div className="chatBox__headerLeft">
              <Avatar
                style={{
                  backgroundColor: chat.user.imgColor || "#8e44ad",
                }}
              >
                {chat.user._id !== state.user._id
                  ? chat.user.name.charAt(0)
                  : chat.to.name.charAt(0)}
              </Avatar>
              <div className="chatBox__HeaderContainer">
                <div>
                  <Typography variant="body1" className="chatBox__headerTitle">
                    {chat.user._id !== state.user._id
                      ? chat.user.name
                      : chat.to.name}
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" className="onlineStatusText">
                    {chat.user.online
                      ? "online"
                      : chat.user.lastSeen === undefined
                      ? ""
                      : `last seen at ${chat.user.lastSeen.substr(11, 15)}`}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="chatBox__headerRight">
              <IconButton>
                <Search />
              </IconButton>
              <IconButton>
                <MoreVert />
              </IconButton>
            </div>
          </div>
          {/* Chat Area */}
          <div className="chatBox__chatArea">
            {chat.messages.map((message, index) => {
              if (message.user !== state.user._id) {
                return (
                  <div className="chatBox__message incomingMessage">
                    <div className="chatBox__messageWrapper ">
                      <div className="chatBox__messageContent">
                        <p>{message.message}</p>
                        <div className="chatBox__messageFooter">
                          <div className="chatBox__messageFooterTimeStamp"></div>
                          <div className="chatBox__messageFooterTimeStamp">
                            8:55 PM
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="chatBox__message outgoingMessage">
                    <div></div>
                    <div className="chatBox__messageWrapper ">
                      <div className="chatBox__messageContent">
                        <p>{message.message}</p>
                        <div className="chatBox__messageFooter">
                          <div className="chatBox__messageFooterTimeStamp"></div>
                          <div className="chatBox__messageFooterTimeStamp">
                            8:55 PM
                            <Check className="chatBox__messageFooterTickIcon" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
          {/* Chat Input */}
          <div className="chatBox__inputWrapper">
            <InsertEmoticon />
            <Attachment />
            <input
              type="text"
              placeholder="Type a message"
              value={inputMessage}
              onChange={handleChange}
            />
            {inputMessage.trim() === "" ? (
              <Mic />
            ) : (
              <Send onClick={sendMessage} />
            )}
          </div>
        </div>
      ) : (
        <DefaultScreen />
      )}
    </div>
  );
};

export default ChatBox;
