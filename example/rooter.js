import React from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Index from './index'
import Mine from './mine'
const HomeStack  =  createStackNavigator()
function HomeStackScreen() {
    return (
      <HomeStack.Navigator 
     
      mode="card"  headerMode="none">
        <HomeStack.Screen name="Home" component={Index} />
        <HomeStack.Screen name="Details" component={Mine} />
      </HomeStack.Navigator>
    );
  }
  const MineStack  =  createStackNavigator()
function MineStackScreen() {
    return (
      <MineStack.Navigator  mode="card" headerMode="none">
        <MineStack.Screen name="Mine" component={Mine} />
        <MineStack.Screen name="Details2" component={Index} />
      </MineStack.Navigator>
    );
  }
  
  const Tab = createBottomTabNavigator();

export default class AppComp extends React.Component{
    state = {
        isLoading: true,
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <NavigationContainer>
            <Tab.Navigator>
              <Tab.Screen name="Home" component={HomeStackScreen} />
              <Tab.Screen name="Mine" component={MineStackScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        )
    }
}
