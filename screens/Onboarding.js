import { useState } from "react";
import {
  Button,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { createUser } from "../utils/Auth";
import { validateName } from "../utils/Validation";
import { validateEmail } from "../utils/Validation";

export default function ({ onBoard }) {
  const [firstName, setFirstName] = useState("");

  const [email, setEmail] = useState("");

  const isValid = validateEmail(email) && validateName(firstName);

  // console.log("validatename is", validateName(firstName));
  // console.log("validateemail is", validateEmail(email));
  // console.log("isvalid is", isValid);

  const handleSubmit = (e) => {
    e.preventDefault;
    createUser(firstName, email);
    onBoard();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require("../images/Logo.png")}
        ></Image>
      </View>
      <View style={styles.mainbox}>
        <Text style={styles.leadtext}>Let us get to know you</Text>
        <Text style={styles.labels}>First Name</Text>
        <TextInput
          style={styles.nameinput}
          type="text"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.labels}>Email</Text>
        <TextInput
          style={styles.nameinput}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.footer}>
        <Pressable
          style={[styles.button, isValid ? "" : styles.disabledBtn]}
          onPress={handleSubmit}
          disabled={!isValid}
        >
          <Text style={[styles.buttontext, isValid ? "" : styles.disabledTxt]}>
            Next
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  header: {
    flex: 0.15,

    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    flex: 1,
    width: 280,
    resizeMode: "contain",
  },
  mainbox: {
    flex: 0.85,
    backgroundColor: "#CBD2D9",
    width: "100%",

    alignItems: "center",
    justifyContent: "center",
  },
  leadtext: {
    fontSize: 32,
    marginBottom: 100,
  },
  nameinput: {
    height: 50,
    width: "80%",
    borderWidth: 2,
    borderRadius: 10,
  },
  labels: {
    fontSize: 32,
    marginBottom: 10,
    marginTop: 20,
  },
  footer: {
    flex: 0.25,
  },
  button: {
    backgroundColor: "#495E57",
    paddingVertical: 10,
    paddingHorizontal: 50,
    position: "absolute",
    top: 50,
    right: 50,
    borderRadius: 10,
  },
  buttontext: {
    fontSize: 32,
    marginRight: "auto",
    marginLeft: "auto",
    color: "white",
  },
  disabledBtn: {
    backgroundColor: "#F6F8FA",
  },
  disabledTxt: {
    color: "grey",
  },
});
