import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Modal,
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
import { usePlayers } from "./Context/PlayerContext";
const gameScreen = () => {
  const { players, setPlayers } = usePlayers();
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [showPasswordDialog, setPasswordDialog] = useState(false);
  const [showBallDialog, setBallDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [modalError, setModalError] = useState(false);
  const [redPottedBallButton, setRedPottedBallButton] = useState(false);
  const [pitokButton, setPitokButton] = useState(false);
  const playerRedRemainingKeepre = useRef(players[currentPlayer].redRemaining);
  const [colorBalls, setColorBalls] = useState([2, 3, 4, 5, 6, 7]);
  const [roundColorBallsPotted, setRoundColorBallsPotted] = useState<number[]>(
    []
  );
  const [colorPottedUndoButton, setColorPottedUndoButton] = useState(false);
  let turnRedBallPot = useRef(0);
  let redBallsOnTable = useRef(15);
  let turnPitok = useRef(players[currentPlayer].pitok);

  return (
    <MenuProvider>
      <View style={styles.background}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            {players[currentPlayer].name}'s Turn
          </Text>
        </View>
        <View style={styles.itemsContainer}>
          <View style={styles.inLineItems}>
            <Text style={styles.itemsText}>Red Ball Remaining:</Text>
            <Text style={styles.valuesText}>
              {players[currentPlayer].redRemaining}
            </Text>
          </View>
          <View style={styles.inLineItems}>
            <Text style={styles.itemsText}>Show Your Color Ball:</Text>
            <TouchableOpacity
              style={[styles.actionButtons, { backgroundColor: "#007AFF" }]}
              onPress={() => setPasswordDialog(true)}
            >
              <Ionicons name="eye-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.inLineItems}>
            <Text style={styles.itemsText}>Red Ball Pots:</Text>
            <TouchableOpacity
              style={styles.actionButtons}
              onPress={() => {
                setRedPottedBallButton(true);
                const updatedPlayers = [...players];
                turnRedBallPot.current += 1;
                redBallsOnTable.current -= 1;
                updatedPlayers[currentPlayer].redPottedBalls += 1;
                if (updatedPlayers[currentPlayer].redRemaining > 0) {
                  updatedPlayers[currentPlayer].redRemaining -= 1;
                }
                setPlayers(updatedPlayers);
              }}
            >
              <Ionicons name="ellipse" size={24} color="red" />
            </TouchableOpacity>
            <Text style={styles.valuesText}>
              {players[currentPlayer].redPottedBalls}
            </Text>

            <TouchableOpacity
              style={[
                styles.actionButtons,
                { opacity: redPottedBallButton ? 1 : 0 },
              ]}
              disabled={!redPottedBallButton}
              onPress={() => {
                const updatedPlayers = [...players];
                turnRedBallPot.current -= 1;
                redBallsOnTable.current += 1;
                updatedPlayers[currentPlayer].redPottedBalls -= 1;
                if (turnRedBallPot.current < playerRedRemainingKeepre.current) {
                  updatedPlayers[currentPlayer].redRemaining += 1;
                }

                if (turnRedBallPot.current === 0) {
                  setRedPottedBallButton(false);
                }

                setPlayers(updatedPlayers);
              }}
            >
              <Ionicons name="ellipse" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View style={styles.inLineItems}>
            <Text style={styles.itemsText}>Select Color Balls:</Text>
            <Menu>
              <MenuTrigger disabled={players[currentPlayer].redRemaining != 0}>
                <View
                  style={[
                    styles.actionButtons,
                    {
                      opacity:
                        players[currentPlayer].redRemaining === 0 ? 1 : 0.5,
                    },
                  ]}
                >
                  <Ionicons name="ellipse" size={24} color="green" />
                </View>
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    backgroundColor: "white",
                    width: 50,
                    borderRadius: 10,
                    alignItems: "center",
                  },
                }}
              >
                {colorBalls.map((num) => (
                  <MenuOption
                    key={num}
                    onSelect={() => {
                      const updatedPlayers = [...players];
                      updatedPlayers[currentPlayer].coloredPottedBalls.push(
                        num
                      );
                      setRoundColorBallsPotted((prev) => [...prev, num]);
                      setColorPottedUndoButton(true);
                      setPlayers(updatedPlayers);
                      setColorBalls((prev) => prev.filter((c) => c !== num));
                    }}
                    text={`${num}`}
                    customStyles={{
                      optionText: {
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
          <View style={styles.inLineItems}>
            <Text style={styles.itemsText}>Color Balls Potted:</Text>
            <Text style={styles.valuesText}>
              {players[currentPlayer].coloredPottedBalls}
            </Text>
            <TouchableOpacity
              style={[
                styles.actionButtons,
                { opacity: colorPottedUndoButton ? 1 : 0 },
              ]}
              disabled={!colorPottedUndoButton}
              onPress={() => {
                const last =
                  roundColorBallsPotted[roundColorBallsPotted.length - 1];
                setRoundColorBallsPotted((prev) => prev.slice(0, -1));

                const updatedPlayers = [...players];
                const colorIndex =
                  updatedPlayers[currentPlayer].coloredPottedBalls.lastIndexOf(
                    last
                  );
                if (colorIndex !== -1) {
                  updatedPlayers[currentPlayer].coloredPottedBalls.splice(
                    colorIndex,
                    1
                  );
                }

                setPlayers(updatedPlayers);
                setColorBalls((prev) => [...prev, last].sort((a, b) => a - b));
                if (roundColorBallsPotted.length - 1 === 0) {
                  setColorPottedUndoButton(false);
                }
              }}
            >
              <Ionicons
                name="arrow-undo-circle-outline"
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inLineItems}>
            <Text style={styles.itemsText}>Pitok:</Text>
            <TouchableOpacity
              style={[styles.actionButtons, { backgroundColor: "red" }]}
              onPress={() => {
                setPitokButton(true);
                const updatedPlayers = [...players];
                updatedPlayers[currentPlayer].pitok += 1;
                updatedPlayers[currentPlayer].redRemaining += 1;
                setPlayers(updatedPlayers);
              }}
            >
              <Ionicons name="add-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.valuesText}>
              {players[currentPlayer].pitok}
            </Text>
            <TouchableOpacity
              style={[
                styles.actionButtons,
                { backgroundColor: "red", opacity: pitokButton ? 1 : 0 },
              ]}
              disabled={!pitokButton}
              onPress={() => {
                const updatedPlayers = [...players];
                if (updatedPlayers[currentPlayer].redRemaining > 0) {
                  updatedPlayers[currentPlayer].redRemaining -= 1;
                }
                updatedPlayers[currentPlayer].pitok -= 1;
                setPlayers(updatedPlayers);

                if (turnPitok.current === updatedPlayers[currentPlayer].pitok) {
                  setPitokButton(false);
                }
              }}
            >
              <Ionicons name="remove-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.nextPlayerButton}
          onPress={() => {
            setRedPottedBallButton(false);
            setPitokButton(false);
            setColorPottedUndoButton(false);
            turnRedBallPot.current = 0;
            setRoundColorBallsPotted([]);
            playerRedRemainingKeepre.current =
              players[(currentPlayer + 1) % players.length].redRemaining;
            setCurrentPlayer((p) => (p + 1) % players.length);
          }}
        >
          <Text style={{ color: "white", fontSize: 20 }}>End Turn</Text>
        </TouchableOpacity>
        <Modal visible={showPasswordDialog} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Password</Text>
              <Text
                style={[
                  styles.modalDescription,
                  { color: modalError ? "red" : "white" },
                ]}
              >
                {modalError
                  ? "Password is not Correct!"
                  : "Please Enter Your Password:"}
              </Text>
              <TextInput
                style={styles.modalInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#aaa"
              />
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { borderRightWidth: 0.5, width: "50%" },
                  ]}
                  onPress={() => {
                    setPasswordDialog(false);
                    setModalError(false);
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { borderLeftWidth: 0.5, width: "50%" },
                  ]}
                  onPress={() => {
                    setPassword("");
                    if (password === players[currentPlayer].password) {
                      setPasswordDialog(false);
                      setModalError(false);
                      setBallDialog(true);
                    } else {
                      setModalError(true);
                    }
                  }}
                >
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal visible={showBallDialog} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Your Ball is:</Text>
              <Text style={[styles.modalDescription, { color: "white" }]}>
                {players[currentPlayer].colorBall}
              </Text>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, { width: "100%" }]}
                  onPress={() => {
                    setBallDialog(false);
                  }}
                >
                  <Text style={styles.modalButtonText}>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </MenuProvider>
  );
};

export default gameScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#1C1C1E",
  },

  titleContainer: {
    alignItems: "center",
    marginTop: 50,
  },

  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },

  itemsContainer: {
    alignItems: "flex-start",
    flexDirection: "column",
    marginLeft: 20,
    marginTop: 40,
    gap: 40,
  },

  itemsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  valuesText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },

  inLineItems: {
    flexDirection: "row",
    alignItems: "center",
  },

  actionButtons: {
    backgroundColor: "white",
    width: 35,
    height: 35,
    marginLeft: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  nextPlayerButton: {
    position: "absolute",
    bottom: 50,
    left: 16,
    right: 16,
    height: 50,
    backgroundColor: "#1C7630",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#2c2c2e",
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginTop: 20,
  },

  modalDescription: {
    fontSize: 13,
    marginTop: 5,
  },

  modalInput: {
    backgroundColor: "#1c1c1e",
    color: "white",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    height: 30,
    width: "90%",
    marginTop: 20,
    paddingLeft: 10,
  },

  modalButtonRow: {
    flexDirection: "row",
    width: "100%",
    borderTopWidth: 1,
    borderColor: "#444",
    marginTop: 10,
  },

  modalButton: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#444",
  },

  modalButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
});
