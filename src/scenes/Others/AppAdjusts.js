//React imports
import React, { Component } from 'react'

//React Native imports
import { StyleSheet, View, Text } from 'react-native'

//Components imports
import BackgroundImage from '../../components/BackgroundImage'
import LogoImage from '../../components/LogoImage'


export default class AppAdjusts extends Component {

    //Renders
    render() {
        return(
            <BackgroundImage>
                <View style={ styles.container }>
                    <LogoImage />
                    <Text style={{ color: '#830f52' }}>AJUSTES DE LA APP</Text>
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