// BleContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { PermissionsAndroid } from "react-native";
import { BleManager, State } from "react-native-ble-plx";

const BleContext = createContext();

export const BleProvider = ({ children }) => {
  const [manager, setManager] = useState(null);
  const [device, setDevice] = useState(null);

  useEffect(() => {
    async function initializeBluetooth() {
      try {
        // Request Bluetooth permissions (Android)
        const granted1 = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          {
            title: "Bluetooth Permission",
            message: "App needs Bluetooth permission",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        const granted2 = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.SEND_SMS,
          {
            title: "SMS Permission",
            message: "App needs Sending SMS permission",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        const granted3 = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          {
            title: "Calling Permission",
            message: "App needs Calling permission",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );

        const granted4 = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "App requires Location",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (
          granted1 === PermissionsAndroid.RESULTS.GRANTED &&
          granted2 === PermissionsAndroid.RESULTS.GRANTED &&
          granted3 === PermissionsAndroid.RESULTS.GRANTED &&
          granted4 === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log("Bluetooth permission granted");
          const bleManager = new BleManager();
          setManager(bleManager);
        } else {
          console.log("Bluetooth permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }

    initializeBluetooth();

    // Cleanup when the component is unmounted
    return () => {
      if (manager) {
        manager.destroy();
      }
    };
  }, []);

  // const requestAndroid31Permissions = async () => {
  //   const bluetoothScanPermission = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
  //     {
  //       title: "Bluetooth Permission",
  //       message: "App needs Bluetooth permission",
  //       buttonNeutral: "Ask Me Later",
  //       buttonNegative: "Cancel",
  //       buttonPositive: "OK",
  //     }
  //   );
  //   const bluetoothConnectPermission = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  //     {
  //       title: "Bluetooth Permission",
  //       message: "App needs Bluetooth permission",
  //       buttonNeutral: "Ask Me Later",
  //       buttonNegative: "Cancel",
  //       buttonPositive: "OK",
  //     }
  //   );
  //   const fineLocationPermission = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //     {
  //       title: "location Permission",
  //       message: "App needs Location permission",
  //       buttonNeutral: "Ask Me Later",
  //       buttonNegative: "Cancel",
  //       buttonPositive: "OK",
  //     }
  //   );

  //   return (
  //     bluetoothScanPermission === "granted" &&
  //     bluetoothConnectPermission === "granted" &&
  //     fineLocationPermission === "granted"
  //   );
  // };

  // const requestPermissions = async () => {
  //   if (Platform.OS === "android") {
  //     if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         {
  //           title: "Location Permission",
  //           message: "App needs Location permission",
  //           buttonNeutral: "Ask Me Later",
  //           buttonNegative: "Cancel",
  //           buttonPositive: "OK",
  //         }
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         const bleManager = new BleManager();
  //         setManager(bleManager);
  //       }
  //     } else {
  //       const isAndroid31PermissionsGranted =
  //         await requestAndroid31Permissions();

  //       if (isAndroid31PermissionsGranted) {
  //         const bleManager = new BleManager();
  //         setManager(bleManager);
  //       }
  //     }
  //   } else {
  //     return true;
  //   }
  // };

  const startScanningForDevice = (targetDeviceName, onDataReceived) => {
    if (manager) {
      // Ensure Bluetooth is on before scanning
      manager.onStateChange((state) => {
        if (state === State.PoweredOn) {
          onDataReceived("text");
          // manager.startDeviceScan(
          //   null, // Scan for all devices
          //   null, // No specific UUIDs to filter
          //   (error, scannedDevice) => {
          //     if (error) {
          //       console.error("Error scanning for devices:", error);
          //       return;
          //     }
          //     else{
          //       onDataReceived(scannedDevice);
          //       manager.stopDeviceScan();
          //     }

          //     // if (scannedDevice.name === targetDeviceName) {
          //     //   onDataReceived(scannedDevice);
          //     //   manager.stopDeviceScan();
          //     // } else {
          //     //   console.log("no device found");
          //     // }
          //   }
          // );
        } else if (state === State.PoweredOff) {
          console.warn("Bluetooth is powered off. Please turn it on.");
          manager.stopDeviceScan();
        }
      }, true);
    }
  };

  const stopScanning = () => {
    if (manager) {
      manager.stopDeviceScan();
    }
  };

  return (
    <BleContext.Provider
      value={{
        manager,
        device,
        startScanningForDevice,
        stopScanning,
      }}
    >
      {children}
    </BleContext.Provider>
  );
};

export const useBle = () => {
  return useContext(BleContext);
};
