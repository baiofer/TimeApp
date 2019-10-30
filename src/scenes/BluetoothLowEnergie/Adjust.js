//React imports
import React, { Component } from 'react'

//React Native imports
import { StyleSheet, Text, View, NativeEventEmitter, NativeModules, FlatList, ActivityIndicator, Alert, Platform, PermissionsAndroid } from 'react-native'

//Native base imports
import { Container } from 'native-base'

//Components imports
import LogoImage from '../../components/LogoImage'
import FooterTabBar from '../../components/FooterTabBar'
import AppButton from '../../components/AppButton'

//React native router flux imports
import { Actions } from 'react-native-router-flux'

//Utils imports
import * as Utils from '../../utils'

//BLE Manager imports
import BleManager from 'react-native-ble-manager'

const BleManagerModule = NativeModules.BleManager
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)

const newListExits = false


export default class Adjust extends Component {

    language = Utils.Spanish
    constructor(props) {
        super(props)
        this.state = {
            peripherals: new Map(),
            scanning: false,
            connected: false,
            userUid: '',
            systemToRead: '',
            reloadComponent: false,
        }
    }

    //LIFE CYCLE
    async componentDidMount() {
        //Test if bluetooth is initialized
        await Utils.PersistData.getBLEIsConnect()
            .then( (bleIsConnect) => {
                if (bleIsConnect !== '1') {
                    BleManager.start({ showAlert: false })
                        .then( () => {
                            console.log('Módulo Adjust inicilizado')
                            Utils.PersistData.setBLEIsConnect('1')
                    })
                }  
            })
        //Define handlers
        this.handleDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral.bind(this))

        this.handleStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan.bind(this))

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
        //Get systemToRead and userUid from AsyncStorage
        Utils.PersistData.getSystemToRead()
            .then( (value) => {
                if (value !== '') {
                    this.setState({
                        systemToRead: value,
                    })
                    console.log('SystemToReadInAdjust: ', this.state.systemToRead)
                }
            })
        Utils.PersistData.getUserUid()
            .then( (value) => {
                if (value !== 'none' || value !== '') {
                    this.setState({
                        userUid: value,
                    })
                    console.log('UserUidInAdjust: ', this.state.userUid)
                }
            })
    }

    componentWillUnmount() {
        this.handleDiscover.remove()
        this.handleStop.remove()
        this.handleDisconnect.remove()
    }

    //FUNCTIONS
    handleDiscoverPeripheral(peripheral) {
        var peripherals = this.state.peripherals
        if (!peripherals.has(peripheral.id)) {
            console.log('Got BLE peripheral ', peripheral)
            peripherals.set(peripheral.id, peripheral)
            this.setState({ peripherals })
        }
    }

    handleStopScan() {
        console.log('Scan is stopped')
        this.setState({
            scanning: false,
        })
        if (!this.newListExits) {
            Alert.alert(
                this.language.notBoundedSystems,
                '',
            )
        }
    }

    handleDisconnectedPeripheral(data) {
        console.log('Data: ', data)
        let peripherals = this.state.peripherals
        let peripheral = peripherals.get(data.peripheral)
        if (peripheral) {
            peripheral.connected = false
            peripherals.set(peripheral.id, peripheral)
            this.setState({ 
                peripherals,
                connected: false,
            })
        }
        console.log('Disconnected from ', data.peripheral)
    }

    startScan() {
        if (!this.state.scanning) {
            this.setState({ periferals: new Map()})
            BleManager.scan([], 3, true)
                .then( (results) => {
                    console.log('Scanning ...')
                    this.setState({
                        scanning: true
                    })
                })
        }
    }

    itemSelected(item) {
        if (this.state.scanning) return null
        const itemToSave = `${item.advertising.localName} \n ${item.id}`
        Alert.alert(
            this.language.systemSelected,
            itemToSave,
            [{
                text: this.language.ok,
                onPress: () => this.changeReload(item.id),
            }],
        )
    }

    changeReload(item) {
        const reld = !this.state.reloadComponent
        this.setState({
            reloadComponent: reld,
            systemToRead: item
        })
        Utils.PersistData.setSystemToRead(item)
    }

    //We look for only the client sistem, and systems than not have another user in systemsUsers table
    lookForBikeElement(data) {
        if (data === []) return []
        console.log('Lista: ', data)
        let newList = []
        data.forEach( (element) => {
            if (element.advertising.localName === 'BIKE' || element.name === 'Arduino') {
                newList.push(element)
                console.log('pushed element: ', element)
            }
        })
        if (newList !== [] ) this.newListExits = true
        else this.newListExits= false
        return newList
    }

    removeSystem() {
        Utils.PersistData.setSystemToRead('')
        this.setState({
            systemToRead: ''
        })
    }

    signAtWork() {
        Actions.SignAtWork()
    }

    myMouvements() {
        Actions.reset('MyMouvements')
    }

    adjust() {
        Actions.replace('Adjust')
    }

    //RENDERS
    //We render the activity indicator if necesary
    renderActivity(item) {
        if (this.state.scanning || item.connected) {
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

    renderActivity2() {
        if (this.state.scanning) {
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

    //We render the system to read
    renderItem(item) {
        const labelItem = `${ this.language.selectSystem } ${item.id.substring(0, 8)}`
        return(
            <View>
                <AppButton
                    bgColor={ Utils.Constants.buttonBackgroundColor }
                    onPress={ () => this.itemSelected(item)}
                    label={ labelItem }
                    labelColor={ Utils.Constants.buttonLabelColor }
                    iconColor={ Utils.Constants.buttonLabelColor }
                />
                { this.renderActivity(item) }
            </View>
        )
    }

    renderScanButton(dataSource) {
        const { systemToRead } = this.state
        if (systemToRead === '') {
            return(
                <View style={ styles.container }>
                    <AppButton
                        bgColor={ Utils.Constants.buttonBackgroundColor }
                        onPress={ () => this.startScan()}
                        label={ this.language.searchSystem }
                        labelColor={ Utils.Constants.buttonLabelColor }
                        iconColor={ Utils.Constants.buttonLabelColor }
                    />
                    { this.renderActivity2() }
                    <FlatList 
                        enableEmptySections={ true }
                        data={ dataSource }
                        renderItem={ ({ item }) => this.renderItem(item) }
                        extraData={ this.state }
                        keyExtractor={ (item) => item.id }
                    />
                </View>
            )
        } else {
            return(
                <View>
                    <Text style={{ color: Utils.Constants.buttonBackgroundColor, marginBottom: 20 }}>{ this.language.systemAlreadyBounded } { systemToRead }</Text>
                    <AppButton
                        bgColor={ Utils.Constants.buttonBackgroundColor }
                        onPress={ () => this.removeSystem()}
                        label={ this.language.unboundSystem }
                        labelColor={ Utils.Constants.buttonLabelColor }
                        iconColor={ Utils.Constants.buttonLabelColor }
                    />
                </View>
            )
        }
    }

    render() {
        const list = Array.from(this.state.peripherals.values())
        //Look for element to connect
        const dataSource = this.lookForBikeElement(list)
        console.log('Array: ', list)
        console.log('NewList: ', dataSource)
        return(
            <Container style={ styles.container }> 
                <View style={ styles.container }>
                    <LogoImage />
                    { this.renderScanButton(dataSource) }
                </View>
                <FooterTabBar
                    iconName1='edit'
                    iconColor1={ Utils.Constants.buttonBackgroundColor }
                    iconName2='list'
                    iconColor2={ Utils.Constants.buttonBackgroundColor }
                    iconName3='wrench'
                    iconColor3={ Utils.Constants.titleNavColor }
                    labelColor1={ Utils.Constants.buttonBackgroundColor }
                    labelColor2={ Utils.Constants.buttonBackgroundColor }
                    labelColor3={ Utils.Constants.titleNavColor }
                    label1='Fichar'
                    label2='Movimientos'
                    label3='Ajustes'
                    onPress1={ () => this.signAtWork() }
                    onPress2={ () => this.myMouvements() }
                    //onPress3={ () => this.adjust() }
                />
            </Container>
        )
    }
}

//Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBarContainer: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 5,
    },
});