import * as React from 'react';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {
    Text,
    TextInput,
    Button,
    View,
    StyleSheet,
    Alert
} from 'react-native';
import { useState, useEffect } from 'react';

export default function AddNewsScreen () {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
      });

    useEffect(() => {
        // requestUserPermission();
        messaging().subscribeToTopic('weather')
        .then((respond) => console.log('Subscribed to topic!', respond));
       }, []);

    const [ titleNews, setTitle ] = useState('');
    const [ details, setDetails ] = useState('');
    const ref = firestore().collection('test');

    async function requestUserPermission ()  {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
        if (enabled) {
          getFcmToken()
          console.log('Authorization status:', authStatus);
        }
      }
    
      async function getFcmToken () {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
         console.log(fcmToken);
         console.log("Your Firebase Token is:", fcmToken);
        } else {
         console.log("Failed", "No token received");
        }
      }
  
    async function addNews() {
        if(titleNews.length == 0){
            window.alert('Please input a Titile or Detail of the News')
            return
        }
        await firestore().collection('test').add({
            title: titleNews,
            detail: details,
        });
        setTitle('');
    }

    return (
        <View>
            <Text>Title News</Text>
            <TextInput style={styles.input} label={'Title'} value={titleNews} onChangeText={setTitle} />
            <Text>Details</Text>
            <TextInput
                style={styles.inputs}
                multiline
                numberOfLines={10}
                onChangeText={setDetails}
                value={details}
                editable
                maxLength={200}
            />
            <Button title="Save" onPress={() => addNews()} />
        </View>

    )
};
const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
    },
    inputs: {
        margin: 12,
        borderWidth: 1,
      },
  });