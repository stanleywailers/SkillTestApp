import React, {useEffect, useState} from 'react';
import {Text, View, TextInput} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {socket} from '../../../App';
import {CustomButton} from '../../components/CustomButton/index';
import {useWebSocket} from '../../hooks/WebSocketProvider';
import {Stock} from '../../model/stock';
import {readAllStocks} from '../../services/stock';
import {styles} from './styles';
import {Notifications} from 'react-native-notifications';
import {TradeResponse} from '../../model/TradeResponse';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AddAlertScreen = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [priceAlert, setPriceAlert] = useState('');
  const [stocks, setStocks] = useState<Stock[]>();
  const [text, onChangeText] = useState('');
  const {ws, setWs, openConnection,restartConnection} = useWebSocket();

  const setSubscription = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        console.log(selectedSymbol)
      ws.send(JSON.stringify({type: 'subscribe', symbol: selectedSymbol}));
    } else {
      console.error('WebSocket connection is not open');
    }
  };

  if (ws) {
    ws.onmessage = async (event: any) => {
      try {
        const eventData: TradeResponse = JSON.parse(event.data);
        console.log('WebSocket message:', event, eventData);
  
        const lastPriceSaved = await AsyncStorage.getItem('alertPrice');
        console.log('Last price from storage:', lastPriceSaved);
  
        handleTradeEvent(eventData, lastPriceSaved);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  } else {
    console.error('WebSocket connection is null');
  }

  const handleTradeEvent = (eventData: TradeResponse, lastPriceSaved: string | null) => {
    try {
      if (
        eventData &&
        eventData.type === 'trade' &&
        eventData.data &&
        eventData.data.length > 0 &&
        eventData.data[0].p > parseFloat(lastPriceSaved ?? '0')
      ) {
        const tradeData = eventData.data[0];
        Notifications.postLocalNotification({
          title: tradeData.s,
          body: `This is the last price ${tradeData.p}`,
          extra: 'data',
        });
        unsubscribe();
      } else {
        unsubscribe();
        console.log('El tipo no coincide or invalid data');
      }
    } catch (error) {
      console.error('Error processing trade event:', error);
    }
  };
  


  const unsubscribe = () =>{
    if(ws){
        ws.send(JSON.stringify({ type: 'unsubscribe', symbol: selectedSymbol }));
    }
    
  }
  

  useEffect(() => {
    const getStocks = async () => {
      const response = await readAllStocks();
      if (response.ok) {
        console.log(response.data);
        setStocks(response.data);
      }
    };

    getStocks();
  }, []);

  useEffect(() => {
    openConnection;
  }, []);

  return (
    <View>
      <RNPickerSelect
        placeholder={{label: 'Select a stock...', value: null}}
        onValueChange={value => setSelectedSymbol(value)}
        items={
          stocks
            ? stocks.map(stock => ({
                label: stock.displaySymbol,
                value: stock.symbol,
              }))
            : []
        }
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder='Price Alert'
        keyboardType="numeric"></TextInput>

      <CustomButton onPress={() => {
       
        AsyncStorage.setItem('alertPrice', text);
        setSubscription
        }}></CustomButton>
    </View>
  );
};
