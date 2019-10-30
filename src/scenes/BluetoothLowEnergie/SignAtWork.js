//React imports
import React, { Component } from 'react'
//React Native imports
import { StyleSheet, View, NativeEventEmitter, NativeModules, ActivityIndicator, Alert, Text, Platform, PermissionsAndroid, Dimensions } from 'react-native'
//Native base imports
import { Container } from 'native-base'
//Bluetooth imports
import BleManager from 'react-native-ble-manager'
//Imports from Firebase
import firebase from '@firebase/app'
import '@firebase/auth'
//import '@firebase/database'
import '@firebase/firestore'
//Moment imports (Date)
import Moment from 'moment'
//Components imports
import LogoImage from '../../components/LogoImage'
import AppButton from '../../components/AppButton'
import FooterTabBar from '../../components/FooterTabBar'
//Utils imports
import * as Utils from '../../utils'
//react native router flux imports
import { Actions } from 'react-native-router-flux'
//import Icon from 'react-native-vector-icons/FontAwesome'

const BleManagerModule = NativeModules.BleManager
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)



export default class SignAtWork extends Component {

    language = Utils.Spanish
    constructor(props) {
        super(props)
        this.state = {
            scanning: false,
            connected: false,
            userUid: '',
            systemToRead: '',
        }
    }

    async componentDidMount() {
        await Utils.PersistData.getBLEIsConnect()
            .then( (bleIsConnect) => {
                if (bleIsConnect === '0') {
                    BleManager.start({ showAlert: false })
                        .then( () => {
                            console.log('Módulo ReadCounter inicilizado')
                            Utils.PersistData.setBLEIsConnect('1')
                    })
                }  
            })
        this.handleDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral.bind(this))
        //For Android only
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                  console.log("Permission is OK");
                } else {
                  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                    if (result) {
                      console.log("User accept");
                    } else {
                      console.log("User refuse");
                    }
                  });
                }
          });
        }
        //Cojemos el sistema a leer y el userUid desde AsyncStorage
        Utils.PersistData.getSystemToRead()
            .then( (value) => {
                if (value !== 'none' || value !== '') {
                    this.setState({
                        systemToRead: value,
                    })
                    console.log('SystemToReadInReadCounter: ', this.state.systemToRead)
                }
            })
        Utils.PersistData.getUserUid()
            .then( (value) => {
                if (value !== 'none' || value !== '') {
                    this.setState({
                        userUid: value,
                    })
                    console.log('UserUidInReadCounter: ', this.state.userUid)
                }
            })    
    }

    componentWillUnmount() {
        this.handleDisconnect.remove()
    }
    
    handleDisconnectedPeripheral(data) {
        console.log('Data: ', data)
        this.setState({ 
            connected: false,
            counterIsReaded: false,
        })
        console.log('Disconnected from ', data.peripheral)
    }

    saveMouvement(type) {
        userUid = this.state.userUid
        const dateNew = Moment()
        const date = dateNew.format('YYYY-MM-DD')
        const hour = dateNew.format('HH:mm:ss')
        const reading = {
            fecha: date,
            hora: hour,
            movimiento: type
        }
        firebase.firestore().collection('Clientes').doc('Cliente1').collection('Users').doc(userUid).collection('Fichajes').add(reading)
        .then( () => {
            if (type === 'Entrada') {
                Alert.alert(
                    this.language.inputSigned,
                    date + ' - ' + hour,
                    [{
                        text:'OK',
                        onPress: () => this.test('in'),
                    }],
                )
            } else {
                Alert.alert(
                    this.language.outputSigned,
                    date + ' - ' + hour,
                    [{
                        text:'OK',
                        onPress: () => this.test('out'),
                    }],
                )
            }
        })
        .catch( (error) => {
            Alert.alert(
                this.language.errorSavingMouvement,
                error,
                [{
                    text:'OK',
                    onPress: () => this.test(),
                }],
            )
        })
    }

    test(type) {
        if (this.state.scanning) return null
        //If peripheral connected, we disconnect it
        if (this.state.connected) {
            BleManager.disconnect(this.state.systemToRead)
            console.log('Hay que desconectar el equipo')
        //If terminal not connected, we connect it
        } else {
            console.log('Voy a conectar ', this.state.systemToRead)
            BleManager.connect(this.state.systemToRead)
                .then( () => {
                    console.log('Connected to ', this.state.systemToRead)
                    this.setState({ 
                        connected: true,
                    })
                    if (type === 'in') {
                        this.saveMouvement('Entrada')
                    } else {
                        this.saveMouvement('Salida')
                    }
                })
                .catch( (error) => {
                    Alert.alert(
                        this.language.notReadable,
                        '',
                    )
                    console.log('ErrorConnect: ', error)
                })
        }
    }

    signAtWork() {
        Actions.replace('SignAtWork')
    }

    myMouvements() {
        Actions.MyMouvements()
    }

    adjust() {
        Actions.Adjust()
    }

    systemVisibility() {
        if (this.state.connected) {
            return null
        } else {
            return <Text style={ styles.text3 }>El sistema no está visible</Text>
        }
    }

    //We render the activity indicator if necesary
    renderActivity() {
        if (this.state.scanning || (this.state.connected && !this.state.counterIsReaded)) {
            return(
                <ActivityIndicator 
                    size="large" 
                    color={ Utils.Constants.buttonBackgroundColor }
                    style={ {marginTop: 20 } } 
                />
            )
        }
        return null
    }

    //If not exits system to read, we put a message
    renderReadButton() {
        const color = this.state.connected ? 'green' :  Utils.Constants.buttonBackgroundColor
        const width = Dimensions.get('window').width / 2 - 20
        if (this.state.systemToRead === '') {
            return(
                <View style={ styles.texts }>
                    <Text style={ styles.text1 }>{ this.language.notSystem }</Text>
                    <Text style={ styles.text2 }>{ this.language.goConfig }</Text>
                </View>
            )
        } else {
            return(
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                    <AppButton
                        bgColor={ color }
                        onPress={ () => this.test('in')}
                        label={ this.language.input }
                        labelColor={ Utils.Constants.buttonLabelColor }
                        iconColor={ Utils.Constants.buttonLabelColor }
                        setWidth = { width }
                    />
                    <AppButton
                        bgColor={ color }
                        onPress={ () => this.test('out')}
                        label={ this.language.output }
                        labelColor={ Utils.Constants.buttonLabelColor }
                        iconColor={ Utils.Constants.buttonLabelColor}
                        setWidth = { width }
                    />
                </View>
                { this.systemVisibility() }
                </View>
            )
        }
    }

    render() { 
        return(
            <Container style={ styles.container }>
                <View style={ styles.container }>
                    <LogoImage />
                    { this.renderReadButton() }
                    { this.renderActivity() }
                </View>
                <FooterTabBar
                    iconName1='edit'
                    iconColor1={ Utils.Constants.titleNavColor }
                    iconName2='list'
                    iconColor2={ Utils.Constants.buttonBackgroundColor }
                    iconName3='wrench'
                    iconColor3={ Utils.Constants.buttonBackgroundColor }
                    labelColor1={ Utils.Constants.titleNavColor }
                    labelColor2={ Utils.Constants.buttonBackgroundColor }
                    labelColor3={ Utils.Constants.buttonBackgroundColor }
                    label1='Fichar'
                    label2='Movimientos'
                    label3='Ajustes'
                    onPress2={ () => this.myMouvements() }
                    onPress3={ () => this.adjust() }
                />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Utils.Constants.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
    },
    texts: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text1: {
        color: Utils.Constants.buttonBackgroundColor,
        fontSize: 20,
        fontWeight: 'bold',
    },
    text2: {
        color: Utils.Constants.buttonBackgroundColor,
        fontSize: 15,
    },
    text3: {
        color: Utils.Constants.buttonBackgroundColor,
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
    },
})