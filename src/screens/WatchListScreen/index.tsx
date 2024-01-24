import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { TradItem } from "../../components/TradeItem/index";
import { useWebSocket } from "../../hooks/WebSocketProvider";
import { SocketStock } from "../../model/SocketStock";



export const WatchListScreen = () => {
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
          const eventData = JSON.parse(event.data);
  
          if (eventData && eventData.type === "trade" && Array.isArray(eventData.data)) {
            setStocks((prevStocks) => {
              const updatedStocks: SocketStock[] = [];
  
             
              for (const prevStock of prevStocks) {
                const newData = eventData.data.find((data) => data.s === prevStock.symbol);
  
                if (newData) {
                  
                  updatedStocks.push({
                    ...prevStock,
                    price: newData.p,
                    timestamp: newData.t,
                    volume: newData.v,
                    conditions: newData.c,
                  });
                } else {
                  updatedStocks.push(prevStock);
                }
              }
  
           
              for (const newData of eventData.data) {
                if (!prevStocks.some((prevStock) => prevStock.symbol === newData.s)) {
                  updatedStocks.push({
                    symbol: newData.s,
                    price: newData.p,
                    timestamp: newData.t,
                    volume: newData.v,
                    conditions: newData.c,
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

  return (
    <View>
      <Text>Watch List</Text>
      <FlatList
       ItemSeparatorComponent={() => {
        return (<View style={{height: 5, backgroundColor: 'gray'}} />);
      }}
        data={uniqueStocks}
        renderItem={({ item }) => <TradItem item={item} />}
        keyExtractor={(item:SocketStock) => `${item.symbol}-${item.timestamp}`}
        
      />
    </View>
  );
};
