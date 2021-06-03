import React, { useEffect, useContext } from "react";
import "./Home.scss";
import SideBar from "../components/SideBar/SideBar";
import "../components/SideBar/SideBar.scss";
import ChatBox from "../components/ChatBox/ChatBox";
import Pusher from "pusher-js";
import axios from "axios";

import { Context } from "../../context/Context";
import constants from "../../constants/constants";
import { updateOnlineStatus, updateOfflineStatus } from "../../actions/actions";

const Home = () => {
  const [state, dispatch] = useContext(Context);

  // Component did mount
  useEffect(() => {
    // Intialize pusher for real time changes
    const pusher = new Pusher("<APPLICATION_ID>", {
      cluster: "<CLUSTER>",
    });

    const channel = pusher.subscribe("messages");
    // For a new chat
    channel.bind("inserted", (data) => {
      dispatch({
        type: "SET_CHAT_LIST",
        payload: data,
      });
    });
    // For existing chats
    channel.bind("updated", (data) => {
      dispatch({
        type: "UPDATE_CHAT",
        payload: { chatId: data._id, messages: data.messages },
      });
    });

    // Fetch the chat messages
    axios
      .get(`${constants.BASE_URL}/message/fetchMessages/${state.user._id}`)
      .then((res) => {
        dispatch({
          type: "SET_CHAT_LIST",
          payload: res.data,
        });
      });
  }, [dispatch]);
  return (
    <div className="home">
      <div className="home__left">
        <SideBar />
      </div>
      <div className="home__right">
        <ChatBox />
      </div>
    </div>
  );
};
export default Home;
