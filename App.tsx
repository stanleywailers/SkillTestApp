/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { MainNavigation } from './src/navigator/MainNavigation';
import Resources from '../constanst/Resources';
import { WebSocketProvider } from './src/hooks/WebSocketProvider';

import { Notifications } from 'react-native-notifications';







const App = (): JSX.Element => {
  useEffect(() => {
    Notifications.registerRemoteNotifications(); // This is required for iOS

    // Handle the notification when the app is in the foreground
    Notifications.events().registerNotificationReceivedForeground(
      (notification, completion) => {
        console.log('Notification received while app is in the foreground:', notification);
        completion({ alert: true, sound: true, badge: true });
      }
    );

    // Handle the notification when the app is in the background or closed
    Notifications.events().registerNotificationOpened(
      (notification, completion) => {
        console.log('Notification opened:', notification);
        completion();
      }
    );

    return () => {
      // Cleanup or unsubscribe from events if needed
    };
  }, []);


 

  return(
   <NavigationContainer>
    <WebSocketProvider>
    <MainNavigation/>
    </WebSocketProvider>
  
   </NavigationContainer>
 )
}

export default App;
