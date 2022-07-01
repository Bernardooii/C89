import React, {Component} from "react";
import { View, SafeAreaView, StylesSheet, Image } from "react-native"
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import {DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer"

export default class CustomSidebarMenu extends Component{
    constructor(props) {
        super(props);
        this.state = {
          light_theme: true
        };
      }

      componentDidMount() {
        this.fetchUser();
      }

      fetchUser = () => {
        let theme;
        firebase
          .database()
          .ref("/users/" + firebase.auth().currentUser.uid)
          .on("value", snapshot => {
            theme = snapshot.val().current_theme;
            this.setState({ light_theme: theme === "light" });
          });
      };
    
      render(){
        let props = this.props;
        return(
            <View style={this.state.light_theme ? styles.containerLight : styles.container}>
                <Image
                source={require("../assets/logo.png")}
                style={styles.image}
                />
                <DrawerContentScrollView {...props}>
                    <DrawerItemList {...props}/>
                </DrawerContentScrollView>
            </View>
        )
      }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#15193c"
    },
    containerLight: {
      flex: 1,
      backgroundColor: "white"
    },
    image: {
        width: RFValue(140),
        height: RFValue(140),
        berderRadius: RFValue(70),
        alignSelf: "center",
        marginTop: RFValue(60),
        resizeMode: "contain",
    },
})