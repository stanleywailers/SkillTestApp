import React, {useEffect, useState} from 'react';
import {Text, View, TextInput,AsyncStorage} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {socket} from '../../../App';
import {CustomButton} from '../../components/CustomButton/index';
import {useWebSocket} from '../../hooks/WebSocketProvider';
import {Stock} from '../../model/stock';
import {readAllStocks} from '../../services/stock';
import {styles} from './styles';
import {Notifications} from 'react-native-notifications';
import {TradeResponse} from '../../model/TradeResponse';

export const AddAlertScreen = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [priceAlert, setPriceAlert] = useState('');
  const [stocks, setStocks] = useState<Stock[]>();
  const [text, onChangeText] = useState('');
  const {ws, setWs, openConnection} = useWebSocket();

  const setSubscription = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        console.log(selectedStock)
      ws.send(JSON.stringify({type: 'subscribe', symbol: 'BINANCE:BTCUSDT'}));
    } else {
      console.error('WebSocket connection is not open');
    }
  };

  if (ws) {
    ws.onmessage = (event: any) => {
     const eventData: TradeResponse = JSON.parse(event.data);
      console.log(event)
     console.log(eventData)
      if (
        eventData &&
        eventData.type === 'trade' &&
        eventData.data &&
        eventData.data.length > 0
      ) {
        const tradeData = eventData.data[0];
        Notifications.postLocalNotification({
          title: tradeData.s,
          body: `This is the last price ${tradeData.p}`,
          extra: 'data',
        });
        ws.send(JSON.stringify({type:'unsubscribe','symbol': 'BINANCE:BTCUSDT'}))
      }
    };
  } else {
    console.error('WebSocket connection is null');
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
        placeholder='Price Alert'
        keyboardType="numeric"></TextInput>

      <CustomButton onPress={() => {
        console.log(text)
        AsyncStorage.setItem('keyalertPrice', text);
        setSubscription}}></CustomButton>
    </View>
  );
};
