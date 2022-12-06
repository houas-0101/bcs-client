import React,{useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Badge } from 'react-native-paper';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import NumericInput from 'react-native-numeric-input'
import { GestureHandlerRootView } from "react-native-gesture-handler";


const SCREEN_WIDTH = Dimensions.get('window').width;

const ItemBox = (props:any) => {
  const [nember, setNember] = useState();

  // la View quand on swipe a droite : voire le bouton de suppression 
  const leftSwipe = (progress:any, dragX:any) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity onPress={props.handleDelete} activeOpacity={0.6}>
        <View style={styles.deleteBox}>
          <Animated.Text style={{transform: [{scale: scale}],color:'white'}}>
            Delete
          </Animated.Text>
        </View>
      </TouchableOpacity>
    );
  };

  // pour la mise a jour de nombre de produit maniuelement dans le panier (on peut modifier uniquement le nombre de produit )
  const updateItems =  (item:any )=>{
    return (
      fetch(`http://10.192.1.138:8000/items/update/${item.id}`, {
         method: "PUT",
         headers: {
           'accept': 'application/json',
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           "name": "string",
           "price": 0,
           "nombreItems": (nember),
         }),
       })
       .catch((error) => {
         console.error(error);
         console.log('erreur dans updateItems');
     }));
   };

  
   // la View quand on swipe a guache : voire le numerique input qui permet de modifier le nombre de produit  
  const rightSwipe = (progress:any, dragX:any) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <View>
      <TouchableOpacity onPress={updateItems(props.data)} activeOpacity={0.6}>
        <View style={styles.updateBox}>
         {/* <NumericInput  onChange={value => {console.log(props.data.price*value)}} /> */}
          <NumericInput 
            onChange={value => {setNember(value)}} 
            totalWidth={120} 
            totalHeight={50} 
            iconSize={25}
            minValue={1}
            //initValue={props.data.nombreItems}
            step={1}
            valueType='real'
            textColor='#B0228C' 
            rightButtonBackgroundColor='#03ddff' 
            leftButtonBackgroundColor='#03e2ff'/>
        </View>
        
      </TouchableOpacity>

      </View>
    );
  };


  // la View de notre screen Cart qui affiche tous les produit du panier, la quantité de chaque produit ainsi que le prix de l'unité
  return (
    <View style={styles.rowFront}>
    <GestureHandlerRootView>
      <Swipeable  renderLeftActions={leftSwipe} renderRightActions={rightSwipe}>
        <View style={styles.rowFrontVisible}>
          <Badge style={styles.badge}> Quantity : {props.data.nombreItems} </Badge>
          <Text style={styles.name}>Product : {props.data.name}</Text>
          <Text style={styles.price}>price : {props.data.price} €/unité</Text>        
        </View>
      </Swipeable>
    </GestureHandlerRootView>
    </View>

  );
  
};


// le style des View
export default ItemBox;

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',

  },
  deleteBox: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 60,
  },
  updateBox:{
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 60,
  },
  rowFront: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 80,
    margin: 5,
    marginBottom: 15,
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginTop:20,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#666',
  },
  badge:{
    fontSize: 10,
    fontWeight: 'bold',
    margintop: 0,
    color: 'white',
    backgroundColor:'#04aac4',

  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#16AD23',
    alignItems: 'center',
    textAlign:'right',
  },
  rowFrontVisible: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    padding: 10,
    marginBottom: 15,
  },
});