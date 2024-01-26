import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { COLORS, SIZES, SHADOWS, FONTS } from "../../constants/theme";

const RealTimeECGGraph = () => {
  const [ecgData, setEcgData] = useState([]);

  // Simulated real-time data source
  useEffect(() => {
    const intervalId = setInterval(() => {
      
      // Generate random ECG data point
      const newPoint = Math.random() * 10 + 70; // Replace with your real-time data source logic

      // Update the ECG data
      setEcgData((prevData) => [...prevData, newPoint]);

      // Limit the data points to keep the graph readable
      if (ecgData.length > 35) {
        setEcgData((prevData) => prevData.slice(1));
      }
    }, 30); // Simulate a new data point every second

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [ecgData]);

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

export default RealTimeECGGraph;
