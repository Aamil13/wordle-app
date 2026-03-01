import * as SecureStore from 'expo-secure-store';

export const ONBOARD_KEY = "onboardKey";

export const setOnboarding = async (value:string) => {
  try {
    await SecureStore.setItemAsync(ONBOARD_KEY, value);
    return true;
  } catch (error) {
    console.error('Error setting onboarding:', error);
    return false;
  }
};

export const getOnboardingValue = async () => {
  try {
    const value = await SecureStore.getItemAsync(ONBOARD_KEY);
    return value === "true";
  } catch (error) {
    console.error('Error getting onboarding:', error);
    return false;
  }
};

export const firstTime = async () => {
  try {
     const value = await SecureStore.getItemAsync(ONBOARD_KEY);
       return value !== "true";
}
    catch (error) {
    console.error('Error getting first time:', error);
    return false;
  }
};

export const deleteOnboarding = async () => {
  try {
    await SecureStore.deleteItemAsync(ONBOARD_KEY);
    return true;
  } catch (error) {
    console.error('Error deleting onboarding:', error);
    return false;
  }
};