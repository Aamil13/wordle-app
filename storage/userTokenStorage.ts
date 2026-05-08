import * as SecureStore from "expo-secure-store";

export const USER_TOKEN_KEY = "userTokenKey";

export const setUserToken = async (value: string) => {
  try {
    await SecureStore.setItemAsync(USER_TOKEN_KEY, value);
    return true;
  } catch (error) {
    console.error("Error setting user token:", error);
    return false;
  }
};

export const getUserToken = async () => {
  try {
    const token = await SecureStore.getItemAsync(USER_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error("Error setting user token:", error);
    return false;
  }
};

export const deleteUserToken = async () => {
  try {
    await SecureStore.deleteItemAsync(USER_TOKEN_KEY);
    return true;
  } catch (error) {
    console.error("Error setting user token:", error);
    return false;
  }
};
