import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import { getUser } from "../utils/Auth";
import Checkbox from "expo-checkbox";
import { validateName } from "../utils/Validation";
import { validateEmail } from "../utils/Validation";
import { validateNumber } from "../utils/Validation";
import { NativeModules } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const profileRawData = {
    firstName: "",
    lastName: "",
    email: "",
    number: "",
    selectedImage: null,
    orderStatusChecked: false,
    passwordChangesChecked: false,
    specialOffersChecked: false,
    newsletterChecked: false,
  };
  const [profile, setProfile] = useState(profileRawData);

  const [discard, setDiscard] = useState(false);

  const formIsValid =
    validateName(profile.firstName) &&
    validateName(profile.lastName) &&
    validateEmail(profile.email) &&
    validateNumber(profile.number);

  useEffect(() => {
    (async () => {
      try {
        const user = await getUser().then((user) => {
          setProfile({
            firstName: user.firstName,
            lastName: user.lastName || "",
            email: user.email,
            number: user.number || "",
            selectedImage: user.selectedImage,
            orderStatusChecked: user.orderStatusChecked,
            passwordChangesChecked: user.passwordChangesChecked,
            specialOffersChecked: user.specialOffersChecked,
            newsletterChecked: user.newsletterChecked,
          });
        });
        setDiscard(false);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [discard]);

  async function resetUser() {
    try {
      await AsyncStorage.clear();
      // await AsyncStorage.removeItem("userData");
      console.log("data removed");
      setProfile(profileRawData);
      NativeModules.DevSettings.reload();
    } catch (exception) {
      console.log(exception);
    }
  }

  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    KarlaRegular: require("../assets/fonts/Karla-Regular.ttf"),
    KarlaMedium: require("../assets/fonts/Karla-Medium.ttf"),
    KarlaBold: require("../assets/fonts/Karla-Bold.ttf"),
    KarlaExtraBold: require("../assets/fonts/Karla-ExtraBold.ttf"),
    MarkaziTextRegular: require("../assets/fonts/MarkaziText-Regular.ttf"),
    MarkaziTextMedium: require("../assets/fonts/MarkaziText-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return undefined;
  }

  let PlaceholderImage;
  profile.lastName
    ? (PlaceholderImage = {
        uri: `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName} `,
      })
    : (PlaceholderImage = {
        uri: `https://ui-avatars.com/api/?name=${profile.firstName}&length=1 `,
      });

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,

      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setProfile({ ...profile, selectedImage: result.assets[0].uri });
    } else {
      alert("You did not select any image.");
    }
  };

  const ImageViewer = ({ placeholderImageSource, selectedImage }) => {
    const imageSource = selectedImage
      ? { uri: selectedImage }
      : placeholderImageSource;

    return (
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} />
      </View>
    );
  };

  //   console.log("first name is", profile.firstName);
  //   console.log("email is", profile.email);

  const createProfile = async () => {
    try {
      await AsyncStorage.mergeItem("userData", JSON.stringify(profile));
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backicon}
          onPress={() => navigation.push("Home")}
        >
          <Ionicons name="arrow-back-circle" size={38} color="#495E57" />
        </Pressable>
        <Image
          style={styles.logo}
          source={require("../images/Logo.png")}
        ></Image>
        <ImageViewer
          placeholderImageSource={PlaceholderImage}
          selectedImage={profile.selectedImage}
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.headertext}>Personal Information</Text>
        <Text style={styles.labels}>Avatar</Text>
        <View style={styles.avatar}>
          <ImageViewer
            placeholderImageSource={PlaceholderImage}
            selectedImage={profile.selectedImage}
          />
          <Pressable style={styles.changeAvatarButton} onPress={pickImageAsync}>
            <Text style={styles.whiteText}>Change</Text>
          </Pressable>
          <Pressable
            style={styles.whiteBtn}
            onPress={() => {
              setProfile({ ...profile, selectedImage: null });
            }}
          >
            <Text style={styles.removeAvatarText}>Remove</Text>
          </Pressable>
        </View>
        <Text style={styles.labels}>First name</Text>
        <TextInput
          style={styles.nameinput}
          type="text"
          value={profile.firstName}
          onChangeText={(newText) =>
            setProfile({ ...profile, firstName: newText })
          }
        />
        <Text style={styles.labels}>Last name</Text>
        <TextInput
          style={styles.nameinput}
          type="text"
          value={profile.lastName}
          onChangeText={(newText) =>
            setProfile({ ...profile, lastName: newText })
          }
        />

        <Text style={styles.labels}>Email</Text>
        <TextInput
          style={styles.nameinput}
          value={profile.email}
          onChangeText={(newText) => setProfile({ ...profile, email: newText })}
        />

        <Text style={styles.labels}>Phone number</Text>
        <TextInput
          style={styles.nameinput}
          keyboardType="phone-pad"
          value={profile.number}
          onChangeText={(newNumber) =>
            setProfile({ ...profile, number: newNumber })
          }
        />

        <Text style={styles.headertext}>Email Notifications</Text>

        <View style={styles.section}>
          <Checkbox
            style={styles.checkbox}
            value={profile.orderStatusChecked}
            onValueChange={(newValue) =>
              setProfile({ ...profile, orderStatusChecked: newValue })
            }
            color={profile.orderStatusChecked ? "#4630EB" : undefined}
          />
          <Text style={styles.paragraph}>Order status</Text>
        </View>

        <View style={styles.section}>
          <Checkbox
            style={styles.checkbox}
            value={profile.passwordChangesChecked}
            onValueChange={(newValue) =>
              setProfile({ ...profile, passwordChangesChecked: newValue })
            }
            color={profile.passwordChangesChecked ? "#4630EB" : undefined}
          />
          <Text style={styles.paragraph}>Password Changes</Text>
        </View>

        <View style={styles.section}>
          <Checkbox
            style={styles.checkbox}
            value={profile.specialOffersChecked}
            onValueChange={(newValue) =>
              setProfile({ ...profile, specialOffersChecked: newValue })
            }
            color={profile.specialOffersChecked ? "#4630EB" : undefined}
          />
          <Text style={styles.paragraph}>Special Offers</Text>
        </View>

        <View style={styles.section}>
          <Checkbox
            style={styles.checkbox}
            value={profile.newsletterChecked}
            onValueChange={(newValue) =>
              setProfile({ ...profile, newsletterChecked: newValue })
            }
            color={profile.newsletterChecked ? "#4630EB" : undefined}
          />
          <Text style={styles.paragraph}>Newsletter</Text>
        </View>

        <View style={styles.logoutbtn}>
          <Button color="#F4CE14" onPress={resetUser} title="Log out" />
        </View>
        <View style={styles.changesbtns}>
          <Pressable style={styles.whiteBtn} onPress={() => setDiscard(true)}>
            <Text style={styles.saveBtnText}>Discard Changes</Text>
          </Pressable>

          <Pressable
            style={[styles.saveBtn, formIsValid ? "" : styles.disabledBtn]}
            onPress={createProfile}
            disabled={!formIsValid}
          >
            <Text
              style={[styles.whiteText, formIsValid ? "" : styles.disabledTxt]}
            >
              Save Changes
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",

    padding: 20,
  },
  header: {
    flex: 0.1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  backicon: {},
  logo: {
    flex: 1,
    width: 220,
    resizeMode: "contain",
  },

  body: {
    flex: 0.9,

    width: "100%",
    paddingHorizontal: 20,

    borderWidth: 2,
    borderColor: "#E6E6EB",
    borderRadius: 15,
  },
  headertext: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 5,
    fontFamily: "KarlaExtraBold",
  },
  avatar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",

    marginBottom: 10,
  },
  changeAvatarButton: {
    backgroundColor: "#495E57",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  whiteBtn: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
  },
  whiteText: {
    color: "white",
  },

  image: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    borderRadius: 30,
  },

  nameinput: {
    height: 40,
    width: "100%",
    borderWidth: 2,
    borderColor: "#E6E6EB",
    borderRadius: 10,
    paddingLeft: 10,
  },
  labels: {
    fontSize: 16,
    fontFamily: "KarlaMedium",
    marginBottom: 5,
    marginTop: 20,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    margin: 8,
  },
  logoutbtn: {
    marginVertical: 20,
  },
  changesbtns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },

  saveBtn: {
    backgroundColor: "#495E57",
    padding: 10,
    borderRadius: 10,
  },
  disabledBtn: {
    backgroundColor: "#F6F8FA",
  },
  disabledTxt: {
    color: "grey",
  },
});
