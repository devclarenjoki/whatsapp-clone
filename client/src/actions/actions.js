import axios from "axios";
import constants from "../constants/constants";

export const updateOnlineStatus = (userId) => {
  console.log("calledd");
  const res = axios.post(`${constants.BASE_URL}/user/updateOnlineStatus`, {
    userId: userId,
  });
  return res;
};

export const updateOfflineStatus = (userId) => {
  const res = axios.post(`${constants.BASE_URL}/user/updateOfflineStatus`, {
    userId: userId,
  });
  return res;
};
