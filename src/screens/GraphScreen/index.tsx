import React, { useEffect, useState } from "react";
import {View, Text,Dimensions} from 'react-native'
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
import { useWebSocket } from "../../hooks/WebSocketProvider";
import { SocketStock } from "../../model/SocketStock";

export const GraphScreen = () =>{

    const { ws, setWs, openConnection, restartConnection } = useWebSocket();
  const [stocks, setStocks] = useState<SocketStock[]>([]);

  useEffect(() => {
    const setSubscriptions = () => {
      if (ws) {
        ws.send(JSON.stringify({ type: "subscribe", symbol: "AAPL" }));
        ws.send(JSON.stringify({ type: "subscribe", symbol: "MSFT" }));
        ws.send(JSON.stringify({ type: "subscribe", symbol: "AMZN" }));
      } else {
        console.error("WebSocket connection is not open");
      }
    };

    setSubscriptions();
  }, [ws]);

  useEffect(() => {
    if (ws) {
      ws.onmessage = async (event: any) => {
        try {
          if (!event || !event.data) {
            console.error("Invalid WebSocket message:", event);
            return;
          }
  
          const eventData = JSON.parse(event.data);
  
          if (eventData && eventData.type === "trade" && eventData.data && Array.isArray(eventData.data)) {
            setStocks((prevStocks) => {
              const updatedStocks: SocketStock[] = [];
  
              for (const prevStock of prevStocks) {
                const newData = eventData.data.find((data) => data && data.s === prevStock.symbol);
  
                if (newData) {
                  updatedStocks.push({
                    ...prevStock,
                    price: newData.p || prevStock.price,
                    timestamp: newData.t || prevStock.timestamp,
                    volume: newData.v || prevStock.volume,
                    conditions: newData.c || prevStock.conditions,
                  });
                } else {
                  updatedStocks.push(prevStock);
                }
              }
  
              for (const newData of eventData.data) {
                if (newData && !prevStocks.some((prevStock) => prevStock.symbol === newData.s)) {
                  updatedStocks.push({
                    symbol: newData.s,
                    price: newData.p || 0,
                    timestamp: newData.t || 0,
                    volume: newData.v || 0,
                    conditions: newData.c || [],
                  });
                }
              }
  
              return updatedStocks;
            });
          }
        } catch (error) {
          console.error("Error processing trade event:", error);
        }
      };
    } else {
      console.error("WebSocket connection is null");
    }
  }, [ws]);
  
  
  

  

  
  const uniqueStocks = Array.from(new Set(stocks.map(stock => stock.symbol)))
    .map(symbol => stocks.find(stock => stock.symbol === symbol));

    const datasets = [
        {
          data: [uniqueStocks[0]?.price], 
          color: () => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
        },
        {
          data: [uniqueStocks[1]?.price], 
          color: () => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
        },
        {
          data: [uniqueStocks[2]?.price], 
          color: () => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
        },
      ];
      

    return(
        <View>
        <Text>graph </Text>
        <LineChart
          data={{
            labels: ["AAPL", "MSFT", "AMZN"],
             datasets: datasets,
          }}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          yAxisLabel="$"
          yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>
    )
}