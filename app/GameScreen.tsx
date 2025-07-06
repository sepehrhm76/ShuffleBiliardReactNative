import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { usePlayers } from "./Context/PlayerContext";
const GameScreen = () => {
  const { players, setPlayers } = usePlayers();
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [ballInput, setBallInput] = useState("");
  console.log(players);
  return (
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
            onPress={() => setShowDialog(true)}
          >
            <Ionicons name="eye-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.inLineItems}>
          <Text style={styles.itemsText}>Red Ball Pots:</Text>
          <TouchableOpacity style={styles.actionButtons}>
            <Ionicons name="ellipse" size={24} color="red" />
          </TouchableOpacity>
          <Text style={styles.valuesText}>
            {players[currentPlayer].redPottedBalls}
          </Text>
        </View>
        <View style={styles.inLineItems}>
          <Text style={styles.itemsText}>Select Color Balls:</Text>
          <TouchableOpacity style={styles.actionButtons}>
            <Ionicons name="ellipse" size={24} color="green" />
          </TouchableOpacity>
        </View>
        <View style={styles.inLineItems}>
          <Text style={styles.itemsText}>Color Balls Potted:</Text>
          <Text style={styles.valuesText}>
            {players[currentPlayer].coloredPottedBalls}
          </Text>
        </View>
        <View style={styles.inLineItems}>
          <Text style={styles.itemsText}>Pitok:</Text>
          <TouchableOpacity
            style={[styles.actionButtons, { backgroundColor: "red" }]}
          >
            <Ionicons name="add-outline" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.valuesText}>{players[currentPlayer].pitok}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.nextPlayerButton}
        onPress={() => {
          setCurrentPlayer((p) => (p + 1) % players.length);
        }}
      >
        <Text style={{ color: "white", fontSize: 20 }}>End Turn</Text>
      </TouchableOpacity>
      <Modal
        visible={showDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDialog(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter your Password:</Text>
            <TextInput
              style={styles.modalInput}
              value={ballInput}
              onChangeText={setBallInput}
              placeholder="Password"
              placeholderTextColor="#aaa"
              keyboardType="number-pad"
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity onPress={() => setShowDialog(false)}>
                <Text style={styles.modalButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  console.log("Entered:", ballInput);
                  setShowDialog(false);
                }}
              >
                <Text style={styles.modalButton}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GameScreen;

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
    padding: 20,
    borderRadius: 10,
    width: 250,
  },

  modalTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },

  modalInput: {
    backgroundColor: "#1c1c1e",
    color: "white",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 30,
    marginBottom: 20,
  },

  modalButtonRow: {
    flexDirection: "row",
    marginHorizontal: 20,
  },

  modalButton: {
    color: "#007AFF",
    backgroundColor: "red",
    fontSize: 16,
    borderWidth: 2,
  },
});
