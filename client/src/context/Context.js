import React, { useReducer, createContext } from "react";
export const Context = createContext();

// Global State
const initialState = {
  chats: [],
  selectedContactId: 2,
  user: {
    _id: localStorage.getItem("id"),
  },
};

// Reducers
const reducer = (state, action) => {
  switch (action.type) {
    case "SELECT_CONTACT":
      const tempStateChats = state.chats;
      const chatToUpdate = tempStateChats.find(
        (chat) => chat._id === action.payload
      );
      chatToUpdate.badges = undefined;
      return {
        selectedContactId: action.payload,
        chats: tempStateChats,
        user: state.user,
      };
    case "SET_CHAT_LIST":
      const tempChats = action.payload;
      tempChats.map((chat) => {
        var temp = chat.chats;
        chat.messages = temp;
        chat.chats = undefined;
      });
      return {
        selectedContactId: state.selectedContactId,
        chats: tempChats,
        user: state.user,
      };
    case "UPDATE_CHAT":
      const tempState = state.chats;
      const chatToBeUpdated = tempState.find(
        (chat) => chat._id === action.payload.chatId
      );
      if (state.selectedContactId !== chatToBeUpdated._id) {
        chatToBeUpdated.badges =
          action.payload.messages.length - chatToBeUpdated.messages.length;
      }
      chatToBeUpdated.messages = action.payload.messages;

      return {
        selectedContactId: state.selectedContactId,
        chats: tempState,
        user: state.user,
      };

    default:
      throw new Error();
  }
};

// Context Provider
export const ContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={[state, dispatch]}>
      {props.children}
    </Context.Provider>
  );
};
