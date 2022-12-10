import { useStripe } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Text, Button, SafeAreaView, View } from "react-native";
import { useNavigation } from '@react-navigation/native';

export default function CheckoutScreen({data,tab}:any) {

    const navigation = useNavigation(); 
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [paymentIntentId, setPaymentIntentId] = useState<string>("");
    const userId = 1;
    let amount= {data};
    let tabID = {tab};
    const [total,setTotal]=useState(amount.data)
    const [itemsId,setItemsId]=useState(tabID.tab)

    const status=200


  

    
    const fetchPaymentSheetParams = async () => {
           
        const response = await fetch(`http://10.192.1.138:8000/payments/`, {
          method: "POST",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            
          },
          body: JSON.stringify({
            amount: total,
            customer_id: userId,
          }),
        }); 

        const { paymentIntent, ephemeralKey, customer,publishableKey} = await response.json();
    

        return {
            paymentIntent,
            ephemeralKey,
            customer,
            publishableKey,
        };
    };

    const initializePaymentSheet = async () => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
        } = await fetchPaymentSheetParams();
        const { error } = await initPaymentSheet({
            merchantDisplayName: "Example, Inc.",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            allowsDelayedPaymentMethods: false,
            
        }); 
        
        if (!error) {
            setPaymentIntentId(paymentIntent);
            setLoading(true);
        }
    };

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            const paymentIntent = `pi_${paymentIntentId.split("_")[1]}`;
            const response = await fetch(`http://10.192.1.138:8000/payments/check/${paymentIntent}`, {
                method: 'POST',
                headers: {
                    "accept": "application/json",
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "items_id": itemsId,
                    "customer_id": userId
                })
            })
            ;

            // if (response.status == 200) {
            if(status==200){
                Alert.alert('Success', 'Your order is confirmed!') ;
                
                // apres le succes de l'envoie on supprime tous les produits du panier et on rederige le client vers l'historique 
                // des piements
                await fetch('http://10.192.1.138:8000/items/deleteItems', {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "accept": "application/json",
                    },
                })
                .then(()=>{
                    navigation.navigate('History');     
                }).catch(error=>{
                    alert(error);
                });
                    ;
            }else{
                alert('Your order is not confirmed!') ;
            }
        }
    };

    // pour que le totoale et le tableau des id soit mis a jour a chaque fois que la data change 

    useEffect(() => {
        setTotal(amount.data);
        setItemsId(tabID.tab);
    }, [data]);
    // initialisation du peiement a chque fois que la somme totale du panier change , cela ma posé beaucoup de probleme a cause de la somme qui ne change pas 
    // meme si elle prend quand meme un peu de temps pour avoir un bon résultat
    useEffect(()=>{
        initializePaymentSheet();        

    },[total])

    return (
        <View>
            <Text style={{margin:5}}> Payment</Text>
            <Button
                disabled={!loading}
                title="Checkout"
                onPress={openPaymentSheet}
            />
        </View>
    );
    
}

