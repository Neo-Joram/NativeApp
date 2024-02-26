import { FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { View } from "../../components/Themed";
import { MonoText } from "@/src/components/StyledText";
import { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";

export default function ContactScreen() {
  const [contactList, setContactList] = useState([]);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === "granted") {
          const { data } = await Contacts.getContactsAsync({});
          setContactList(data);
        } else {
          console.log("Contacts permission denied");
        }
      } catch (error) {
        console.error("Permission error: ", error);
      }
    };

    getContacts();
  }, []);

  const groupedContacts = contactList.reduce((groups, contact) => {
    const firstLetter = contact.name[0].toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(contact);
    return groups;
  }, {});

  // Convert the grouped data into an array of objects with letter and items properties
  const groupedData = Object.entries(groupedContacts)
    .slice(0, 100)
    .map(([letter, items]) => ({
      letter,
      items,
    }))
    .sort((a, b) => a.letter.localeCompare(b.letter));

  return (
    <View contentContainerStyle={styles.container}>
      <FlatList
        data={groupedData}
        keyExtractor={(item) => item.letter}
        renderItem={({ item }) => (
          <View style={styles.section} key={item.letter}>
            <MonoText style={styles.sectionTitle}>{item.letter}</MonoText>
            <View style={styles.sectionItems}>
              {item.items.map((contact) => (
                <View style={styles.cardWrapper} key={contact.id}>
                  <TouchableOpacity
                    onPress={() => {
                      // handle onPress
                    }}
                  >
                    <View style={styles.card}>
                      {contact.imageAvailable ? (
                        <Image
                          alt="Profile"
                          resizeMode="cover"
                          source={{ uri: contact.image.uri }}
                          style={styles.cardImg}
                        />
                      ) : (
                        <View style={[styles.cardImg, styles.cardAvatar]}>
                          <MonoText style={styles.cardAvatarMonoText}>
                            {contact.name[0]}
                          </MonoText>
                        </View>
                      )}

                      <View style={styles.cardBody}>
                        <MonoText style={styles.cardTitle}>
                          {contact.name}
                        </MonoText>
                        {contact.phoneNumbers &&
                          contact.phoneNumbers.length > 0 && (
                            <MonoText style={styles.cardPhone}>
                              {contact.phoneNumbers.length > 1
                                ? contact.phoneNumbers[0].number +
                                  "  +  " +
                                  contact.phoneNumbers[1]?.number
                                : contact.phoneNumbers[0].number}
                            </MonoText>
                          )}
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View
                    style={styles.separator}
                    lightColor="#eee"
                    darkColor="rgba(255,255,255,0.1)"
                  />
                </View>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
  },
  /** Section */
  section: {
    marginTop: 12,
    paddingLeft: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  sectionItems: {
    marginTop: 4,
  },
  /** Card */
  card: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  separator: {
    marginVertical: 10,
    height: 1,
  },
  cardImg: {
    width: 42,
    height: 42,
    borderRadius: 12,
  },
  cardAvatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9ca1ac",
  },
  cardAvatarMonoText: {
    fontSize: 19,
    fontWeight: "bold",
  },
  cardBody: {
    marginRight: "auto",
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  cardPhone: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
    marginTop: 3,
  },
});
