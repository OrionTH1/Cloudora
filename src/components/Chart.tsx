"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  calculateAngle,
  calculatePercentage,
  convertFileSize,
} from "@/lib/utils";

const chartConfig = {
  size: {
    label: "Size",
  },
  storageUsed: {
    label: "Used",
    color: "white",
  },
} satisfies ChartConfig;

function Chart({
  storageUsed,
  maxStorageSize,
}: {
  storageUsed: number;
  maxStorageSize: number;
}) {
  const chartData = [
    { storage: "storageUsed", 10: storageUsed, fill: "white" },
  ];

  return (
    <Card className="chart">
      <CardContent className="flex-1 p-0">
        <ChartContainer config={chartConfig} className="chart-container">
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={Number(calculateAngle(storageUsed, maxStorageSize)) + 90}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="polar-grid"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="storage" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="chart-total-percentage"
                        >
                          {storageUsed &&
                          calculatePercentage(storageUsed, maxStorageSize)
                            ? calculatePercentage(storageUsed, maxStorageSize)
                                .toString()
                                .replace(/^0+/, "")
                                .replace(".", "")
                            : "0"}
                          %
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="subtitle-2 fill-white"
                        >
                          Space Used
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardHeader className="chart-details">
        <CardTitle className="chart-title">Available Storage</CardTitle>
        <CardDescription className="chart-description">
          {storageUsed ? convertFileSize(storageUsed) : "0GB"} /{" "}
          {convertFileSize(maxStorageSize, 0)}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default Chart;
