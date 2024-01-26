import React, { useState, useEffect } from "react";
import { View, Text, PermissionsAndroid } from "react-native";
import { BleManager } from "react-native-ble-plx";
import { LineChart } from "react-native-chart-kit";
import { COLORS, SIZES, SHADOWS, FONTS } from "./constants/theme";

const BluetoothConnection = ({ getECGData }) => {
  const [ecgData, setEcgData] = useState([]);
  const [device, setDevice] = useState(null);

  useEffect(() => {
    // Request Bluetooth permissions (Android)
    async function requestBluetoothPermissions() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
          {
            title: "Bluetooth Permission",
            message: "App needs Bluetooth permission",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Bluetooth permission granted");
        } else {
          console.log("Bluetooth permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }

    requestBluetoothPermissions();

    // Initialize BLE manager
    const manager = new BleManager();

    // Scan for devices
    const subscription = manager.onStateChange((state) => {
      if (state === "PoweredOn") {
        manager.startDeviceScan(null, null, (error, scannedDevice) => {
          if (scannedDevice) {
            // Filter devices based on your criteria (e.g., device name, UUID)
            if (scannedDevice.name === "YourDeviceName") {
              manager.stopDeviceScan();
              setDevice(scannedDevice);
            }
          }
        });
      }
    }, true);

    // Connect to the selected device
    if (device) {
      device
        .connect()
        .then((device) => {
          console.log("Connected to device:", device.id);
          // Subscribe to characteristics and receive data
          device.monitorCharacteristicForService(
            "ServiceUUID",
            "CharacteristicUUID",
            (error, characteristic) => {
              if (characteristic) {
                const value = characteristic.value; // Handle the received data
                // Update the ECG data
                setEcgData((prevData) => [...prevData, value]);
              }
            }
          );
        })
        .catch((error) => {
          console.error("Error connecting to device:", error);
        });
    }

    // Cleanup when the component is unmounted
    return () => {
      subscription.remove();
      if (device) {
        device.cancelConnection();
      }
      manager.destroy();
    };
  }, [device]);

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(127, 17, 224, ${opacity})`,
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
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontSize: SIZES.large,
            color: COLORS.primary,
            paddingBottom: 50,
          }}
        >
          Real-Time ECG Graph
        </Text>
        <LineChart
          data={{
            labels: [""],
            datasets: [
              {
                data: ecgData,
              },
            ],
          }}
          width={320}
          height={250}
          chartConfig={chartConfig}
          withShadow={false}
          withVerticalLines={true}
          withHorizontalLines={true}
          withInnerLines={false}
          bezier
        />
      </View>
    </View>
  );
};

export default BluetoothConnection;
