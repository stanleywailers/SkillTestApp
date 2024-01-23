import React, {useEffect, useState} from 'react';
import {Text, View, TextInput} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { socket } from '../../../App';
import { CustomButton } from '../../components/CustomButton/index';
import { useWebSocket } from '../../hooks/WebSocketProvider';
import {Stock} from '../../model/stock';
import {readAllStocks} from '../../services/stock';
import {styles} from './styles';

export const AddAlertScreen = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [priceAlert, setPriceAlert] = useState('');
  const [stocks, setStocks] = useState<Stock[]>();
  const [text, onChangeText] = useState('');
  const { ws, setWs ,openConnection} = useWebSocket();
  

  
  const setSubscription = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'subscribe', symbol: 'AAPL' }));
      } else {
        console.error('WebSocket connection is not open');
      }
    }

    if (ws) {
        ws.onmessage = (event: any) => {
          console.log(event.data);
        };
      } else {
        console.error('WebSocket connection is null');
      }

  const onMessage = (event: any) => {
    console.log('Message from server ', event.data);
  };

  useEffect(() => {
    const getStocks = async () => {
      const response = await readAllStocks();
      if (response.ok) {
        setStocks(response.data);
      }
    };

    getStocks();
  }, []);

  useEffect(() => {
    openConnection
  }, [])
  

  return (
    <View>
      <RNPickerSelect
        placeholder={{label: 'Select a stock...', value: null}}
        onValueChange={value => setSelectedStock(value)}
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
        keyboardType="numeric"></TextInput>

        <CustomButton onPress={setSubscription}></CustomButton>
    </View>
  );
};
