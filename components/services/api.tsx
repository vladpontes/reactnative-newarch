import { getAccessToken, getUserSub, setAccessToken } from "./storage";

const graphqlEndPoint = "https://5efkikbzmjd7tnwtyrqiveqgty.appsync-api.us-east-1.amazonaws.com/graphql"

export const listVehicles = async() => {
    await fetch(graphqlEndPoint,{
        method:"POST",

    })
}

const requestApi = async(query: any) => {
    let accessToken = await getAccessToken()
    await fetch(graphqlEndPoint, {
        method:"POST",
        headers: {
            "Authorization": accessToken,
            "Content-Type": "application/json, charset=UTF-8"
        } as any,
        body: JSON.stringify({"query":query})
    }).then(res=>{
        // console.log("RES STATUS: ", res.status)
        return res.json()
    }).then(json=>{
        console.log("RESPONSE: ",json)
    }).catch(e=>{
        console.log("ERROR: ", e)
    });
}

export const insertGeoLoc = async(data: any, setInfo: any) => {
    let accessToken = await getAccessToken()
    let userSub = await getUserSub()
    console.log("USERSUB: ", userSub)
    // console.log("TOKEN: ", accessToken)
    // let timestamp = new Date(data.timestamp)
    // console.log("TIMES -> ",timestamp)
    const query = () => {
        return `mutation {createGeolocation(input:{
            usersub:"${userSub}",
            vehicleid:"c45c8e53-e6d9-41e1-ba2d-47a231192abf",
            accuracy:${Math.floor(data.coords.accuracy)},
            altitude:${data.coords.altitude},
            latitude:${data.coords.latitude},
            longitude:${data.coords.longitude},
            heading:${data.coords.heading},
            speed:${data.coords.speed},
            timestamp:"${new Date(data.timestamp).toISOString()}"
        }){id}}`
    }
    // console.log("SENDING: ", query())
    await fetch(graphqlEndPoint, {
        method:"POST",
        headers: {
            "Authorization": accessToken,
            "Content-Type": "application/json, charset=UTF-8"
        } as any,
        body: JSON.stringify({"query":query()})

    }).then(res=>{
        // console.log("RES STATUS: ", res.status)
        return res.json()
    }).then(json=>{
        console.log("RESPONSE: ",json)
        setInfo("RESPONSE: " + JSON.stringify(json))
        try {
            if(json?.errors[0]?.errorType === "UnauthorizedException"){
                console.log("REFAZER LOGIN....");
                setInfo("REFAZER LOGIN....")
                setAccessToken()
            }
        }catch(e){
        }
    }).catch(e=>{
        setInfo("ERRO: " + e)
        console.log("ERROR: ", e)
    });
}