//React imports
import React, { Component } from 'react'
//React Native imports
import { StyleSheet, View } from 'react-native'
//Components imports
import BackgroundImage from '../../components/BackgroundImage'
import LogoImage from '../../components/LogoImage'
import AppButton from '../../components/AppButton'
//React Native Router Flux imports
import { Actions } from 'react-native-router-flux'
//Imports from Firebase
import * as firebase from 'firebase'
//Utils imports
import * as Utils from '../../utils'


export default class Menu extends Component {

    language = Utils.Spanish
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    //Life cycle
    
    //Functions
    logOut() {
        //Delete userLogged in AsyncStorage
        Utils.PersistData.setUserLogged('')
        Utils.PersistData.setUserUid('')
        //Logout firebase
        firebase.auth().signOut()
        Actions.SignIn()
    }

    //Renders
    render() {
        const buttonBackgroundColor = Utils.Constants.buttonBackgroundColor
        const buttonLabelColor = Utils.Constants.buttonLabelColor
        return(
            <BackgroundImage>
                <View style={ styles.container }>
                    <LogoImage />
                    <AppButton
                        bgColor={ buttonBackgroundColor }
                        onPress={ () => this.logOut()}
                        label={ this.language.logout }
                        labelColor={ buttonLabelColor }
                        iconColor={ buttonLabelColor }
                    />
                </View>
            </BackgroundImage>
        )
    }
}

//Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
});