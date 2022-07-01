import React, { Component } from "react";
import { View, Text, StyleSheet,
} from "react-native";
import firebase from "firebase";

export default class Logout extends Component {
    componentDidMount(){
        firebase.default.auth().signOut()
    }
    render(){
        return(
            <View style={styles.container}>
                <Text> Log Out </Text>
            </View>
        )
    }
    
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent:"center",
      alignItems:"center"
    },
    })