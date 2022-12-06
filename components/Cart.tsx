import React, {useState,useEffect} from 'react';
import {SafeAreaView, View, StyleSheet, FlatList,Alert,Button,Text} from 'react-native';
import ItemBox from './ItemBox';
import CheckoutScreen from './CheckoutScreen';
import { StripeProvider } from '@stripe/stripe-react-native';

const App = () =>{
  
  
  useEffect(() => {
    alert("Swiper a droite pour faire apparaître le bouton [suppression] et swiper a gauche pour faire apparaître le input de [quantité]");
  }, [])

  
  const [items, setItems] = useState([]);
  // permet de récuprer tous les produits du panier 
  const getItems  = async () =>{
    const response= await fetch("http://10.192.1.138:8000/items/", {
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
 
  // permet de supprimer un produit du panier et permet d'interagir avec 
  //l'utilisateur pour etre sur qu'il souhaite vraiment supprimer le produit 
  const deleteItem = async (id:any) => {
    console.log('index :'+id);
    Alert.alert(
        "Deletion",
        "remove ? ",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: async() => {
             fetch(`http://10.192.1.138:8000/items/?item_id=`+id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
          } }
        ]);
  };


    //calcule de la somme des produits dans le panier et récupere les identifiant de chaque produit 
    let amount=0;
    let tabid=[];
    {items.map((item:any)=>{
       amount= amount+(item.price*100*item.nombreItems);
       tabid.push(item.id);
    })}


    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={items}
          renderItem={({item, name}:any) => {
            return( items == null ? (<Text> Le panier est vide </Text> ):
                   // <ItemBox data={item} handleDelete={() => deleteItem(item.id)} handleUpdate={() => updateItem(item.id)} />
                   <ItemBox data={item} handleDelete={() => deleteItem(item.id)} />
             );
          }}
        />

        <View>
        {(amount <= 0 )? null:(
        <StripeProvider
          publishableKey="pk_test_51M52kDJoRZtwUgfeYA5dnEwrTFjFRbaoED9tgz8cbZRDIwuteXOFKxxHpIFXzOpZIQlgDNGLbvcZ9pBmijVKtaRc00Fs4DzxDV"
            merchantIdentifier="merchant.com.example"
           >
  
            <CheckoutScreen  timer data={amount} tab={tabid} /> 

        </StripeProvider >
        )}
        </View>
      </SafeAreaView>
    

);

  
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addItem: {
    alignItems:"center",
    textAlign:"center",
    marginHorizontal:150,
    marginVertical :10,
    backgroundColor: 'green',
    padding:10,
    width:100,
    color:"white",
    fontSize : 20
  }

});





