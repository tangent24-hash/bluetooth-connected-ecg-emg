import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { COLORS, SIZES, SHADOWS, FONTS } from "../../constants/theme";

const RealTimeEMGGraph = () => {
  const [emgData, setEmgData] = useState([]);
  const [muscleState, setMuscleState] = useState("");

  useEffect(() => {
    // Simulate receiving EMG data
    const intervalId = setInterval(() => {
      const newPoint = Math.random() * 10; // Replace with your real-time data source logic

      if (newPoint < 0.5) {
        setMuscleState("Muscle at rest!");
      } else {
        setMuscleState("Not at rest!");
      }
      setEmgData((prevData) => [...prevData, newPoint]);

      // Limit the data points to keep the graph readable
      if (emgData.length > 35) {
        setEmgData((prevData) => prevData.slice(1));
      }
    }, 100); // Simulate a new data point every second

    // Cleanup when the component is unmounted
    return () => clearInterval(intervalId);
  }, [emgData]);

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
          EMG Graph
        </Text>
        <LineChart
          data={{
            labels: [""],
            datasets: [
              {
                data: emgData,
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
        <Text
          style={{
            fontSize: SIZES.large,
            color: COLORS.primary,
            paddingBottom: 50,
          }}
        >
          {muscleState}
        </Text>
      </View>
    </View>
  );
};

export default RealTimeEMGGraph;
