import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("little_lemon");

export async function createTable() {
  // console.log("createtable is run");
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists menuitems (id integer primary key not null, name text, description text, price text, image text, category text);"
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  // console.log("getmenuutems function is run");
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql("select * from menuitems", [], (_, { rows }) => {
        resolve(rows._array);
        // console.log("see existing rows", JSON.stringify(rows));
      });
    });
  });
}

export function saveMenuItems(menuItems) {
  // console.log("MENUITEMS IN SAVE MENU ITEMS FUNCTION IS", menuItems);
  db.transaction((tx) => {
    for (let i = 0; i < menuItems.length; i++) {
      tx.executeSql(
        "INSERT INTO menuitems(id, name, description, price, image, category) VALUES (?,?,?,?,?,?)",
        [
          menuItems[i].id,
          menuItems[i].name,
          menuItems[i].description,
          menuItems[i].price,
          menuItems[i].image,
          menuItems[i].category,
        ]
      );
    }
  });
}

export async function deleteTable() {
  // console.log("delete table");
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql("delete from menuitems", [], (_, { rows }) => {
        resolve(rows._array);
        // console.log("see existing rows after deletion", JSON.stringify(rows));
      });
    });
  });
}

export async function filterByCategories(filteredCategory, categories, query) {
  let menuCategory;
  if (filteredCategory.length == 0) {
    menuCategory = "'" + categories.join("', '") + "'";
  } else {
    menuCategory = "'" + filteredCategory.join("', '") + "'";
  }

  // console.log("menucategory is", menuCategory);
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * from menuitems WHERE name like '%${query}%' and category IN (${menuCategory});`,

        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        reject
      );
    });
  });
}
