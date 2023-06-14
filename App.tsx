/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import BackgroundService from 'react-native-background-actions';
// import Geolocation from 'react-native-geolocation-service';
import Geolocation from '@react-native-community/geolocation'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGeolocation, setAccessToken } from './components/services/storage';
import { insertGeoLoc } from './components/services/api';
import React, { useEffect, useState } from 'react';
// import { Linking } from 'react-native';
import { PermissionsAndroid } from 'react-native';

import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacityComponent,
  // Touchable,
  Button,
  Linking,
  Alert,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
// import BackgroundTask from './BackgroundTask';
// import { NativeModules } from 'react-native';
// import { BackHandler, DeviceEventEmitter } from 'react-native';
// import backgroundServer from 'react-native-background-actions';
import GeolocationRequest from './components/templates/geolocationrequest';
type SectionProps = PropsWithChildren<{
  title: string;
}>;



// BackHandler.addEventListener('hardwareBackPress', () => { //(optional) you can use it if you need it
//    //do not use this method if you are using navigation."preventBackClick: false" is already doing the same thing.
//    LocationServicesDialogBox.forceCloseDialog();
// });

// DeviceEventEmitter.addListener('locationProviderStatusChange', function(status) { // only trigger when "providerListener" is enabled
//     console.log(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
// });

// const { BackgroundTask } = NativeModules;






// Geolocation.setRNConfiguration({
//   skipPermissionRequests: false,
//   authorizationLevel: 'always',
//   locationProvider: 'auto'
// })

function Section({children, title}: SectionProps): JSX.Element {

  const [stateGeolocation, setStateGeolocation] = useState({string:'Iniciando rastreamento...',color: 'gray'})
  // const [msg, setMsg] = useState('não tocou..')

  useEffect(()=>{
    if(BackgroundService.isRunning()){
      BackgroundService.stop()
    }
  }, [])
  // AsyncStorage.clear()
  useEffect(()=>{
    Geolocation.requestAuthorization();

    const startThis = async() => {
      await setAccessToken()
    }
    // startThis()
    const getDataGeoLoc = async () => {
      try {
        const value = await AsyncStorage.getItem('@geoLoc')
        if(value !== null) {
          // value previously stored
          return JSON.parse(value)
        }
      } catch(e) {
        // error reading value
      }
    }

    // const requestLocationPermission = async () => {
    //   try {
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //       {
    //         title: 'Geolocation Permission',
    //         message: 'Can we access your location?',
    //         buttonNeutral: 'Ask Me Later',
    //         buttonNegative: 'Cancel',
    //         buttonPositive: 'OK',
    //       },
    //     );
    //     console.log('granted', granted);
    //     if (granted === 'granted') {
    //       console.log('You can use Geolocation');
    //       return true;
    //     } else {
    //       console.log('You cannot use Geolocation');
    //       return false;
    //     }
    //   } catch (err) {
    //     return false;
    //   }
    // };

    const questionLocation = async() => {
      const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
      return !granted
      // if (granted) {
      //   console.log( "You can use the ACCESS_FINE_LOCATION" )
      // } 
      // else {
      //   console.log( "ACCESS_FINE_LOCATION permission denied" )
      // }
    }
    

    const saveDataGeoLoc = async (value: any) => {
      console.log("RODANDO...")
      try {
        var oldValue: any = await AsyncStorage.getItem('@geoLoc')
        oldValue = JSON.parse(oldValue)
        console.log("LENGHT ", oldValue)
        if (oldValue.length > 10){
          await AsyncStorage.clear()
          return
        }
        await AsyncStorage.setItem('@geoLoc', JSON.stringify([...oldValue, value]))
      } catch (e) {
        // saving error
      }
    }

    const getPermission = () => {
      Geolocation.requestAuthorization();
    }
    
    const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), time * 1000));
    const StartTask = async () => {
    await sleep(10);
    const veryIntensiveTask = async (taskDataArguments: any) => {
        const { delay } = taskDataArguments;
        await new Promise( async (resolve) => {

            for (let i = 0; BackgroundService.isRunning(); i++) {
              console.log(i);
              // console.log("BACKGROUND: ", BackgroundService.listeners.toString())
              // Geolocation.getCurrentPosition(async(info) => {console.log(info)});
              // await Geolocation.getCurrentPosition(async(info) => {console.log(info); await saveDataGeoLoc(JSON.stringify(info))});
              // console.log("GET DATA -> ", await getDataGeoLoc())
              Geolocation.getCurrentPosition(async(info)=>{
                console.log(info)
                insertGeoLoc(info)
                setStateGeolocation({string:'Monitoramento GPS ativado', color:'green'})
                await BackgroundService.updateNotification({taskDesc: `Monitoramento GPS ativado`, color: "green"}); // Only Android, iOS will ignore this call

              }, async(e: any)=>{
                if(e?.message){
                  console.log("OPEN QUESTION!")
                  setStateGeolocation({string:`Falha ao capturar geolocalização\n${e.message}`, color:'red'})
                  // await questionLocation()
                  // await requestLocationPermission()
                  await BackgroundService.updateNotification({taskDesc: `Falha ao capturar geolocalização\n${e.message}`, color: "red"}); // Only Android, iOS will ignore this call

                  // Geolocation.requestAuthorization(async()=>{console.log("SUCCESS")}, async(e)=>console.log("ERRO: ", e))
                  // Geolocation.requestAuthorization(async()=>{console.log("SUCCESS")}, async(e)=>console.log("ERRO: ", e))
                  // getPermission()
                }
                console.log(e)
              }, {timeout: 5000});

              await sleep(delay);

            }
        });
      };
  
      const options = {
          taskName: 'MandaFrete',
          taskTitle: 'MandaFrete',
          taskDesc: 'GeoLocalization Listening...',
          taskIcon: {
              name: 'ic_launcher',
              type: 'mipmap',
          },
          color: '#ff00ff',
          linkingURI: 'geoLocTask://chat/jane', // See Deep Linking for more info
          parameters: {
              delay: 10,
          },
      };
      
      if(!BackgroundService.isRunning()){
        await BackgroundService.start(veryIntensiveTask, options);
        await BackgroundService.updateNotification({taskDesc: 'Inicializando monitoramento...', linkingURI:""}); // Only Android, iOS will ignore this call
        console.log("NÃO ESTÁ RODANDO....")
      } 
      // console.log(BackgroundService.)
      // iOS will also run everything here in the background until .stop() is called
      // await BackgroundService.stop();
    }
    
    const preStartTask = async() => {
      let geolocation = await getGeolocation()
      if(geolocation){
        StartTask()
      } else {
        setStateGeolocation({string:`Premissão para geolocalização não habilitado`, color:'red'})
      }

    preStartTask()
      
    }

  
  }, [])

  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text style={{color:stateGeolocation.color, fontWeight:'bold'}}>
        {stateGeolocation.string}
      </Text>
      {stateGeolocation.color == "red" && <GeolocationRequest/>}
      {/* <Button title="Clique aqui" onPress={()=>  Linking.openSettings()}/> */}
      {/* </Button> */}
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
 
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  return (
      <SafeAreaView style={backgroundStyle}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic">
          {/* <Header /> */}
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Section title="MandaFrete">
              App
            </Section>
           
          </View>
        </ScrollView>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
