// ECGScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, Modal, TouchableOpacity } from "react-native";
import { useBle } from "../contexts/BleContext";
import ECGGraph from "../components/graph/ECGGraph";
import AutomaticNotification from "../functions/AutomaticNotification";

import AsyncStorage from "@react-native-async-storage/async-storage";

const ECGScreen = () => {
  const { makePhoneCall, sendSMS, closeModal, isModalVisible } =
    AutomaticNotification();

  const { startScanningForDevice, manager, stopScanning } = useBle();
  const [ecgData, setEcgData] = useState([]);
  const savedPhoneNumber = AsyncStorage.getItem("phoneNumber");
  let callCheck = false;
  let sampleECG = false;

  useEffect(() => {
    console.log("entering scanning");
    startScanningForDevice("YourDeviceName", (scannedDevice) => {
      connectToDevice(scannedDevice);
    });

    // Cleanup when the component is unmounted
    return () => {
      stopScanning();
    };
  }, []);

  const connectToDevice = async (device) => {
    try {
      await device.connect();
      const services = await device.discoverAllServicesAndCharacteristics();
      // Assuming your ECG data is sent through a specific characteristic
      const ecgCharacteristic = services
        .find((service) =>
          service.uuid.toLowerCase().includes("your_ecg_service_uuid")
        )
        ?.characteristics.find((characteristic) =>
          characteristic.uuid
            .toLowerCase()
            .includes("your_ecg_characteristic_uuid")
        );

      if (ecgCharacteristic) {
        // Subscribe to notifications to receive real-time data
        await ecgCharacteristic.monitor((error, characteristic) => {
          if (error) {
            console.error("Error monitoring ECG characteristic:", error);
          } else {
            // Handle received ECG data
            const newDataPoint = parseReceivedData(characteristic.value);
            /* Parse and process the received data */
            setEcgData((prevData) => [...prevData, newDataPoint]);
          }
        });
      } else {
        console.warn("ECG characteristic not found. Using sample data.");

        setEcgData([]); // Clear previous data
        // Use a function to generate sample data
        sampleECG = true;
      }
    } catch (error) {
      console.error("Error connecting to ECG device:", error);
      sampleECG = true;
    }
  };

  // const generateSampleData = () => {
  //   // Generate sample ECG data (replace with your logic)
  //   const intervalId = setInterval(() => {
  //     // Generate random ECG data point
  //     const newPoint = Math.random() * 10 + 70; // Replace with your real-time data source logic

  //     // Update the ECG data
  //     setEcgData((prevData) => [...prevData, newPoint]);

  //     if (callCheck === false) {
  //       if (newPoint >= 78) {
  //         makePhoneCall();
  //         callCheck = true;
  //       }
  //     }

  //   }, 100); // Simulate a new data point every second
  // };

  const parseReceivedData = (rawData) => {
    // Placeholder example: Assume rawData is an array of numbers
    // Replace this logic with the actual parsing based on your device's data format
    return rawData.map((byte) => byte / 255); // Normalize values to a range of [0, 1]
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>ECG Screen</Text>
      <ECGGraph />
    </View>
  );
};

export default ECGScreen;
