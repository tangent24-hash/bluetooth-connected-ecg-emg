// EMGScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { useBle } from "../contexts/BleContext";
import EMGGraph from "../components/graph/EMGGraph";

const EMGScreen = () => {
  const { startScanningForDevice, stopScanning, manager } = useBle();
  const [emgData, setEmgData] = useState([]);

  useEffect(() => {
    startScanningForDevice("YourDeviceName", (scannedDevice) => {
      // Handle connecting to the specific device
      connectToDevice(scannedDevice);
    });

    // Cleanup when the component is unmounted
    return () => {
      stopScanning();
    };
  }, [startScanningForDevice, stopScanning]);

  const connectToDevice = async (device) => {
    try {
      await device.connect();
      const services = await device.discoverAllServicesAndCharacteristics();
      // Assuming your EMG data is sent through a specific characteristic
      const emgCharacteristic = services
        .find((service) =>
          service.uuid.toLowerCase().includes("your_emg_service_uuid")
        )
        ?.characteristics.find((characteristic) =>
          characteristic.uuid
            .toLowerCase()
            .includes("your_emg_characteristic_uuid")
        );

      if (emgCharacteristic) {
        // Subscribe to notifications to receive real-time data
        await emgCharacteristic.monitor((error, characteristic) => {
          if (error) {
            console.error("Error monitoring EMG characteristic:", error);
          } else {
            // Handle received EMG data
            const newDataPoint = parseReceivedData(characteristic.value);
            /* Parse and process the received data */
            setEmgData((prevData) => [...prevData, newDataPoint]);
          }
        });
      } else {
        console.warn("EMG characteristic not found. Using sample data.");

        setEmgData([]); // Clear previous data
        // Use a function to generate sample data
        generateSampleData();
      }
    } catch (error) {
      console.error("Error connecting to EMG device:", error);
    }
  };

  const generateSampleData = () => {
    // Generate sample EMG data (replace with your logic)
    const sampleData = Array.from({ length: 100 }, (_, i) => Math.sin(i / 10));
    setEmgData(sampleData);
  };

  const parseReceivedData = (rawData) => {
    // Placeholder example: Assume rawData is an array of numbers
    // Replace this logic with the actual parsing based on your device's data format
    return rawData.map((byte) => byte / 255); // Normalize values to a range of [0, 1]
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>EMG Screen</Text>

      <EMGGraph emgData={emgData} />
    </View>
  );
};

export default EMGScreen;
