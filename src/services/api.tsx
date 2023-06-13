import { getAccessToken, getUserSub } from "./storage";

export const listVehicles = async() => {
    await fetch("https://5efkikbzmjd7tnwtyrqiveqgty.appsync-api.us-east-1.amazonaws.com/graphql",{
        method:"POST",

    })
}

export const insertGeoLoc = async(data: any) => {
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
            accuracy:${data.coords.accuracy},
            altitude:${data.coords.altitude},
            latitude:${data.coords.latitude},
            longitude:${data.coords.longitude},
            heading:${data.coords.heading},
            speed:${data.coords.speed},
            timestamp:"${new Date(data.timestamp).toISOString()}"
        }){id}}`
    }
    // console.log("SENDING: ", query())
    await fetch('https://5efkikbzmjd7tnwtyrqiveqgty.appsync-api.us-east-1.amazonaws.com/graphql', {
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
    }).catch(e=>{
        console.log("ERROR: ", e)
    });
}