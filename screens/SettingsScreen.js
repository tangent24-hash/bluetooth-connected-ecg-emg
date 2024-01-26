// SettingsScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, SIZES, SHADOWS, FONTS } from "../constants/theme";

const SettingsScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [savedMethod, setSavedMethod] = useState("");

  useEffect(() => {
    // Load the saved method and phone number from AsyncStorage when the component mounts
    loadSavedSettings();
  }, []);

  const loadSavedSettings = async () => {
    try {
      const savedMethod = await AsyncStorage.getItem("selectedMethod");
      const savedPhoneNumber = await AsyncStorage.getItem("phoneNumber");

      if (savedMethod) {
        setSavedMethod(savedMethod);
        setSelectedMethod(savedMethod);
      }

      if (savedPhoneNumber) {
        setPhoneNumber(savedPhoneNumber);
      }
    } catch (error) {
      console.error("Error loading saved settings:", error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem("selectedMethod", selectedMethod);

      // Save the phone number only if the method is 'textMessage' or 'phoneCall'
      if (selectedMethod === "textMessage" || selectedMethod === "phoneCall") {
        await AsyncStorage.setItem("phoneNumber", phoneNumber);
      }

      setSavedMethod(selectedMethod);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: SIZES.font,
        marginBottom: SIZES.extraLarge,
        margin: SIZES.base,
        ...SHADOWS.dark,
        height: 400,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={styles.heading}>Notification Method</Text>

      <Picker
        selectedValue={selectedMethod}
        onValueChange={(itemValue) => setSelectedMethod(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Method" value="" />
        <Picker.Item label="Text Message" value="textMessage" />
        <Picker.Item label="Phone Call" value="phoneCall" />
        <Picker.Item label="Alarm Ring" value="alarmRing" />
      </Picker>

      {(selectedMethod === "textMessage" || selectedMethod === "phoneCall") && (
        <View style={styles.inputContainer}>
          <Text>Enter Phone Number:</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
          />
        </View>
      )}

      <Button title="Save Settings" onPress={saveSettings} />

      {savedMethod ? (
        <Text style={styles.savedMethodText}>Saved Method: {savedMethod}</Text>
      ) : null}
      {phoneNumber ? (
        <Text style={styles.savedMethodText}>Phone Number: {phoneNumber}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 200,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  savedMethodText: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default SettingsScreen;
