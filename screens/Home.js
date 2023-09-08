import { getUser } from "../utils/Auth";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Pressable,
  Image,
  Text,
  TouchableOpacity,
  Button,
} from "react-native";
import { useFonts } from "expo-font";
import {
  saveMenuItems,
  createTable,
  getMenuItems,
  deleteTable,
  filterByCategories,
} from "../utils/Database";
import { useUpdateEffect } from "../utils/Utils";
import { Searchbar } from "react-native-paper";
import debounce from "lodash.debounce";

const API_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";

const Item = ({ name, price, description, image }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemTxt}>
        <Text style={styles.nameTxt}>{name}</Text>
        <Text style={styles.descriptionTxt}>{description}</Text>
        <Text style={styles.priceTxt}>${price}</Text>
      </View>
      <Image
        style={styles.itemImg}
        source={{
          uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`,
        }}
      />
    </View>
  );
};

export default function ({ navigation }) {
  const [profile, setProfile] = useState({});
  const [menu, setMenu] = useState([]);
  const [indexClicked, setIndexClicked] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [searchBarText, setSearchBarText] = useState("");
  const [query, setQuery] = useState("");

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
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      const menu = json.menu.map((item, index) => ({
        id: index + 1,
        name: item.name,
        price: item.price.toString(),
        description: item.description,
        image: item.image,
        category: item.category,
      }));

      return menu;
    } catch (e) {
      console.log(e);
    }
    return [];
  };

  //   async function someOtherFunction() {
  //     const value = await filterByCategories(filteredCategory);
  //     console.log("filterBycategory function return", value);
  //   }

  //   someOtherFunction();

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let menuItems = await getMenuItems();
        setMenu(menuItems);
        if (!menuItems.length) {
          const menuItems = await fetchData();
          saveMenuItems(menuItems);
          setMenu(menuItems);
        }
        const ctgrs = [...new Set(menuItems.map((item) => item.category))];

        setCategories(ctgrs);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      try {
        const menuitems = await filterByCategories(
          filteredCategory,
          categories,
          query
        );
        // console.log("menuutems return of filterbycategories", menuitems);
        setMenu(menuitems);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [filteredCategory, query]);

  // console.log("pressed icons are", filteredCategory);
  // console.log("categories are", categories);
  //   console.log("outside menu return of filterbycategories", menu);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

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

  const ImageViewer = ({ placeholderImageSource, selectedImage }) => {
    const imageSource = selectedImage
      ? { uri: selectedImage }
      : placeholderImageSource;

    return (
      <View style={styles.imageContainer}>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Image source={imageSource} style={styles.image} />
        </Pressable>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <Item
      name={item.name}
      price={item.price}
      description={item.description}
      image={item.image}
    />
  );

  function handleFilter(item, index) {
    // console.log(item, "is clicked");
    // console.log(index, "number of index is clicked");

    let activeFiltered = [];
    let indexSelected = [];
    if (filteredCategory.includes(item)) {
      activeFiltered = filteredCategory.filter((e) => e !== item);
    } else {
      activeFiltered = filteredCategory.concat(item);
    }
    // console.log("activefiltered is ", activeFiltered);
    setFilteredCategory(activeFiltered);
    // console.log("pressed icons are", filteredCategory);
    if (indexClicked.includes(index)) {
      indexSelected = indexClicked.filter((e) => e !== index);
    } else {
      indexSelected = indexClicked.concat(index);
    }

    setIndexClicked(indexSelected);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require("../images/Logo.png")}
        ></Image>
        <ImageViewer
          placeholderImageSource={PlaceholderImage}
          selectedImage={profile.selectedImage}
        />
      </View>
      <View style={styles.hero}>
        <Text style={styles.displayTitle}>Little Lemon</Text>

        <Text style={styles.subtitle}>Chicago</Text>
        <View style={styles.heroDescription}>
          <Text style={[styles.heroTxt]}>
            We are a family owned Mediterranean restaurant, focused on
            traditional recipes served with a modern twist.
          </Text>
          <Image
            style={styles.heroImg}
            source={require("../images/Hero-img.png")}
          ></Image>
        </View>
        <Searchbar
          placeholder="Search"
          placeholderTextColor="#333333"
          onChangeText={handleSearchChange}
          value={searchBarText}
          style={styles.searchBar}
          iconColor="#333333"
          inputStyle={{ color: "#333333", textAlignVertical: "center" }}
          elevation={0}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesHeader}>Order for Delivery!</Text>
        {/* <Button onPress={deleteTable} title="Delete table" color="#841584" /> */}
        <FlatList
          horizontal={true}
          data={categories}
          renderItem={({ item, index }) => {
            return (
              <View>
                <TouchableOpacity
                  style={
                    indexClicked.includes(index)
                      ? styles.activeCategoriesBtns
                      : styles.categoriesBtns
                  }
                  onPress={() => {
                    handleFilter(item, index);
                  }}
                >
                  <Text
                    style={
                      indexClicked.includes(index)
                        ? styles.activeCategoriesTxt
                        : styles.categoriesTxt
                    }
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      </View>
      <FlatList
        style={styles.list}
        data={menu}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
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
  logo: {
    flex: 1,
    width: 220,
    resizeMode: "contain",
  },
  imageContainer: {
    marginLeft: "auto",
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    borderRadius: 30,
  },
  hero: {
    flex: 0.85,
    backgroundColor: "#4D5D57",
    padding: 10,
  },
  displayTitle: {
    fontFamily: "MarkaziTextMedium",
    color: "#F4CE14",
    fontSize: 48,
  },
  subtitle: {
    fontFamily: "MarkaziTextRegular",
    color: "white",
    fontSize: 32,
    marginVertical: -10,
  },
  heroDescription: {
    flexDirection: "row",
    padding: 0,
  },
  heroTxt: {
    fontFamily: "KarlaRegular",
    marginVertical: 10,
    color: "white",
    flex: 0.6,
  },
  heroImg: {
    height: 100,
    backgroundColor: "white",
    resizeMode: "cover",
    flex: 0.4,
    marginTop: -20,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",

    paddingVertical: 20,
    borderBottomWidth: 2,
    borderColor: "#EDEFEE",
  },
  itemTxt: {
    flex: 1,
    marginRight: 10,
  },
  itemImg: {
    width: 100,
    height: 100,
  },
  nameTxt: {
    fontFamily: "KarlaBold",
  },
  descriptionTxt: {
    fontFamily: "KarlaRegular",
    marginVertical: 10,
  },
  priceTxt: {
    fontFamily: "KarlaMedium",
  },
  categoriesContainer: {
    flex: 0.2,
    paddingVertical: 20,

    borderBottomWidth: 2,
    borderColor: "#EDEFEE",
  },
  categoriesTxt: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    color: "#4D5D57",
    fontFamily: "KarlaBold",
  },
  activeCategoriesTxt: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    color: "white",
    fontFamily: "KarlaBold",
  },
  categoriesBtns: {
    marginTop: 10,
    backgroundColor: "#EDEFEE",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  activeCategoriesBtns: {
    backgroundColor: "#495E57",
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  categoriesHeader: {
    fontFamily: "KarlaExtraBold",
    textTransform: "uppercase",
    marginLeft: 20,
  },
  whiteTxt: {
    color: "white",
  },
  searchBar: {
    height: 40,
    backgroundColor: "#e4e4e4",
    shadowRadius: 0,
    shadowOpacity: 0,
  },
});
