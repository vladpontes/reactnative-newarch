/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import BackgroundService from 'react-native-background-actions';
// import Geolocation from 'react-native-geolocation-service';
import Geolocation from '@react-native-community/geolocation'
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGeolocation, setAccessToken, setGeolocation, addGeolocation, getGeolocations } from './components/services/storage';
import { insertGeolocation } from './components/services/api';
import React, { useEffect, useState } from 'react';
// import { Linking } from 'react-native';
import { PermissionsAndroid } from 'react-native';

import { PropsWithChildren, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
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
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import GeolocationRequest from './components/templates/geolocationrequest';
import { ResponseApi } from './components/models';
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
//   skipPermissionRequests: true
// })

// Geolocation.setRNConfiguration({
//   skipPermissionRequests: false,
//   authorizationLevel: 'always',
//   locationProvider: 'auto'
// })

interface DisplayStatus {
  string?: string
  color: string
}

function Section({ children, title }: SectionProps): JSX.Element {

  const [stateGeolocation, setStateGeolocation] = useState<DisplayStatus>({ string: 'Iniciando rastreamento...', color: 'gray' })
  const [geoInfo, setGeoInfo] = useState<any>(null)
  const [isOnline, setIsOnline] = useState<any>(BackgroundService.isRunning())
  // const [requestInf, setRequestInfo] = useState('')
  // const [msg, setMsg] = useState('não tocou..')
  useCallback
  const questionLocation = async () => {
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    return granted
    // if (granted) {
    //   console.log( "You can use the ACCESS_FINE_LOCATION" )
    // } 
    // else {
    //   console.log( "ACCESS_FINE_LOCATION permission denied" )
    // }
  }
  const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), time * 1000));

  const StartTask = async () => {
    // await clearGeolocation()
    await sleep(10);
    setIsOnline(true)
    const veryIntensiveTask = async (taskDataArguments: any) => {
      const { delay } = taskDataArguments;
      await new Promise(async (resolve) => {

        for (let i = 0; BackgroundService.isRunning(); i++) {
          console.log(i);
          // console.log("BACKGROUND: ", BackgroundService.listeners.toString())
          // Geolocation.getCurrentPosition(async(info) => {console.log(info)}, (e)=>console.log("ERROR: ",e));
          // await Geolocation.getCurrentPosition(async(info) => {console.log(info); await saveDataGeoLoc(JSON.stringify(info))});
          // console.log("GET DATA -> ", await getDataGeoLoc())
          Geolocation.getCurrentPosition(async (info) => {
            // console.log(info)
            // insertGeoLoc(info, setRequestInfo)
            setGeoInfo({ ...info, acturenumber: i })
            await addGeolocation(info)

            // let geolocations = await getGeolocations()
            // send gelocations
            let statusRequest: ResponseApi = await insertGeolocation()
            // let statusRequest: ResponseApi = await insertGeolocation(geolocations)
            // let statusRequest = { status: true, message: "tudo ok" }

            if (!statusRequest.status) {
              await BackgroundService.updateNotification({ taskDesc: `Falha ao enviar dados!`, color: "red" }); // Only Android, iOS will ignore this call
              setStateGeolocation({ string: statusRequest.message, color: '#FE0000' })
              return
            } else {
              await BackgroundService.updateNotification({ taskDesc: `Monitoramento GPS ativado`, color: "green" }); // Only Android, iOS will ignore this call
              setStateGeolocation({ string: 'Monitoramento GPS ativado', color: 'green' })
            }


          }, async (e: any) => {
            if (e?.message) {
              console.log("OPEN QUESTION!")
              // await questionLocation()
              // await requestLocationPermission()
              let verify = await questionLocation()
              if (!verify) {
                setStateGeolocation({ string: `Falha ao capturar geolocalização\n${e.message}`, color: 'red' })
                await BackgroundService.updateNotification({ taskDesc: `Falha ao capturar geolocalização\n${e.message}`, color: "red" }); // Only Android, iOS will ignore this call
              } else {
                setStateGeolocation({ string: `${e.message}`, color: '#FE0000' })
                await BackgroundService.updateNotification({ taskDesc: `${e.message}`, color: "red" }); // Only Android, iOS will ignore this call

              }
              // Geolocation.requestAuthorization(async()=>{console.log("SUCCESS")}, async(e)=>console.log("ERRO: ", e))
              // Geolocation.requestAuthorization(async()=>{console.log("SUCCESS")}, async(e)=>console.log("ERRO: ", e))
              // getPermission()
            }
            console.log(e)
          }, { timeout: 10000, enableHighAccuracy: true });

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
        delay: 5,
      },
    };

    if (!BackgroundService.isRunning()) {
      await BackgroundService.start(veryIntensiveTask, options);
      await BackgroundService.updateNotification({ taskDesc: 'Inicializando monitoramento...', linkingURI: "" }); // Only Android, iOS will ignore this call
      console.log("NÃO ESTÁ RODANDO....")
    }
    // console.log(BackgroundService.)
    // iOS will also run everything here in the background until .stop() is called
    // await BackgroundService.stop();
  }

  // const preStartTask = async() => {
  //   let geolocation = await getGeolocation()
  //   let questionloc = await questionLocation()
  //   console.log("GEOLOCATION PERMITION STATUS SAVED: ", geolocation)
  //   console.log("GEOLOCATIONL PERMITION: ", questionloc)
  //   if(geolocation){
  //     StartTask()
  //   } else {
  //     setStateGeolocation({string:`Premissão para geolocalização não habilitado`, color:'red'})
  //     if (questionloc){
  //       setGeolocation("t")
  //       StartTask()
  //       // break
  //     }
  //     while(!questionloc){
  //       console.log("verificando....")
  //       questionloc = await questionLocation()
  //       if (questionloc){
  //         setGeolocation("t")
  //         StartTask()
  //         break
  //       }
  //       await sleep(3)
  //     }
  //   } 
  // }

  const preStartTask = useCallback(async () => {
    setStateGeolocation({ string: 'Iniciando rastreamento...', color: 'gray' })
    let geolocation = await getGeolocation()
      let questionloc = await questionLocation()
      console.log("GEOLOCATION PERMITION STATUS SAVED: ", geolocation)
      console.log("GEOLOCATIONL PERMITION: ", questionloc)
      if(geolocation){
        StartTask()
      } else {
        setStateGeolocation({string:`Premissão para geolocalização não habilitado`, color:'red'})
        if (questionloc){
          setGeolocation("t")
          StartTask()
          // break
        }
        while(!questionloc){
          console.log("verificando....")
          questionloc = await questionLocation()
          if (questionloc){
            setGeolocation("t")
            StartTask()
            break
          }
          await sleep(3)
        }
      } 
  }, [])

  useEffect(() => {
    if (BackgroundService.isRunning()) {
      BackgroundService.stop()
    }
  }, [])
  // AsyncStorage.clear()

  useEffect(() => {
    const activateGps = async () => {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then((data) => {
          // The user has accepted to enable the location services
          // data can be :
          //  - "already-enabled" if the location services has been already enabled
          //  - "enabled" if user has clicked on OK button in the popup
        })
        .catch((err) => {
          // The user has not accepted to enable the location services or something went wrong during the process
          // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
          // codes :
          //  - ERR00 : The user has clicked on Cancel button in the popup
          //  - ERR01 : If the Settings change are unavailable
          //  - ERR02 : If the popup has failed to open
          //  - ERR03 : Internal error
        });
    }
    activateGps()
    // Geolocation.requestAuthorization();

    // const questionLocation = async() => {
    //   const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
    //   return granted
    //   // if (granted) {
    //   //   console.log( "You can use the ACCESS_FINE_LOCATION" )
    //   // } 
    //   // else {
    //   //   console.log( "ACCESS_FINE_LOCATION permission denied" )
    //   // }
    // }

    // const getPermission = () => {
    //   Geolocation.requestAuthorization();
    // }

    // const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), time * 1000));

    // const StartTask = async () => {
    //   // await clearGeolocation()
    //   await sleep(10);
    //   const veryIntensiveTask = async (taskDataArguments: any) => {
    //       const { delay } = taskDataArguments;
    //       await new Promise( async (resolve) => {

    //           for (let i = 0; BackgroundService.isRunning(); i++) {
    //             // console.log(i);
    //             // console.log("BACKGROUND: ", BackgroundService.listeners.toString())
    //             // Geolocation.getCurrentPosition(async(info) => {console.log(info)}, (e)=>console.log("ERROR: ",e));
    //             // await Geolocation.getCurrentPosition(async(info) => {console.log(info); await saveDataGeoLoc(JSON.stringify(info))});
    //             // console.log("GET DATA -> ", await getDataGeoLoc())
    //             Geolocation.getCurrentPosition(async(info)=>{
    //               // console.log(info)
    //               // insertGeoLoc(info, setRequestInfo)
    //               setGeoInfo({...info, acturenumber: i})
    //               // await addGeolocation(info)

    //               // let geolocations = await getGeolocations()
    //               // send gelocations
    //               // let statusRequest: ResponseApi = await insertGeolocation()
    //               // let statusRequest: ResponseApi = await insertGeolocation(geolocations)
    //               let statusRequest = {status:true, message:"tudo ok"}

    //               if(!statusRequest.status){
    //                 await BackgroundService.updateNotification({taskDesc: `Falha ao enviar dados!`, color: "red"}); // Only Android, iOS will ignore this call
    //                 setStateGeolocation({string:statusRequest.message, color:'#FE0000'})
    //                 return
    //               }else {
    //                 await BackgroundService.updateNotification({taskDesc: `Monitoramento GPS ativado`, color: "green"}); // Only Android, iOS will ignore this call
    //                 setStateGeolocation({string:'Monitoramento GPS ativado', color:'green'})
    //               }


    //             }, async(e: any)=>{
    //               if(e?.message){
    //                 console.log("OPEN QUESTION!")
    //                 // await questionLocation()
    //                 // await requestLocationPermission()
    //                 let verify = await questionLocation()
    //                 if(!verify){
    //                   setStateGeolocation({string:`Falha ao capturar geolocalização\n${e.message}`, color:'red'})
    //                   await BackgroundService.updateNotification({taskDesc: `Falha ao capturar geolocalização\n${e.message}`, color: "red"}); // Only Android, iOS will ignore this call
    //                 } else {
    //                   setStateGeolocation({string:`${e.message}`, color:'#FE0000'})
    //                   await BackgroundService.updateNotification({taskDesc: `${e.message}`, color: "red"}); // Only Android, iOS will ignore this call

    //                 }
    //                 // Geolocation.requestAuthorization(async()=>{console.log("SUCCESS")}, async(e)=>console.log("ERRO: ", e))
    //                 // Geolocation.requestAuthorization(async()=>{console.log("SUCCESS")}, async(e)=>console.log("ERRO: ", e))
    //                 // getPermission()
    //               }
    //               console.log(e)
    //             }, {timeout: 10000,enableHighAccuracy:true});

    //             await sleep(delay);

    //           }
    //       });
    //     };

    //     const options = {
    //         taskName: 'MandaFrete',
    //         taskTitle: 'MandaFrete',
    //         taskDesc: 'GeoLocalization Listening...',
    //         taskIcon: {
    //             name: 'ic_launcher',
    //             type: 'mipmap',
    //         },
    //         color: '#ff00ff',
    //         linkingURI: 'geoLocTask://chat/jane', // See Deep Linking for more info
    //         parameters: {
    //             delay: 5,
    //         },
    //     };

    //     if(!BackgroundService.isRunning()){
    //       await BackgroundService.start(veryIntensiveTask, options);
    //       await BackgroundService.updateNotification({taskDesc: 'Inicializando monitoramento...', linkingURI:""}); // Only Android, iOS will ignore this call
    //       console.log("NÃO ESTÁ RODANDO....")
    //     } 
    //     // console.log(BackgroundService.)
    //     // iOS will also run everything here in the background until .stop() is called
    //     // await BackgroundService.stop();
    // }

    // const preStartTask = async() => {
    //   let geolocation = await getGeolocation()
    //   let questionloc = await questionLocation()
    //   console.log("GEOLOCATION PERMITION STATUS SAVED: ", geolocation)
    //   console.log("GEOLOCATIONL PERMITION: ", questionloc)
    //   if(geolocation){
    //     StartTask()
    //   } else {
    //     setStateGeolocation({string:`Premissão para geolocalização não habilitado`, color:'red'})
    //     if (questionloc){
    //       setGeolocation("t")
    //       StartTask()
    //       // break
    //     }
    //     while(!questionloc){
    //       console.log("verificando....")
    //       questionloc = await questionLocation()
    //       if (questionloc){
    //         setGeolocation("t")
    //         StartTask()
    //         break
    //       }
    //       await sleep(3)
    //     }
    //   }


    // }

    preStartTask()

  }, [setGeoInfo, preStartTask])

  const startStop = async() => {
    if(isOnline){
      setIsOnline(false)
      await BackgroundService.stop()
      return
    }
    setIsOnline(true)
    await preStartTask() 
  }

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
      <Text style={{ color: stateGeolocation.color, fontWeight: 'bold' }}>
        {stateGeolocation?.string && stateGeolocation?.string}
      </Text>
      {stateGeolocation.color == "red" && <GeolocationRequest />}
      <TouchableOpacity style={styles.button} onPress={() => Linking.openSettings()}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Configurações do app
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>startStop()} style={isOnline ? styles.buttonStop : styles.buttonStart}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {isOnline ? "Parar Monitoramento" : "Iniciar Monitoramento"}
        </Text>
      </TouchableOpacity>

      {/* <Button title="Clique aqui" onPress={()=>  Linking.openSettings()}/> */}
      {/* </Button> */}
      <Text>
        {geoInfo && `
          Altitude: ${geoInfo.coords.altitude}
          Longitude: ${geoInfo.coords.longitude}
          Latitude: ${geoInfo.coords.latitude}
          Speed: ${geoInfo.coords.speed}
          Accuracy: ${geoInfo.coords.accuracy}
          Captura n: ${geoInfo.acturenumber}
        `}
      </Text>
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
  button: {
    backgroundColor: "gray",
    marginTop: 15,
    padding: 10,
    borderRadius: 16,
    fontSize: 50,
    textAlign: 'center',
    alignItems: 'center'
  },
  buttonStart: {
    backgroundColor: "green",
    marginTop: 15,
    padding: 10,
    borderRadius: 16,
    fontSize: 50,
    textAlign: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  buttonStop: {
    backgroundColor: "red",
    marginTop: 15,
    padding: 10,
    borderRadius: 16,
    fontSize: 50,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    fontWeight: 'bold'
  }
});

export default App;
