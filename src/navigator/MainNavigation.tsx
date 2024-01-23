import {createStackNavigator} from '@react-navigation/stack';
import {AddAlertScreen} from '../screens/AddAlertScreen'

export type RootStackParams = {
    AddAlertScreen : undefined;
   
  };


  const MainStack = createStackNavigator<RootStackParams>();

export const MainNavigation = () => {
    
    return(
      <MainStack.Navigator>
        <MainStack.Screen name='AddAlertScreen' component={AddAlertScreen} />
      </MainStack.Navigator>
    )
}