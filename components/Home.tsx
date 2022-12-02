import * as React from 'react';
import { Button, View, SafeAreaView, Text, Alert } from 'react-native';
import { Dimensions } from 'react-native';

export default function Home({navigation}: any) {
    return (
      <SafeAreaView>
          <View style={{marginTop: 200, marginLeft:100, width:Dimensions.get("window").width * 0.5,}}>
                <Button title={'Ajouter un article'} onPress= { () => navigation.navigate('Scanner')}/>
          </View>
          <View style={{marginVertical: 10, marginLeft:100, width:Dimensions.get("window").width * 0.5,}}>
                <Button title={'Voir le panier'} onPress= { () => navigation.navigate('Cart')}/>
          </View>
          <View style={{marginVertical: 10, marginLeft:100, width:Dimensions.get("window").width * 0.5,}}>
                <Button title={'Ajout manuel'} onPress= { () => navigation.navigate('Products')}/>
          </View>
          <View style={{marginVertical: 10, marginLeft:100, width:Dimensions.get("window").width * 0.5,}}>
                <Button title={'Historique des paiements'} onPress= { () => navigation.navigate('History')}/>
          </View>
          <Text style={{margin:40, backgroundColor:"#fff", textAlign:'center'}}>Dans le screen Cart pour supprimer un produit ou modifier la quantité il faudra swiper a droite ou a gauche pour faire apparaitre les options !!</Text>

      </SafeAreaView>
    );
  }
