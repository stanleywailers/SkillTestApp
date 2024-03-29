import {createStackNavigator} from '@react-navigation/stack';
import {AddAlertScreen} from '../screens/AddAlertScreen'
import {WatchListScreen} from '../screens/WatchListScreen'
import {GraphScreen} from '../screens/GraphScreen'


export type RootStackParams = {
    AddAlertScreen : undefined;
    WatchListScreen:undefined
    GraphScreen:undefined
   
  };


  const MainStack = createStackNavigator<RootStackParams>();

export const MainNavigation = () => {
    
    return(
      <MainStack.Navigator>
       <MainStack.Screen name='GraphScreen' component={GraphScreen} />
        <MainStack.Screen name='WatchListScreen' component={WatchListScreen} />
        <MainStack.Screen name='AddAlertScreen' component={AddAlertScreen} />
        
      </MainStack.Navigator>
    )
}