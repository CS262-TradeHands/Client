// Micah Wakefield 
// 2024-06-20 
// Prototype design pattern example in Java 
// This is the first step in our journey in developing 'hand shake' software. 
// The goal is to create a system that connects with people new to the buisness world with the older, or retiring. 
////////////////////////////////////////////////////

import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";

// User Profile Class Equivalent
class UserProfile {
  constructor(name, age, industry, experienceLevel) {
    this.name = name;
    this.age = age;
    this.industry = industry;
    this.experienceLevel = experienceLevel;
  }
}

export default function App() {
  const [profiles, setProfiles] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [industry, setIndustry] = useState("");
  const [experience, setExperience] = useState("");

  const addProfile = () => {
    const newProfile = new UserProfile(name, parseInt(age), industry, experience);
    setProfiles([...profiles, newProfile]);
    setName("");
    setAge("");
    setIndustry("");
    setExperience("");
  };

  const findMatches = (user) => {
    // Placeholder matching logic: find same industry
    return profiles.filter(
      (profile) =>
        profile.industry.toLowerCase() === user.industry.toLowerCase() &&
        profile.name !== user.name
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🤝 Welcome to Handshake</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Industry"
        value={industry}
        onChangeText={setIndustry}
      />
      <TextInput
        style={styles.input}
        placeholder="Experience Level"
        value={experience}
        onChangeText={setExperience}
      />

      <Button title="Add Profile" onPress={addProfile} />

      <Text style={styles.subheader}>User Profiles</Text>
      <FlatList
        data={profiles}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const matches = findMatches(item);
          return (
            <View style={styles.profile}>
              <Text>{item.name} ({item.age})</Text>
              <Text>{item.industry} - {item.experienceLevel}</Text>
              {matches.length > 0 && (
                <Text>Matches: {matches.map((m) => m.name).join(", ")}</Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subheader: { fontSize: 18, marginTop: 15, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
  },
  profile: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
