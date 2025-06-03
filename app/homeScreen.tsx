import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from "react-native-popup-menu";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function HomeScreen() {
  const [selectRedBallCount, setSelectRedBallCount] = useState<number>(3);
  const redBalls = [1, 2, 3, 4, 5];
  const [playerFields, setPlayerFields] = useState<string[]>([]);

  const removePlayerField = (index: number) => {
    const updated = [...playerFields];
    updated.splice(index, 1);
    setPlayerFields(updated);
  };

  return (
    <MenuProvider>
      <SafeAreaView style={styles.background}>
        <View style={styles.redBallsSection}>
          <Text style={styles.redBallsCountToFreeText}>
            Red Balls Count To Free:
          </Text>
          <Menu>
            <MenuTrigger>
              <View style={styles.menuButton}>
                <Text style={styles.selectedRedBallCountText}>
                  {selectRedBallCount}
                </Text>
              </View>
            </MenuTrigger>
            <MenuOptions
              customStyles={{
                optionsContainer: {
                  backgroundColor: "#1A5E49",
                  width: 50,
                  borderRadius: 8,
                  alignItems: "center",
                },
              }}
            >
              {redBalls.map((num) => (
                <MenuOption
                  key={num}
                  onSelect={() => setSelectRedBallCount(num)}
                  text={`${num}`}
                  customStyles={{
                    optionText: {
                      color: num === selectRedBallCount ? "black" : "white",
                    },
                  }}
                />
              ))}
            </MenuOptions>
          </Menu>
        </View>

        <FlatList
          data={playerFields}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.textFieldList}
          renderItem={({ item, index }) => (
            <View style={styles.textFieldContainer}>
              <TextInput
                style={styles.textField}
                value={item}
                onChangeText={(text) => {
                  const updated = [...playerFields];
                  updated[index] = text;
                  setPlayerFields(updated);
                }}
                placeholder={`Enter player ${index + 1} name`}
                placeholderTextColor="#ccc"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePlayerField(index)}
              >
                <Ionicons name="remove-circle-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.addPlayerButton}
          onPress={() => {
            if (playerFields.length < 6) {
              setPlayerFields([...playerFields, ""]);
            }
          }}
        >
          <Ionicons name="person-add-outline" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.loadPlayersButton}>
          <Ionicons name="cloud-outline" size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },

  addPlayerButton: {
    position: "absolute",
    top: 80,
    right: 16,
    width: 50,
    height: 50,
    backgroundColor: "#1C7630",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  loadPlayersButton: {
    position: "absolute",
    top: 80,
    right: 76,
    width: 50,
    height: 50,
    backgroundColor: "#1C7630",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  redBallsSection: {
    alignItems: "center",
    marginTop: 100,
  },

  redBallsCountToFreeText: {
    fontSize: 20,
    color: "white",
    marginBottom: 16,
  },

  menuButton: {
    backgroundColor: "#1C7630",
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },

  selectedRedBallCountText: {
    fontSize: 20,
    color: "white",
  },

  textFieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 50,
    marginTop: 20,
  },

  removeButton: {
    marginLeft: 10,
    tintColor: "red",
  },

  textField: {
    flex: 1,
    height: 40,
    backgroundColor: "#2E2E2E",
    color: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
  },

  textFieldList: {
    paddingBottom: 120,
  },
});
