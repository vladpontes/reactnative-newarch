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
import { setAccessToken } from './src/services/storage';
import { insertGeoLoc } from './src/services/api';
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
    const startThis = async() => {
      await setAccessToken()
    }
    startThis()
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
    
    const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), time * 1000));
    const StartTask = async () => {
    const veryIntensiveTask = async (taskDataArguments: any) => {
        const { delay } = taskDataArguments;
        await new Promise( async (resolve) => {
            for (let i = 0; BackgroundService.isRunning(); i++) {
              await sleep(delay);
              console.log(i);
              // Geolocation.getCurrentPosition(async(info) => {console.log(info)});
              // await Geolocation.getCurrentPosition(async(info) => {console.log(info); await saveDataGeoLoc(JSON.stringify(info))});
              // console.log("GET DATA -> ", await getDataGeoLoc())
              Geolocation.getCurrentPosition(async(info)=>{console.log(info);insertGeoLoc(info)}, (e)=>{console.log(e)}, {timeout: 20000});
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
    
    StartTask()
  
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
