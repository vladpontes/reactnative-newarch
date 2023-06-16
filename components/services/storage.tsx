import AsyncStorage from '@react-native-async-storage/async-storage';
import { Auth, Amplify } from 'aws-amplify';

Amplify.configure({
    identityPoolRegion: 'us-east-1',
    userPoolId: 'us-east-1_nVn05m8GW',
    userPoolWebClientId: '1pvsr43il36pn4nl1gcuk1q0g3'
});

export const getAccessToken = async() => {
    const accessToken: string | null = await AsyncStorage.getItem("accessToken");
    return accessToken;
}

export const getUserSub = async() => {
    const userSub: string | null = await AsyncStorage.getItem("userSub");
    return userSub;
}

export const addGeolocation = async(value:any) => {
    let oldItem: any = await AsyncStorage.getItem("geolocations")
    // console.log("OLD GEO -> ", oldItem)
    if (oldItem != null){
        oldItem = await JSON.parse(oldItem)
        await AsyncStorage.setItem("geolocations", JSON.stringify([...oldItem, value]))
        return
    }
    // console.log("FIRST -> ", JSON.stringify([value]))
    await AsyncStorage.setItem("geolocations", JSON.stringify([value]))
}

export const getGeolocations = async():Promise<any[] | null> => {
    let geolocations = await AsyncStorage.getItem("geolocations")
    return geolocations ? JSON.parse(geolocations) : null
}

export const clearGeolocation = async() => {
    console.log("CLEANING GEOLOCATIONS")
    await AsyncStorage.removeItem("geolocations")
}

export const setGeolocation = async(value: string) => {
    await AsyncStorage.setItem("geolocation", value)
}

export const getGeolocation = async() => {
    const geolocation: string | null = await AsyncStorage.getItem("geolocation")
    if(geolocation == null){
        await setGeolocation("f")
        return false
    }
    if(geolocation === "f"){
        return false
    }
    return true
}

export const setAccessToken = async() => {
    console.log("FAZENDO LOGIN....")
    await Auth.signIn('leonidas@beatlab.com.br', '3b253WR95jyH').then(data => {
        // console.log("Data -> " + JSON.stringify(data));
        // console.log("Data -> " + data.signInUserSession.idToken.jwtToken);
        AsyncStorage.setItem("accessToken", data.signInUserSession.idToken.jwtToken);
        AsyncStorage.setItem("userSub", data.signInUserSession.idToken.payload.sub);
        //alert("Logado com sucesso!");
        // window.location.href = "/home";
    }).catch(err => {
        console.log("Erro -> " + err.message);
        // alert(err.message);
    });
}