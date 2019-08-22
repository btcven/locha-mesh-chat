import AsyncStorage from "@react-native-community/async-storage";
import { ActionTypes } from "../constants";

export const initialChat = (data) => dispatch =>{
   dispatch({
       type: ActionTypes.NEW_MESSAGE,
       payload: data
   })
}
