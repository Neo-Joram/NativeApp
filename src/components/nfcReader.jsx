import React, { useEffect, useState } from "react";
import { MonoText } from "./StyledText";
import { View } from "./Themed";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import { Button } from "react-native";

NfcManager.start();

export default function NFCReader() {
  const [tagData, setTagData] = useState({});

  const [nfcSupported, setNfcSupported] = useState(false);

  useEffect(() => {
    async function checkNfcSupport() {
      try {
        console.log(await NfcManager.registerTagEvent());
        // setNfcSupported(support);
      } catch (ex) {
        console.warn("NFC is not supported on this device", ex);
      }
    }

    checkNfcSupport();
  }, []);

  async function readNdef() {
    if (nfcSupported) {
      try {
        await NfcManager.requestTechnology(NfcTech.Ndef);

        const tag = await NfcManager.getTag();
        console.warn("Tag found", tag);
        setTagData({ tag });
      } catch (ex) {
        console.warn("Oops!", ex);
      } finally {
        // stop the nfc scanning
        NfcManager.cancelTechnologyRequest();
      }
    } else {
      console.log("NFC not supported");
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <MonoText>NFC Reader</MonoText>
      {tagData && tagData.tag && (
        <View style={{ marginTop: 20 }}>
          <MonoText>Tag Data:</MonoText>
          <MonoText>{JSON.stringify(tagData.tag)}</MonoText>
        </View>
      )}
      <Button title="Read NFC" onPress={readNdef} />
    </View>
  );
}
