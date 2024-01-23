/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { MainNavigation } from './src/navigator/MainNavigation';
import Resources from '../constanst/Resources';
import { WebSocketProvider } from './src/hooks/WebSocketProvider';





const App = (): JSX.Element => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  return(
   <NavigationContainer>
    <WebSocketProvider>
    <MainNavigation/>
    </WebSocketProvider>
  
   </NavigationContainer>
 )
}

export default App;
