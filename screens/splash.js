import { View, Text, StyleSheet, Image } from "react-native";

export default function () {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../images/Logo.png")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 100,
    width: "90%",
    resizeMode: "contain",
  },
});
