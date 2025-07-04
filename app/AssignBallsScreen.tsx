import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
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
import { usePlayers } from "./Context/PlayerContext";

const AssignBallsScreen = () => {
  const router = useRouter();
  const { players, setPlayers } = usePlayers();
  const [playerQueue, setPlayerQueue] = useState([...players]);
  const [password, setPassword] = useState("");
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | number>(2000);

  const handlePress = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      timerRef.current = setTimeout(() => {
        setIsFlipped(false);
      }, 2000);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsFlipped(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.background}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <FlatList
            data={[{ key: "content" }]}
            renderItem={() =>
              playerQueue.length > 0 ? (
                <>
                  <Text style={styles.label}>
                    {playerQueue[0].name}, take phone:
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.ballCarts,
                      { backgroundColor: isFlipped ? "gray" : "white" },
                    ]}
                    onPress={handlePress}
                  >
                    <Text style={{ fontSize: 20 }}>
                      {isFlipped
                        ? playerQueue[0].colorBall
                        : playerQueue[0].name}
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.textField}
                    placeholder="Set a password"
                    secureTextEntry={true}
                    placeholderTextColor="#ccc"
                    value={password}
                    onChangeText={setPassword}
                  />
                </>
              ) : (
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    marginTop: 100,
                  }}
                >
                  No players available
                </Text>
              )
            }
          />
        </KeyboardAvoidingView>
        <TouchableOpacity
          onPress={() => {
            const currentPlayer = playerQueue[0];
            const updatedPlayers = players.map((p) =>
              p.id === currentPlayer.id ? { ...p, password } : p
            );
            setPlayers(updatedPlayers);
            setPlayerQueue((prevQueue) => prevQueue.slice(1));
            setPassword("");
            setIsFlipped(false);
            if (playerQueue.length === 1) {
              router.push("/GameScreen");
            }
          }}
          style={[
            styles.nextButton,
            { opacity: password.length > 0 ? 1 : 0.5 },
          ]}
          disabled={!password}
        >
          <Text style={{ color: "white", fontSize: 20 }}>
            {playerQueue.length === 1 ? "Start Game" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#1C1C1E",
  },

  label: {
    marginTop: 100,
    color: "white",
    fontSize: 25,
    textAlign: "center",
  },

  ballCarts: {
    marginTop: 100,
    marginHorizontal: 20,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 5,
    borderColor: "#1C7630",
  },

  textField: {
    marginTop: 50,
    height: 40,
    backgroundColor: "#2E2E2E",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    color: "white",
  },

  nextButton: {
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
});

export default AssignBallsScreen;
