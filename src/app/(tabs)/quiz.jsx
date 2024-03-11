import { StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { Icon, MD3Colors } from "react-native-paper";
import { MonoText } from "@/src/components/StyledText";
import { TextInput, Button } from "react-native-paper";

export default function QuizScreen() {
  return (
    <View>
      <View style={[styles.title, { paddingVertical: 20 }]}>
        <Icon source="account-group-outline" color={"white"} size={200} />
      </View>

      <View style={styles.title}>
        <MonoText style={{ fontSize: 50 }}>Login</MonoText>
        <Text>Please login to your account</Text>
      </View>

      <View style={styles.loginForm}>
        <TextInput label={"Email"} mode="outlined" placeholder="Email..." />
        <TextInput
          label={"Password"}
          mode="outlined"
          placeholder="Password..."
          secureTextEntry
          right={<TextInput.Icon icon="eye" />}
        />
        <Button mode="contained" onPress={() => console.log("Pressed")}>
          Login
        </Button>
      </View>

      <View style={[styles.title, { gap: 20 }]}>
        <MonoText style={{}}>Or login with your Email</MonoText>
        <MonoText style={{}}>If you are new, Create an account</MonoText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
});
