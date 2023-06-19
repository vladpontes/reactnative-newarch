import { ResponseApi } from "../models";
import { clearGeolocation, getAccessToken, getUserSub, setAccessToken,getGeolocations } from "./storage";

const graphqlEndPoint = "https://5efkikbzmjd7tnwtyrqiveqgty.appsync-api.us-east-1.amazonaws.com/graphql"
// const graphqlEndPoint = "https://5efkikbzmjd7tnwtyrqiveqgtyaaaaaaaaaaaaa.appsync-api.us-east-1.amazonaws.com/graphql"

export const listVehicles = async() => {
    await fetch(graphqlEndPoint,{
        method:"POST",

    })
}

const requestApi = async(query: any):Promise<ResponseApi> => {
    let accessToken = await getAccessToken()
    let res: ResponseApi = await fetch(graphqlEndPoint, {
        method:"POST",
        headers: {
            "Authorization": accessToken,
            "Content-Type": "application/json, charset=UTF-8"
        } as any,
        body: JSON.stringify({"query":query})
    }).then(res=>{
        return res.json()
    }).then(json=>{
        // console.log("RESPONSE -> ", json)
        try {
            if(json?.errors[0]?.errorType === "UnauthorizedException"){
                console.log("REFAZER LOGIN....");
                setAccessToken()
                return {status:false, message:"Fazendo login..."}
            }
        }catch(e){}
        return {status:true}
    }).catch(e=>{
        // console.log("ERROR: ", e)
        return {status: false, message: `${e}`}
    });
    return res
}

export const insertGeolocation = async(): Promise<ResponseApi> => {
    // console.log("ESTÁ AQUI")
    let data = await getGeolocations()
    if (data === null || data?.length < 12){return {status:true}}
    // console.log("PASSOU AQUI")
    // if (data.length < 6){
    //     return
    // }
    let userSub = await getUserSub()
    let newGeolocation = data.map(item=>{
        return {
            usersub:userSub,
            vehicleid:"c45c8e53-e6d9-41e1-ba2d-47a231192abf",
            accuracy:item.coords.accuracy,
            altitude:item.coords.altitude,
            latitude:item.coords.latitude,
            longitude:item.coords.longitude,
            heading:item.coords.heading,
            speed:item.coords.speed,
            timestamp:new Date(item.timestamp).toISOString()
        }
    })
    let query = `mutation {createGeolocationBatch(input:{items:${JSON.stringify(newGeolocation).replace(/"([^"]+)":/g, '$1:')}})}`
    // let query = `mutation {createGeolocationBatch(input:{items:${util.inspect(newGeolocation)}})}`
    // console.log("query -> ", query)
    let res = await requestApi(query)
    if(!res.status){
        console.log("Falha durante envio, tendando novamente...")
        res = await requestApi(query)
        if (!res.status){
            return res
        }
        await clearGeolocation()
    } else {
        await clearGeolocation()
    }
    return res
}

// export const insertGeoLoc = async(data: any, setInfo: any) => {
//     let accessToken = await getAccessToken()
//     let userSub = await getUserSub()
//     console.log("USERSUB: ", userSub)
//     // console.log("TOKEN: ", accessToken)
//     // let timestamp = new Date(data.timestamp)
//     // console.log("TIMES -> ",timestamp)
//     const query = () => {
//         return `mutation {createGeolocation(input:{
//             usersub:"${userSub}",
//             vehicleid:"c45c8e53-e6d9-41e1-ba2d-47a231192abf",
//             accuracy:${Math.floor(data.coords.accuracy)},
//             altitude:${data.coords.altitude},
//             latitude:${data.coords.latitude},
//             longitude:${data.coords.longitude},
//             heading:${data.coords.heading},
//             speed:${data.coords.speed},
//             timestamp:"${new Date(data.timestamp).toISOString()}"
//         }){id}}`
//     }
//     // console.log("SENDING: ", query())
//     await fetch(graphqlEndPoint, {
//         method:"POST",
//         headers: {
//             "Authorization": accessToken,
//             "Content-Type": "application/json, charset=UTF-8"
//         } as any,
//         body: JSON.stringify({"query":query()})

//     }).then(res=>{
//         // console.log("RES STATUS: ", res.status)
//         return res.json()
//     }).then(json=>{
//         console.log("RESPONSE: ",json)
//         setInfo("RESPONSE: " + JSON.stringify(json))
//         try {
//             if(json?.errors[0]?.errorType === "UnauthorizedException"){
//                 console.log("REFAZER LOGIN....");
//                 setInfo("REFAZER LOGIN....")
//                 setAccessToken()
//             }
//         }catch(e){
//         }
//     }).catch(e=>{
//         setInfo("ERRO: " + e)
//         console.log("ERROR: ", e)
//     });
// }