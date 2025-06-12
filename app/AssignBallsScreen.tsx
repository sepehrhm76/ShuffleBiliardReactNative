import React, { useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const AssignBallsScreen = () => {
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
        <Text style={styles.label}>Sepehr, take phone:</Text>
        <TouchableOpacity
          style={[
            styles.ballCarts,
            { backgroundColor: isFlipped ? "gray" : "white" },
          ]}
          onPress={handlePress}
        >
          <Text style={{ fontSize: 20 }}>{isFlipped ? "2" : "Sepehr"}</Text>
        </TouchableOpacity>

        <TextInput style={styles.textField} placeholder="Type here" />

        <TouchableOpacity style={styles.nextButton}>
          <Text style={{ color: "white", fontSize: 20 }}>Next</Text>
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
    gap: 20,
  },

  label: {
    marginTop: 60,
    color: "white",
    fontSize: 25,
    textAlign: "center",
  },

  ballCarts: {
    marginHorizontal: 20,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 5,
    borderColor: "#1C7630",
  },

  textField: {
    height: 40,
    backgroundColor: "#2E2E2E",
    borderRadius: 8,
    marginHorizontal: 20,
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
