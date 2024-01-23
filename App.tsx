/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { MainNavigation } from './src/navigator/MainNavigation';

const App = (): JSX.Element => {
 
  return(
   <NavigationContainer>
   <MainNavigation/>
   </NavigationContainer>
 )
}

export default App;
