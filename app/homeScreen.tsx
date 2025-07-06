import { Ionicons } from "@expo/vector-icons";
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
import { usePlayers } from "./Context/PlayerContext";
import { Player } from "./Models/Player";
const HomeScreen = () => {
  const router = useRouter();
  const { setPlayers } = usePlayers();
  const [selectRedBallCount, setSelectRedBallCount] = useState<number>(3);
  const redBalls = [1, 2, 3, 4, 5];
  const colorBalls = [2, 3, 4, 5, 6, 7];
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
          <View style={styles.topButtonsContainer}>
            <TouchableOpacity style={styles.loadPlayersButton}>
              <Ionicons name="cloud-outline" size={24} color="white" />
            </TouchableOpacity>
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
          </View>
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
                        color: num === selectRedBallCount ? "black" : "white",
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
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View>
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
                ListFooterComponent={
                  <TouchableOpacity
                    onPress={() => {
                      const players: Player[] = playerFields.map(
                        (name, index) => {
                          const randomColorBall = Math.floor(
                            Math.random() * colorBalls.length
                          );
                          const colorBall = colorBalls[randomColorBall];
                          colorBalls.splice(randomColorBall, 1);

                          return {
                            id: index,
                            name: name,
                            colorBall: colorBall,
                            redRemaining: selectRedBallCount,
                            password: undefined,
                            isWinner: false,
                            coloredPottedBalls: [1, 2],
                            redPottedBalls: 0,
                            pitok: 0,
                            isPlayerTurn: false,
                          };
                        }
                      );
                      setPlayers(players);
                      router.push("/AssignBallsScreen");
                    }}
                    style={[
                      styles.assignBallsButton,
                      {
                        opacity:
                          playerFields.length < 2
                            ? 0
                            : playerFields.every((name) => name.trim() !== "")
                            ? 1
                            : 0.5,
                      },
                    ]}
                    disabled={
                      !(
                        playerFields.length >= 2 &&
                        playerFields.every((name) => name.trim() !== "")
                      )
                    }
                  >
                    <Text style={{ color: "white", fontSize: 20 }}>
                      Assign Balls
                    </Text>
                  </TouchableOpacity>
                }
              />
            </View>
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
    flexDirection: "column",
    backgroundColor: "#1C1C1E",
    gap: 20,
  },

  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 60,
  },

  addPlayerButton: {
    width: 50,
    height: 50,
    backgroundColor: "#1C7630",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  loadPlayersButton: {
    width: 50,
    height: 50,
    backgroundColor: "#1C7630",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  redBallsSection: {
    alignItems: "center",
    height: 100,
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
