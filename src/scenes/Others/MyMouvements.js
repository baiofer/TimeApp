//React imports
import React, { Component } from 'react'
//React native imports
import { Text, View, StyleSheet, FlatList, Dimensions } from 'react-native'
//Native base imports
import { Container } from 'native-base'
//Imports from Firebase
import * as firebase from 'firebase'
//Components imports
import FooterTabBar from '../../components/FooterTabBar'
//React native router flux imports
import { Actions } from 'react-native-router-flux'
//Utils imports
import * as Utils from '../../utils'


export default class MyMouvements extends Component {

    language = Utils.Spanish
    constructor(props) {
        super(props)
        this.state = {
            readings: [],
        }
    }

    componentDidMount() {
        console.log('ComponentDidMountMyMouvements')
        //Leer datos de Firebase
        const userId = firebase.auth().currentUser.uid
        firebase.firestore().collection('Clientes').doc('Cliente1').collection('Users').doc(userId).collection('Fichajes').orderBy('fecha', 'asc').orderBy('hora', 'asc').get()
            .then( (snapshot) => {
                const { readings } = this.state
                snapshot.forEach( (doc) => {
                    readings.push(doc.data())
                })                
                console.log('Readings: ', readings)
                this.setState({
                    readings: readings,
                })
            })
    }

    selectInformation() {
        //Aqui tratare la informacion para presentarla
        const { readings } = this.state
        console.log('Select_readings: ', readings)
        
        return readings
    }

    signAtWork() {
        Actions.reset('SignAtWork')
    }

    myMouvements() {
        Actions.replace('MyMouvements')
    }

    adjust() {
        Actions.reset('Adjust')
    }

    renderReading(item) {
        const itemToShow = item.item
        return(
            <View style={ styles.item }>
                <Text style={ styles.text2Style }>{ itemToShow.fecha }  -  { itemToShow.hora }  :   { itemToShow.movimiento } </Text>
            </View>
                
        )
    }

    render() {
        const info = this.selectInformation()
        return(
            <Container style={ styles.container }>
                <View style={ styles.container }>
                    <FlatList 
                        style={{ marginTop: 10 }}
                        data={ info }
                        renderItem={ (item) => this.renderReading(item) }
                        extraData={ this.state }
                        keyExtractor={ (item) => item.hora.toString() }
                    /> 
                </View>
                <FooterTabBar
                    iconName1='edit'
                    iconColor1={ Utils.Constants.buttonBackgroundColor }
                    iconName2='list'
                    iconColor2={ Utils.Constants.titleNavColor }
                    iconName3='wrench'
                    iconColor3={ Utils.Constants.buttonBackgroundColor }
                    labelColor1={ Utils.Constants.buttonBackgroundColor }
                    labelColor2={ Utils.Constants.titleNavColor }
                    labelColor3={ Utils.Constants.buttonBackgroundColor }
                    label1='Fichar'
                    label2='Movimientos'
                    label3='Ajustes'
                    onPress1={ () => this.signAtWork() }
                    onPress3={ () => this.adjust() }
                /> 
            </Container>
        )
    }
}


//Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Utils.Constants.buttonLabelColor,
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
    },
    item: {
        backgroundColor: Utils.Constants.buttonLabelColor,
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        marginTop: 5,
        borderColor: Utils.Constants.buttonBackgroundColor,
        borderRadius: 5,
        borderWidth: 1,
        width: 300,
    },
    text1Style: {
        color: Utils.Constants.buttonBackgroundColor,
        fontSize: 18,
        fontWeight: 'bold',
    },
    text2Style: {
        color: Utils.Constants.buttonBackgroundColor,
        fontSize: 12,
        fontWeight: 'bold',
    },
    tabBarContainer: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 5,
    },
})