import React,{useState} from 'react';
import { StyleSheet, Button, TextInput, View, Text } from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';

export default function ReviewForm() {

  const navigation = useNavigation(); 

  //ajout de nouveau produit 
  const postItems = async (name:any , nember:any ) =>{
    if(name!="" && nember!=""){
        // on verifie si le produit existe déja dans le panier
        const response= await fetch("http://10.192.1.138:8000/items/name/"+name, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const items= await response.json();
        
        // si le produit n'est pas dans le panier alors on l'inisère 
        if(items==null){
            await fetch("http://10.192.1.138:8000/items/", {
            method: "POST",
            headers: {
              "accept": "application/json" ,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "name": name,
              "price": Math.floor(Math.random() * 1000) + 15,
              "nombreItems" : nember,

            }),
          })
          .then((response) => response.json())
          .then(()=>{alert("INSERÉ AVEC SUCCÈS ")})
          .catch((error) => {
              console.error(error);
              console.log('erreur dans postItems');
          });
        }
        // sinon si il existe alors on augment la quantité du produit dans
        else{
          alert(`Le produit déjà dans le panier \n(Quantité augmenté de 1)`);
          updateItems(items);
           
        }

    }else{
      alert('Le champ name ou nombre est vide')
    }
  };

  // permettra de modifer la quantité du produit en cas de nouvelle insertion 
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


 
 
  // la vue de notre formulaire d'insertion 
  return (
    
    <View style={styles.container}>
      <View>
      <Formik
        initialValues={{ name_item: '', nombre_item: '' }}
        onSubmit={(values) => {
          postItems(values.name_item,values.nombre_item);
        }}
      >
        {props => (

          <View>
            <Text style={styles.text}>INSÉRTION MANUELLE</Text>
            <TextInput
              style={styles.input}
              placeholder=' Product name'
              onChangeText={props.handleChange('name_item')}
              value={props.values.name_item}
            /> 
            <TextInput 
              style={styles.input}
              placeholder=' Product nombre'
              onChangeText={props.handleChange('nombre_item')}
              value={props.values.nombre_item}
              keyboardType='numeric'
            />

            <Button 
              style={styles.input}
              color='#0bbdb2'
              title="Submit" 
              onPress={props.handleSubmit}
               /> 

          </View>
        )
        }
      </Formik>
    </View>
    <View style={styles.Button}>
      <Button title={'Voir le panier'} onPress= { () => navigation.navigate('Cart')}/>
    </View>
    </View>
    
  );
}

// le sytle de notre formulaire 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    margin:40,
  },
 input:{
  margin:20,
  height:50,
  backgroundColor:"#b2fffe"
 },
  text: {
    margin:40, 
    textAlign: "center",
  },

  Button:{
    marginTop:50,
  },
});