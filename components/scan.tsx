import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button,ScrollView} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AjoutManuel from './AjoutManuel';


const Tab = createBottomTabNavigator()

export default function  Scan ({navigation}: any) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned')


  const askForCameraPermission = () => {
    (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    })()
  }

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
    }, []);


  //ajout de nouveau produit 
  const postItems = (data:any )=>{
     fetch("http://10.192.1.138:8000/items/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "name": data,
        "price":  Math.floor(Math.random() * 1000) + 15 ,
        "nombreItems" : 1,

      }),
    })
    .then((response) => response.json())
    .catch((error) => {
        console.error(error);
        console.log('erreur dans postItems');
    });
  };


  // modification de la quantité du produit dans le panier 
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
          nombreItems: (item.nombreItems + 1),
        }),
      })
      .catch((error) => {
        console.error(error);
        console.log('erreur dans updateItems');
    }));
  };

  // What happens when we scan the bar code
  const handleBarCodeScanned = async({data}:any ) => {
    setScanned(true);
    setText('scaned');
    //on récupère les produits du panier pour comparer avec els nouveaux a ajouter 
    const response= await fetch("http://10.192.1.138:8000/items/name/"+data, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const items= await response.json();

    //si le produit n'a pas été scanné alorson l'ajout au panier 
    if(items==null){
      postItems(data);
      alert("Article ajouter au panier");
      setScanned(false);
    }
    // sinon on augmente la quantité du produit déjà existante
    else{
      alert(`Le produit déjà dans le panier \n(Quantité augmenté : ${items.nombreItems+1} )`);
      updateItems(items);
      setScanned(false);
     
    }
    setScanned(true); 
    setText('Not yet scanned');  
  };

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <Text style={{ marginTop:100,marginLeft: 60, marginBottom:10 }}>No access to camera</Text>
          </View>
          <View>         
            <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
          </View>
            <AjoutManuel/>  
        </ScrollView>
      </View>
     );
  }


  // Return the View
  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 500, width: 400 }} />
      </View>
      <Text style={styles.maintext}>{text}</Text>
      {scanned && <Button title={'Scanner ?'} onPress= { () => setScanned(false)} color='blue' />}
      <View style={styles.Button}>
        <Button title={'terminer et voir le panier'} onPress= { () =>       navigation.navigate('Cart')} color='blue'/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 12,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 400,
    width: 300,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: '#08988f'
  },
  Button:{
    margin:10,
  },
 
});