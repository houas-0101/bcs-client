import React,{useState} from 'react';
 import { createNativeStackNavigator } from '@react-navigation/native-stack';
 import {SafeAreaView, View, StyleSheet, FlatList,Alert, Text,ScrollView} from 'react-native';
 const Stack = createNativeStackNavigator();

 const History=() =>{
   const [Payments, setPayments] = useState([]);

   const getPayements  = async () =>{
     const response=await fetch("http:10.192.1.138:8000/payments/", {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
         "accept": "application/json",
       },
     })
     .then((response) => response.json())
     .then((json) => setPayments(json))
     .catch((error) => {
         console.error(error);
     });
   };
   getPayements();
     return (
       <SafeAreaView style={styles.container}>
         <FlatList
           data={Payments}
           renderItem={({item, name}:any) => {
             return( 
               <View  style={styles.item}>
                 <Text style={styles.text}>N°: {item.id}</Text>
                 <Text style={styles.text}> Customer : {item.customer.id}</Text> 
               </View>
             );
           }}
         />
         </SafeAreaView>
       );
   }
  
  // styles to see the data more clearly
  
   const styles = StyleSheet.create({
     container: {
       flex: 1,
       padding: 20,
     },
     item: {
       padding: 10,
       fontSize: 15,
       marginTop: 5,     
       backgroundColor:"#08988f",
     },
     text:{
       color:"white",
     }
   });
 

export default History;
