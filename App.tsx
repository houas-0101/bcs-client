import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './components/MainTabNavigator';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <MainTabNavigator/>
  );
}

export default App;
