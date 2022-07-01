import React, { Component } from "react";
import {   
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  FlatList  
} from "react-native";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { RFValue } from "react-native-responsive-fontsize";
import { TouchableOpacity } from "react-native-gesture-handler";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class LoginScreen extends Component {
constructor(props) {
  super(props);
  this.state = {
    fontsLoaded: false
  };
}

async _loadFontsAsync() {
  await Font.loadAsync(customFonts);
  this.setState({ fontsLoaded: true });
}

componentDidMount() {
  this._loadFontsAsync();
}

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.default.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // Não precisamos reautenticar a conexão do Firebase.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = googleUser => {
    // Precisamos registrar um Observer (observador) no Firebase Auth para garantir que a autenticação seja inicializada.
    var unsubscribe = firebase.default.auth().onAuthStateChanged(firebaseUser => {
      unsubscribe();
      // Verifique se já estamos conectados ao Firebase com o usuário correto.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Crie uma credencial do Firebase com o token de ID do Google.
        var credential = firebase.default.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        // Faça login com a credencial do usuário do Google.
        firebase.default
          .auth()
          .signInWithCredential(credential)
          .then(function(result) {
            if (result.additionalUserInfo.isNewUser) {
              firebase.default
                .database()
                .ref("/users/" + result.user.uid)
                .set({
                  gmail: result.user.email,
                  profile_picture: result.additionalUserInfo.profile.picture,
                  locale: result.additionalUserInfo.profile.locale,
                  first_name: result.additionalUserInfo.profile.given_name,
                  last_name: result.additionalUserInfo.profile.family_name,
                  current_theme: "dark"
                })
                .then(function(snapshot) {});
            }
          })
          .catch(error => {
            // Trate os erros aqui.
            var errorCode = error.code;
            var errorMessage = error.message;
            // O e-mail da conta do usuário que foi usada.
            var email = error.email;
            // O tipo do firebase.auth.AuthCredential que foi usado.
            var credential = error.credential;
            // ...
          });
      } else {
        console.log("Usuário já conectado ao Firebase.");
      }
    });
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        behaviour: "web",
        androidClientId:
        "979988748629-1ldjg4amf5f5pn43fkbtpn9j2qnojobp.apps.googleusercontent.com",
        iosClientId:
        "979988748629-kg9pm9ah28htvfhkgnrjrc26fas3kg0r.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });

      if (result.type === "success") {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log(e.message);
      return { error: true };
    }
  };

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
      <View style={this.state.light_theme ? styles.containerlight : styles.container}>
        <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.appIcon}
              ></Image>
              <Text style={this.state.light_theme ? styles.appTitleTextlight : styles.appTitleText}>
                📖 App de Posts 📖
              </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={this.state.light_theme ? styles.buttonlight : styles.button} onPress={()=>this.signInWithGoogleAsync()}>
              <Image
              source={require("../assets/google_icon.png")}
              style={styles.googleIcon}
              ></Image>
              <Text style={this.state.light_theme ? styles.googleTextlight : styles.googleText}>
                Login com o Google
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cloudContainer}>
            <Image 
            source={require("../assets/cloud.png")}
            style={styles.cloudImage}
            ></Image>
          </View>
      </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  containerlight: {
    flex: 1,
    backgroundColor: "white"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row"
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  appTitleTextlight: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  cardContainer: {
    flex: 0.85
  },
  cloudContainer: {
    flex: 0.3
  },
  cloudImage: {
    position: "absolute",
    width: "100%",
    resizeMode: "contain",
    bottom: RFValue(-5)
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent:"center",
    alignItems: "center"
  },
  button: {
    width: RFValue(250),
    height: RFValue(50),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: RFValue(30),
    backgroundColor: "white"
  },
  buttonlight: {
    width: RFValue(250),
    height: RFValue(50),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: RFValue(30),
    backgroundColor: "black"
  },
  googleIcon: {
    width: RFValue(30),
    height: RFValue(30),
    resizeMode: "contain"
  },
  googleText: {
    color: "black",
    fontSize: RFValue(20),
    fontFamily: "Bubblegum-Sans"
  },
  googleTextlight: {
    color: "white",
    fontSize: RFValue(20),
    fontFamily: "Bubblegum-Sans"
  },
});