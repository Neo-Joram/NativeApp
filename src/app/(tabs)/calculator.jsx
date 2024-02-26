import { StyleSheet, TouchableOpacity } from "react-native";

import { View } from "@/src/components/Themed";
import { useState } from "react";
import { MonoText } from "@/src/components/StyledText";

export default function Calculator() {
  const [display, setDisplay] = useState("");
  const [operator, setOperator] = useState("");

  const handleNumberPress = (number) => {
    if (display === "") {
      setDisplay(number);
    } else {
      setDisplay((prevDisplay) => {
        const lastChar = prevDisplay.length > 0 ? prevDisplay.slice(-1) : "";

        if (/\+|\-|\*|\//.test(lastChar)) {
          return prevDisplay + `${number}`;
        } else {
          return prevDisplay + "" + number;
        }
      });
    }
  };

  const handleOperatorPress = (op) => {
    if (operator === "") {
      setOperator(op);
      setDisplay((prevDisplay) => prevDisplay + `${op}`);
    } else {
      const result = calculateResult();
      setDisplay(`${result}${op}`);
      setOperator(op);
    }
  };

  const calculateResult = () => {
    return eval(display);
  };

  const handleClearPress = () => {
    setDisplay("");
    setOperator("");
  };

  const handleEqualPress = () => {
    const result = calculateResult();
    setDisplay(`${result}`);
    setOperator("");
  };
  return (
    <>
      <View style={styles.displayContainer}>
        <MonoText style={styles.displayText}>{display}</MonoText>
      </View>

      <View style={styles.calcNbrs}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNumberPress(7)}
        >
          <MonoText style={styles.buttonText}>7</MonoText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNumberPress(8)}
        >
          <MonoText style={styles.buttonText}>8</MonoText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNumberPress(9)}
        >
          <MonoText style={styles.buttonText}>9</MonoText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleOperatorPress("/")}
        >
          <MonoText style={styles.buttonText}>/</MonoText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNumberPress(4)}
        >
          <MonoText style={styles.buttonText}>4</MonoText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNumberPress(5)}
        >
          <MonoText style={styles.buttonText}>5</MonoText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNumberPress(6)}
        >
          <MonoText style={styles.buttonText}>6</MonoText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleOperatorPress("*")}
        >
          <MonoText style={styles.buttonText}>*</MonoText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNumberPress(1)}
        >
          <MonoText style={styles.buttonText}>1</MonoText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNumberPress(2)}
        >
          <MonoText style={styles.buttonText}>2</MonoText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNumberPress(3)}
        >
          <MonoText style={styles.buttonText}>3</MonoText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleOperatorPress("-")}
        >
          <MonoText style={styles.buttonText}>-</MonoText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNumberPress(0)}
        >
          <MonoText style={styles.buttonText}>0</MonoText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNumberPress(".")}
        >
          <MonoText style={styles.buttonText}>.</MonoText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleEqualPress("=")}
        >
          <MonoText style={styles.buttonText}>=</MonoText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleOperatorPress("+")}
          onLongPress={handleClearPress}
        >
          <MonoText style={styles.buttonText}>+ / C</MonoText>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  displayContainer: {
    width: "100%",
    height: 400,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  displayText: {
    fontSize: 50,
    fontWeight: "bold",
  },
  calcNbrs: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  button: {
    width: "22%",
    minHeight: 100,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "whitesmoke",
    shadowOffset: 4,
  },
  operators: {
    width: "100%",
    height: "50%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  operator: {
    width: "18%",
    height: "20%",
    backgroundColor: "#fff",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 24,
  },
});
