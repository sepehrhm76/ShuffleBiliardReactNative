import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [redPottedBallButton, setRedPottedBallButton] = useState(false);
  const [pitokButton, setPitokButton] = useState(false);
  const [pitokCalculated, setPitokCalculated] = useState(false);
  const playerRedRemainingKeepre = useRef(players[currentPlayer].redRemaining);
  const [colorBalls, setColorBalls] = useState([2, 3, 4, 5, 6, 7]);
  const [roundColorBallsPotted, setRoundColorBallsPotted] = useState<number[]>(
    []
  );
  const [colorPottedUndoButton, setColorPottedUndoButton] = useState(false);
  const [redPitokUndo, setRedPitokUndo] = useState(false);
  let turnRedBallPot = useRef(0);
  let redBallsOnTable = useRef(15);
  let redBallsOnpitok = useRef(0);
  let turnPitok = useRef(players[currentPlayer].pitok);

  // Status modal controls
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTitle, setStatusTitle] = useState("");
  const [statusDescription, setStatusDescription] = useState("");
  const lastStatusKey = useRef<string | null>(null);
  const [statusKey, setStatusKey] = useState<"lost" | "win" | "equal" | null>(null);
  players[currentPlayer].isPlayerTurn = true;

  useEffect(() => {
    getGameStatus();
  }, [currentPlayer, colorBalls, redBallsOnTable.current, players]);

  function getGameStatus() {
    // Decide if we should show a status modal; avoid loops by only updating when status changes
    let key: string | null = null;
    let title = "";
    let description = "";

    // 1) Lost case: player's red remaining exceeds balls on table
    if (players[currentPlayer].redRemaining > redBallsOnTable.current) {
      key = "lost";
      title = players[currentPlayer].name + " lost";
      description = `get lost ${players[currentPlayer].name}`;
      setStatusTitle(title);
      setStatusDescription(description);
      setShowStatusModal(true);
      setStatusKey("lost");
    }

    // 2) Win case: player potted their own color ball
    if (
      players[currentPlayer].coloredPottedBalls.includes(
        players[currentPlayer].colorBall
      )
    ) {
      key = "win";
      title = players[currentPlayer].name + " won";
      description = `${players[currentPlayer].name} has won the game by potting their color ball ${players[currentPlayer].colorBall}.`;
      setStatusTitle(title);
      setStatusDescription(description);
      setShowStatusModal(true);
      setStatusKey("win");
    }

    // 3) All assigned color balls have been potted and game is equal
    const playerBalls = players.map((p) => p.colorBall);
    const colorSet = new Set<number>(
      players.flatMap((p) => p.coloredPottedBalls)
    );
    const isSubset = playerBalls.every((b) => colorSet.has(b));

    if (isSubset) {
      key = "equal";
      title = "Game is Equal";
      description = players
        .map((p) => `${p.name}: ${p.colorBall}`)
        .join(", \n");
      setStatusTitle(title);
      setStatusDescription(description);
      setShowStatusModal(true);
      setStatusKey("equal");
    }
  }

  // Helper function to render custom modal
  const renderCustomModal = (
    visible: boolean,
    onClose: () => void,
    options?: {
      title?: string;
      description?: string;
      // Back-compat (right button):
      secondButtonTitle?: string;
      onSecondAction?: () => void;
      // New customizable buttons:
      leftButtonTitle?: string;
      leftButtonOnPress?: () => void;
      leftButtonTextColor?: string;
      rightButtonTitle?: string;
      rightButtonOnPress?: () => void;
      rightButtonTextColor?: string;
      mode?: 'single' | 'dual';
    },
    children?: React.ReactNode
  ) => (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {options?.title && (
            <Text style={styles.modalTitle}>{options.title}</Text>
          )}
          {typeof options?.description !== "undefined" && (
            <Text
              style={[
                styles.modalDescription,
                // allow color override for password modal error
                options?.title === "Enter Password"
                  ? { color: modalError ? "red" : "white" }
                  : { color: "white" },
              ]}
            >
              {options.description}
            </Text>
          )}
          {children}
          {options?.mode === 'single' ? (
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, { width: '100%' }]}
                onPress={onClose}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          ) : (options?.secondButtonTitle || options?.onSecondAction || options?.leftButtonTitle || options?.rightButtonTitle) ? (
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, { borderRightWidth: 0.5, width: '50%' }]}
                onPress={options?.leftButtonOnPress || onClose}
              >
                <Text style={[styles.modalButtonText, options?.leftButtonTextColor ? { color: options.leftButtonTextColor } : null]}>
                  {options?.leftButtonTitle || 'Cancel'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { borderLeftWidth: 0.5, width: '50%' }]}
                onPress={options?.rightButtonOnPress || options?.onSecondAction}
              >
                <Text style={[styles.modalButtonText, options?.rightButtonTextColor ? { color: options.rightButtonTextColor } : null]}>
                  {options?.rightButtonTitle || options?.secondButtonTitle || 'OK'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
  return (
    <MenuProvider>
      <View style={styles.background}>
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={() => setShowPlayersModal(true)}>
            <Ionicons name="menu" size={28} color="white" />
          </TouchableOpacity>
          <View
            style={{
              alignItems: "center",
              width: "85%",
            }}
          >
            <Text style={styles.titleText}>
              {players[currentPlayer].name}'s Turn
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Ionicons name="radio-button-on-outline" size={18} color={"red"} />
            <Text style={{ color: "white" }}>{redBallsOnTable.current}</Text>
          </View>
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
              style={[
                styles.actionButtons,
                { opacity: redBallsOnTable.current !== 0 ? 1 : 0.5 },
              ]}
              disabled={redBallsOnTable.current === 0}
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
              [{players[currentPlayer].coloredPottedBalls.join(", ")}]
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
            <TouchableOpacity
              style={[
                styles.actionButtons,
                { opacity: redBallsOnTable.current !== 0 ? 1 : 0 },
              ]}
              onPress={() => {
                setRedPitokUndo(true);
                redBallsOnTable.current -= 1;
                redBallsOnpitok.current += 1;
                const updatedPlayers = [...players];
                if (!pitokCalculated) {
                  updatedPlayers[currentPlayer].pitok += 1;
                  updatedPlayers[currentPlayer].redRemaining += 1;
                  setPitokCalculated(true);
                }
                setPlayers(updatedPlayers);
              }}
              disabled={redBallsOnTable.current === 0}
            >
              <Ionicons
                name="radio-button-on-outline"
                size={12}
                color={"red"}
              />
              <Ionicons
                name="radio-button-off-outline"
                size={12}
                color={"darkRed"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButtons, { opacity: redPitokUndo ? 1 : 0 }]}
              disabled={!redPitokUndo}
              onPress={() => {
                setPitokCalculated(false);
                redBallsOnpitok.current -= 1;
                const updatedPlayers = [...players];
                redBallsOnTable.current += 1;
                if (turnPitok.current !== updatedPlayers[currentPlayer].pitok) {
                  updatedPlayers[currentPlayer].redRemaining -= 1;
                  updatedPlayers[currentPlayer].pitok -= 1;
                  setPlayers(updatedPlayers);
                }
                if (redBallsOnpitok.current === 0) {
                  setRedPitokUndo(false);
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
        </View>
        <TouchableOpacity
          style={styles.nextPlayerButton}
          onPress={() => {
            setRedPottedBallButton(false);
            setPitokButton(false);
            setColorPottedUndoButton(false);
            setRedPitokUndo(false);
            setPitokCalculated(false);
            turnRedBallPot.current = 0;
            redBallsOnpitok.current = 0;
            setRoundColorBallsPotted([]);
            players[currentPlayer].isPlayerTurn = false;
            playerRedRemainingKeepre.current =
              players[(currentPlayer + 1) % players.length].redRemaining;
            setCurrentPlayer((p) => (p + 1) % players.length);
          }}
        >
          <Text style={{ color: "white", fontSize: 20 }}>End Turn</Text>
        </TouchableOpacity>
        {/* Password Dialog Modal */}
        {renderCustomModal(
          showPasswordDialog,
          () => {
            setPasswordDialog(false);
            setModalError(false);
          },
          {
            title: "Enter Password",
            description: modalError
              ? "Password is not Correct!"
              : "Please Enter Your Password:",
            secondButtonTitle: "Confirm",
            onSecondAction: () => {
              setPassword("");
              if (password === players[currentPlayer].password) {
                setPasswordDialog(false);
                setModalError(false);
                setBallDialog(true);
              } else {
                setModalError(true);
              }
            },
          },
          <>
            <TextInput
              style={styles.modalInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#aaa"
            />
          </>
        )}
        {/* Ball Dialog Modal */}
        {renderCustomModal(
          showBallDialog,
          () => setBallDialog(false),
          {
            title: "Your Ball is:",
            description: players[currentPlayer].colorBall.toString(),
          },
          <View style={styles.modalButtonRow}>
            <TouchableOpacity
              style={[styles.modalButton, { width: "100%" }]}
              onPress={() => setBallDialog(false)}
            >
              <Text style={styles.modalButtonText}>Ok</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Players Modal */}
        {renderCustomModal(
          showPlayersModal,
          () => setShowPlayersModal(false),
          { title: "Players" },
          <>
            <View style={{ width: "100%", padding: 16 }}>
              {players.map((player, index) => (
                <View key={index} style={styles.playersList}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#1C7630",
                      width: "100%",
                      marginHorizontal: 6,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 10,
                      opacity: player.isPlayerTurn ? 0.5 : 1,
                    }}
                    onPress={() => {
                      setShowPlayersModal(false);
                      if (player.isPlayerTurn) return;
                      setRedPottedBallButton(false);
                      setPitokButton(false);
                      setColorPottedUndoButton(false);
                      setRedPitokUndo(false);
                      setPitokCalculated(false);
                      turnRedBallPot.current = 0;
                      redBallsOnpitok.current = 0;
                      setRoundColorBallsPotted([]);
                      players[currentPlayer].isPlayerTurn = false;
                      playerRedRemainingKeepre.current =
                        players[
                          (currentPlayer + 1) % players.length
                        ].redRemaining;
                      setCurrentPlayer(index);
                    }}
                  >
                    <Text style={styles.titleText}>{[player.name]}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { borderRightWidth: 0.5, width: "50%" },
                ]}
                onPress={() => {
                  setShowPlayersModal(false);
                  router.replace("/HomeScreen");
                }}
              >
                <Text style={[styles.modalButtonText, { color: "red" }]}>
                  Exit Game
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { borderLeftWidth: 0.5, width: "50%" },
                ]}
                onPress={() => {
                  setShowPlayersModal(false);
                }}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Status Modal */}
        {renderCustomModal(
          showStatusModal,
          () => setShowStatusModal(false),
          statusKey === 'win' || statusKey === 'equal'
            ? {
                title: statusTitle,
                description: statusDescription,
                // Left = Exit Game (red) -> exits
                leftButtonTitle: 'Exit Game',
                leftButtonTextColor: 'red',
                leftButtonOnPress: () => router.replace('/HomeScreen'),
                // Right = OK -> dismiss
                rightButtonTitle: 'OK',
                rightButtonOnPress: () => setShowStatusModal(false),
              }
            : {
                title: statusTitle,
                description: statusDescription,
                mode: 'single', // only OK, dismisses
              }
        )}
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
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginHorizontal: 16,
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

  playersList: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
    width: "100%",
  },
});
