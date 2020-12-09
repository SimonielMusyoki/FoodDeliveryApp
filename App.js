import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Tabs from './navigation/tabs';
import { 
  Home,
  OrderDelivery,
  Restaurants
} from './screens'

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
          initialRouteName='Home'
          screenOptions={{
            headerShown: false,
          }}>
        <Stack.Screen name='Home' component={Tabs} />
        <Stack.Screen name='OrderDelivery' component={OrderDelivery} />
        <Stack.Screen name='Restaurants' component={Restaurants} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;