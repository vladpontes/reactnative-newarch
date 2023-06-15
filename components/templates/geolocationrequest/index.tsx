import React, { View, Text, StyleSheet, Button, Linking, TouchableOpacity } from "react-native"

const GeolocationRequest = () => {

    const message = `O aplicativo do manda frete realiza coleta de local para ativar o rastreamento da carga durante sua viagem. \n
Não se preocupe, iremos ajuda-lo para realizar está configuração.
Permissões -> Localização e marque a opção "Permitir o tempo todo"`
    
    return (
        <View> 
            <Text style={styles.baseText}>
                Usar localização
            </Text>
            <Text style={styles.innerText}>
                {message}
            </Text>
            {/* <Button title="Permitir" onPress={()=>  Linking.openSettings()}/> */}

            <TouchableOpacity style={styles.button} onPress={()=>  Linking.openSettings()}>
                <Text style={{color:'white', fontWeight: 'bold'}}>
                    Ir para configurações
                </Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    baseText: {
      fontWeight: 'bold',
      fontSize: 20,
      color: '#0099ff',
    },
    innerText: {
      color: '#0099ff',
    },
    button: {
        backgroundColor: "#00cccc",
        marginTop: 15,
        padding: 15,
        borderRadius: 16,
        textAlign: 'center',
        alignItems: 'center'
    }
  });

export default GeolocationRequest