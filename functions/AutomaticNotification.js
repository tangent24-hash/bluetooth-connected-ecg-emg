import { useState } from "react";
import SmsAndroid from "react-native-sms";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AutomaticNotification = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const makePhoneCall = async () => {
    try {
      // Replace 'phoneNumberKey' with the actual key you are using to store the phone number in AsyncStorage
      const savedPhoneNumber = await AsyncStorage.getItem("phoneNumber");

      if (savedPhoneNumber) {
        // Communications.phonecall(savedPhoneNumber, true);
        RNImmediatePhoneCall.immediatePhoneCall(savedPhoneNumber);
      } else {
        console.warn("No phone number saved. Unable to make a phone call.");
      }
    } catch (error) {
      console.error("Error retrieving phone number:", error);
    }
  };

  const sendSMS = async () => {
    try {
      getLocation();
      // Replace 'phoneNumberKey' with the actual key you are using to store the phone number in AsyncStorage
      const savedPhoneNumber = await AsyncStorage.getItem("phoneNumber");

      if (savedPhoneNumber) {
        const message = `Hello! You just got heart attack!!!! Latitude:${location.latitude} and LONGITUDE: ${location.longitude}`;
        const recipients = [savedPhoneNumber];
        SmsAndroid.autoSend(
          savedPhoneNumber,
          message,
          (fail) => {
            console.log("Failed to send SMS:", fail);
            Alert.alert("Error", "Failed to send SMS");
          },
          (success) => {
            console.log("SMS sent successfully:", success);
            Alert.alert("Success", "SMS sent successfully");
          }
        );

        //Communications.text(savedPhoneNumber, message);
      } else {
        console.warn("No phone number saved. Unable to send SMS.");
      }
    } catch (error) {
      console.error("Error retrieving phone number:", error);
    }
  };

  // const checkConditionAndTriggerAlarm = () => {
  //   // Replace the following condition with your specific condition
  //   const shouldTriggerAlarm = true;

  //   if (shouldTriggerAlarm) {
  //     scheduleAlarm();
  //   }
  // };

  // const scheduleAlarm = () => {
  //   const alarmNotifData = {
  //     id: "12345", // Unique ID for the alarm
  //     title: "Alarm Title",
  //     message: "Alarm Message",
  //     channel: "my_channel_id", // Channel ID for Android (optional)
  //     vibrate: true, // Vibration (optional)
  //     play_sound: true, // Play sound (optional)
  //     schedule_type: "once", // Schedule type (once, daily, weekly, etc.)
  //     repeat_interval: 1, // Repeat interval for daily/weekly alarms (optional)
  //     sound_name: null, // Custom sound name (optional, put in the 'sounds' folder)
  //   };

  //   AlarmNotification.scheduleAlarm(alarmNotifData);
  // };

  const closeModal = () => {
    setModalVisible(false);
  };

  return {
    makePhoneCall,
    sendSMS,
    closeModal,
    isModalVisible,
  };
};

export default AutomaticNotification;
