import { StyleSheet, TextInput } from "react-native";

import { Text, View } from "@/src/components/Themed";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ContactUs() {
  const [email, onChangeEmail] = useState("");
  const [message, onChangeMessage] = useState("");
  return (
    <View style={styles.container}>
      <View style={styles.account}>
        <MaterialCommunityIcons
          name="album"
          size={100}
          color="black"
          onPress={() => drawer.current.openDrawer()}
        />
        <Text style={styles.logoText}>Neo Mobile</Text>
      </View>

      <View style={styles.feedback}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          placeholder="Your email"
        />
        <TextInput
          editable
          multiline
          numberOfLines={4}
          style={styles.textarea}
          placeholder="Your message"
          onChangeText={onChangeMessage}
        />
      </View>
      <View style={styles.review}>
        <Text style={styles.viewEmail}>Email: {email}</Text>
        <Text style={styles.viewMessage}>Message: {message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  account: {
    width: "100%",
    height: 250,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 26,
    fontWeight: "bold",
  },

  feedback: {
    width: "100%",
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  input: {
    borderWidth: 2,
    width: "80%",
    height: 40,
    borderRadius: 15,
    paddingHorizontal: 12,
    borderColor: "#ccc",
  },
  textarea: {
    borderWidth: 2,
    width: "80%",
    borderRadius: 15,
    paddingHorizontal: 12,
    borderColor: "#ccc",
  },
  review: {
    width: "100%",
    height: 250,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
