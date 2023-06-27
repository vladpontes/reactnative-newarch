# reactnative-newarch
Setar variável global antes de rodar: ORG_GRADLE_PROJECT_newArchEnabled=true

# Criando projeto React Native com a nova arquitetura:

<p>1 - Configure o seu Ambiente Linux ou macOS para rodar ReactNative seguindo os passos desse link: https://reactnative.dev/docs/environment-setup</p> 
<p>2 - Crie um projeto ReactNative: npx react-native@latest init reactnativenewarch</p> 
<p>3 - Em android/gradle.properties altere a variável "newArchEnabled" para true</p>
<p>4 - Sete a variável de ambiente: ORG_GRADLE_PROJECT_newArchEnabled=true</p>
<p>5 - Baixe e instale o Genymotion a partir do link: https://www.genymotion.com/download/</p>
<p>6 - Abra o Genymotio e na barra de ferramentas em Genymotion > Settings > ADB, selecione Use custom "Android SDK tools" e altere para o caminho do android-sdk, exemplo: /usr/lib/android-sdk</p>
<p>7 - Para rodar o projeto tenha uma vm do Genymotion aberta e na pasta do projeto execute o comando: "npx react-native start", e então tecle "a" para rodar o projeto</p>


# Criando APK Release do projeto:

<p>1 - (Opcional) Crie uma keystore com os dados desejados e configure o arquivo build.gradle seguindo o tutorial do link: https://instamobile.io/android-development/generate-react-native-release-build-android/</p>
<p>2 - Abra a pasta android e execute o comando: "./gradlew assembleRelease"</p>
<p>3 - Ao final do processo a APK estará diponível em "android/app/build/outputs/release"</p>