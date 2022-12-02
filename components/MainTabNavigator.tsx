import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View,Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import History from './History';
import Cart from './Cart';
import Home from './Home';
import Scan from './scan';
import { Badge } from 'react-native-paper';


const Tab = createBottomTabNavigator()

export default function MainTabNavigator() {
    const [items, setItems] = useState([]);

  const getItems  = async () =>{
    const response=await fetch("http://10.192.1.138:8000/items/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.json())
    .then((json) => setItems(json))
    .catch((error) => {
        console.error(error);
    });
  };
  getItems();
  var itemCount = Object.keys(items).length;

    return (
        <NavigationContainer>
            <Tab.Navigator
           
            screenOptions={({ route }) => ({
                
                
                
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string = "";
                    
                    // Definit le type d icones selon la platforme
                    if (Platform.OS === "android") {
                        iconName += "md-";
                    } else if (Platform.OS === "ios") {
                        iconName += "ios-";
                    }
            
                    // assigne l icone
                    switch (route.name) {
                        case "Home": {
                            iconName += "home-sharp";
                            break;
                        }
                        case "Scanner": {
                            iconName += "qr-code-sharp";
                            break;
                        }
                        case "History": {
                            iconName += "book-sharp";
                            break;
                        }
                        case "Cart": {
                            iconName += "cart-sharp";
                            break;
                        }

                        default: {
                            break;
                        }
                    }
                    return (
                    <View>
                       {(route.name == 'Cart'&& itemCount !=0 )? <Badge style={{marginBottom:0}}>{itemCount}</Badge>: null }                            
                        <Ionicons name={iconName} size={size} color={color} />
                              
                    </View>
                    );
                }
            })
            }>
                <Tab.Screen
                    name='Home'
                    component={Home}
                />
                <Tab.Screen
                    name='History'
                    component={History}
                />
                <Tab.Screen
                    name='Scanner'
                    component={Scan}
                />
 
                <Tab.Screen
                    name='Cart'
                    
                    component={Cart}
                />

            </Tab.Navigator>
            
        </NavigationContainer>
    )
}
