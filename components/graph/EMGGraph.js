// ECGGraph.js
import React from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { COLORS, SIZES, SHADOWS, FONTS } from "../../constants/theme";

const EMGGraph = ({ emgData, setEmgData }) => {
  // Limit the data points to keep the graph readable
  if (emgData.length > 35) {
    setEmgData((prevData) => prevData.slice(1));
  }
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
          Real-Time EMG Graph
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
      </View>
    </View>
  );
};

export default EMGGraph;
