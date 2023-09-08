import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function createUser(firstName, email) {
  const user = { firstName: firstName, email: email };
  try {
    await AsyncStorage.setItem("userData", JSON.stringify(user));
  } catch (error) {
    console.log("Something went wrong", error);
  }
}

export async function getUser() {
  try {
    let userData = await AsyncStorage.getItem("userData");
    let data = JSON.parse(userData);
    //console.log("coming from getUser functino", data);
    return data;
  } catch (error) {
    console.log("Something went wrong", error);
  }
}
