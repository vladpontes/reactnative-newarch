/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import BackgroundService from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
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

// const { BackgroundTask } = NativeModules;

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  // AsyncStorage.clear()
  useEffect(()=>{
    // BackgroundTask()
    // console.log("STARTING.... ", BackgroundTask)
    // BackgroundTask.startBackgroundTask();
    // Geolocation.
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
    

    const storeDataGeoLoc = async (value: any) => {
      try {
        var oldValue: any = await AsyncStorage.getItem('@geoLoc')
        oldValue = JSON.parse(oldValue)
        console.log("OLD -> ", [...oldValue, value])
        await AsyncStorage.setItem('@geoLoc', JSON.stringify([...oldValue, value]))
      } catch (e) {
        // saving error
      }
    }
    
    const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), time * 1000));
    const StartTask = async () => {

  
    // You can do anything in your task such as network requests, timers and so on,
    // as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
    // React Native will go into "paused" mode (unless there are other tasks running,
    // or there is a foreground app).
    const veryIntensiveTask = async (taskDataArguments: any) => {
        // Example of an infinite loop task
        const { delay } = taskDataArguments;
        await new Promise( async (resolve) => {
            for (let i = 0; BackgroundService.isRunning(); i++) {
                console.log(i);
                await Geolocation.getCurrentPosition(async(info) => {console.log(info); await storeDataGeoLoc(JSON.stringify(info))});
                console.log("GET DATA -> ", await getDataGeoLoc())
                // Geolocation.
                // Geolocation.getCurrentPosition(
                //     (position) => {
                //       console.log(position);
                //     },
                //     (error) => {
                //       // See error code charts below.
                //       console.log(error.code, error.message);
                //     },
                //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                // );
                // Geolocation.watchPosition((e)=> {console.log(e)}, (e)=>{console.log("Error: ", e)}, {
                //   showsBackgroundLocationIndicator: true,
                //   showLocationDialog: true
                // })
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
  
  
      await BackgroundService.start(veryIntensiveTask, options);
      await BackgroundService.updateNotification({taskDesc: 'MandaFrete Task'}); // Only Android, iOS will ignore this call
      // iOS will also run everything here in the background until .stop() is called
      // await BackgroundService.stop();
    }

    // const showLoc = async(data: any) => {
    //   console.log(data)
    // } 

    // const errorShow = async(data: any) => {
    //   console.log("ERROR: ", data)
    // }

    // const InitGetGeo = async() => {
    //   // if(started){
    //   //   return
    //   // }
    //   // setStarted(true)
    //   // await Geolocation.watchPosition((e)=> {console.log(e)}, errorShow, {
    //   //   showsBackgroundLocationIndicator: true,
    //   //   showLocationDialog: true,
    //   //   forceRequestLocation: true,
    //   // })
    //   // while(true){
    //   //   console.log("GET GEO...")
    //   //   await sleep(5)
    //   // }
    // }
    // InitGetGeo()
    StartTask()
    // if (!started){
    //   setStarted(true)
    //   InitGetGeo()
    // }

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
  // return (
  //   <View style={styles.sectionContainer}>
  //     <Text
  //       style={[
  //         styles.sectionTitle,
  //         {
  //           color: isDarkMode ? Colors.white : Colors.black,
  //         },
  //       ]}>
  //       {title}
  //     </Text>
  //     <Text
  //       style={[
  //         styles.sectionDescription,
  //         {
  //           color: isDarkMode ? Colors.light : Colors.dark,
  //         },
  //       ]}>
  //       {children}
  //     </Text>
  //   </View>
  // );
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
            <Section title="Manda Frete">
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
