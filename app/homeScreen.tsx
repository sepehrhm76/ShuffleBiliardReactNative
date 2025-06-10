import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from "react-native-popup-menu";
import Ionicons from "react-native-vector-icons/Ionicons";

const HomeScreen = () => {
  const router = useRouter();
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.background}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <FlatList
              data={playerFields}
              keyExtractor={(_, index) => index.toString()}
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
                    <Ionicons
                      name="remove-circle-outline"
                      size={24}
                      color="red"
                    />
                  </TouchableOpacity>
                </View>
              )}
              ListHeaderComponent={
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
                          borderRadius: 25,
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
                              color:
                                num === selectRedBallCount ? "black" : "white",
                              fontSize: 20,
                            },
                            optionWrapper: {
                              marginVertical: 4,
                            },
                          }}
                        />
                      ))}
                    </MenuOptions>
                  </Menu>
                </View>
              }
              ListFooterComponent={
                <TouchableOpacity
                  onPress={() => router.push("/AssignBallsScreen")}
                  style={[
                    styles.assignBallsButton,
                    { opacity: playerFields.length > 1 ? 1 : 0 },
                  ]}
                >
                  <Text style={{ color: "white", fontSize: 20 }}>
                    Assign Balls
                  </Text>
                </TouchableOpacity>
              }
            />
            <TouchableOpacity
              style={[
                styles.addPlayerButton,
                playerFields.length === 6 && { opacity: 0.5 },
              ]}
              disabled={playerFields.length === 6}
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
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </MenuProvider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },

  addPlayerButton: {
    position: "absolute",
    top: 50,
    right: 16,
    width: 50,
    height: 50,
    backgroundColor: "#1C7630",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  loadPlayersButton: {
    position: "absolute",
    top: 50,
    right: 76,
    width: 50,
    height: 50,
    backgroundColor: "#1C7630",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  redBallsSection: {
    alignItems: "center",
    marginTop: 150,
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
    borderRadius: 25,
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

  assignBallsButton: {
    backgroundColor: "#1C7630",
    height: 50,
    marginHorizontal: 16,
    marginBottom: 20,
    marginTop: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
