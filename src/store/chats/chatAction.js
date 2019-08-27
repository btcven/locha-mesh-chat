import AsyncStorage from "@react-native-community/async-storage";
import { socket } from "../../utils/socket";
import { ActionTypes } from "../constants";

// export const initialChat = data => dispatch => {
//   socket.collection("chats").add({
//     ...data
//   });
// };


export const initialChat = (data) => dispatch =>{
  dispatch({
      type: ActionTypes.NEW_MESSAGE,
      payload: data
  })
}
