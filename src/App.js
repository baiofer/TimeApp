//React imports
import React, {Component} from 'react';
//React Native imports
import { StyleSheet, View, Text, YellowBox, TouchableOpacity } from 'react-native';
//Components imports
import SignIn from './scenes/signIn/Signin';
import Register from './scenes/signIn/Register'
import SignAtWork from './scenes/BluetoothLowEnergie/SignAtWork'
//import TabIcon from './components/TabIcon'
import Preloader from './components/Preloader'
import MyMouvements from './scenes/Others/MyMouvements'
import Adjust from './scenes/BluetoothLowEnergie/Adjust'
import Menu from './scenes/Others/Menu'
import Search from './scenes/Others/Search'
import AppAdjusts from './scenes/Others/AppAdjusts'
//React Native Router Flux imports
import { Actions, Router, Scene } from 'react-native-router-flux'
//Icons imports
import Icon from 'react-native-vector-icons/FontAwesome';
//Firebase imports
import firebaseConfig from './utils/firebase'
//import * as firebase from 'firebase'
import firebase from '@firebase/app'
import '@firebase/auth'
firebase.initializeApp(firebaseConfig)
//Utils imports
import * as Utils from './utils'


export default class App extends Component {
  
  language = Utils.Spanish
  constructor() {
    super()
    this.state = {
      isLogged: false,
      loaded: false,
      userLogged: '',
      userUid:'',
      systemToRead: '0',
    }
  }

  //LIVE CYCLE
  async componentDidMount() {
    await firebase.auth().onAuthStateChanged( (user) => {
      console.log('UserLogged: ', user)
      if (user !== null) {
        console.log('UserLogged !== null: ', user)
        this.setState({
          isLogged: true,
          loaded: true,
          userLogged: user.email,
          userUid: user.uid
        })
      } else {
        console.log('UserLogged === null: ', user)
        this.setState({
          isLogged: false,
          loaded: true,
          userLogged: '',
          userUid: '',
        })
      }
      //Save userLogged & userUid
      console.log('UserLoggedInState: ', this.state.userLogged)
      Utils.PersistData.setUserLogged(this.state.userLogged)
      Utils.PersistData.setUserUid(this.state.userUid)
    })
    //Set module BLE not inicialized
    await Utils.PersistData.setBLEIsConnect('0')
    //Get systemToRead
    await Utils.PersistData.getSystemToRead()
    .then( (value) => {
      console.log('systemToRead in componentDiDMount: ', value)
      this.setState({
        systemToRead: value,
      })
    })
  }

  renderTitle(title) {
    return(
      <View style={ styles.titleNav }>
        <Text style={ styles.title }>{ title }</Text>
      </View>
    )
  }

  renderMenuButton() {
    const buttonBackgroundColor = Utils.Constants.buttonBackgroundColor
    return (
      <TouchableOpacity 
        style={ styles.cartButton } 
        onPress={ () => Actions.Menu() }
      >
        <Icon 
          style={{ color: buttonBackgroundColor }} 
          name="ellipsis-h"
          type='FontAwesome'
          size={ 25 }
        />
      </TouchableOpacity>
    )
  }

  renderAdjustsButton() {
    const buttonBackgroundColor = Utils.Constants.buttonBackgroundColor
    return (
      <TouchableOpacity 
        style={ styles.cartButton } 
        onPress={ () => Actions.AppAdjusts() }
      >
        <Icon 
          style={{ color: buttonBackgroundColor }} 
          name="wrench"
          type='FontAwesome'
          size={ 25 }
        />
      </TouchableOpacity>
    )
  }

  renderSearchButton() {
    const buttonBackgroundColor = Utils.Constants.buttonBackgroundColor
    return (
      <TouchableOpacity 
        style={ styles.cartButton } 
        onPress={ () => Actions.Search() }
      >
        <Icon 
          style={{ color: buttonBackgroundColor }} 
          name="search"
          type='FontAwesome'
          size={ 25 }
        />
      </TouchableOpacity>
    )
  }

  //Access to SignIn. There isn't usserLogged ('')
  renderNavigation1() {
    const buttonBackgroundColor = Utils.Constants.buttonBackgroundColor
    return (
      <Router> 
        <Scene key='root'>
          <Scene
            key={ 'SignIn' }
            component={ SignIn }
            navTransparent={ true }
            renderTitle={ this.renderTitle( this.language.beginSession) }
          />
          <Scene
            key={ 'Register' }
            component={ Register }
            navTransparent={ true }
            renderTitle={ this.renderTitle(this.language.register) }
            renderLeftButton={ () => (null) }
          />
          
          <Scene
            key={ 'Menu' }
            component={ Menu }
            navTransparent={ true }
            navBarButtonColor={ buttonBackgroundColor }
            navigationBarStyle={ styles.navBar }
            renderTitle={ this.renderTitle(this.language.Menu) }
          />
          <Scene 
            key={ 'SignAtWork' }
            component={ SignAtWork }
            renderTitle={ this.renderTitle(this.language.sign) }
            navigationBarStyle={ styles.navBar }
            renderLeftButton={ this.renderMenuButton() }
          />
          <Scene 
            key={ 'MyMouvements' }
            component={ MyMouvements }
            renderTitle={ this.renderTitle(this.language.myMouvements) }
            navigationBarStyle={ styles.navBar }
            renderLeftButton={ this.renderMenuButton() }
            renderRightButton={ this.renderSearchButton() }
          />
          <Scene 
            key={ 'Adjust' }
            component={ Adjust }
            renderTitle={ this.renderTitle(this.language.adjust) }
            navigationBarStyle={ styles.navBar }
            renderLeftButton={ this.renderMenuButton() }
            renderRightButton={ this.renderAdjustsButton() }
          />
          <Scene
            key={ 'Search' }
            component={ Search }
            navTransparent={ true }
            navBarButtonColor={ buttonBackgroundColor }
            navigationBarStyle={ styles.navBar }
            renderTitle={ this.renderTitle(this.language.search) }
          />
          <Scene
            key={ 'AppAdjusts' }
            component={ AppAdjusts }
            navTransparent={ true }
            navBarButtonColor={ buttonBackgroundColor }
            navigationBarStyle={ styles.navBar }
            renderTitle={ this.renderTitle(this.language.appAdjusts) }
          />
        </Scene>
      </Router> 
    );
  }

  //Access to ReadCounter. There is systemToRead ( != '' )
  renderNavigation2() {
    const buttonBackgroundColor = Utils.Constants.buttonBackgroundColor
    return (
      <Router> 
        <Scene key='root'>
          <Scene 
            key={ 'SignAtWork' }
            component={ SignAtWork }
            renderTitle={ this.renderTitle(this.language.sign) }
            navigationBarStyle={ styles.navBar }
            renderLeftButton={ this.renderMenuButton() }
          />
          <Scene 
            key={ 'MyMouvements' }
            component={ MyMouvements }
            renderTitle={ this.renderTitle(this.language.myMouvements) }
            navigationBarStyle={ styles.navBar }
            renderLeftButton={ this.renderMenuButton() }
            renderRightButton={ this.renderSearchButton() }
          />
          <Scene 
            key={ 'Adjust' }
            component={ Adjust }
            renderTitle={ this.renderTitle(this.language.adjust) }
            navigationBarStyle={ styles.navBar }
            renderLeftButton={ this.renderMenuButton() }
            renderRightButton={ this.renderAdjustsButton() }
          />
          <Scene
            key={ 'Menu' }
            component={ Menu }
            navTransparent={ true }
            navBarButtonColor={ buttonBackgroundColor }
            navigationBarStyle={ styles.navBar }
            renderTitle={ this.renderTitle(this.language.Menu) }
          />
          <Scene
            key={ 'Search' }
            component={ Search }
            navTransparent={ true }
            navBarButtonColor={ buttonBackgroundColor }
            navigationBarStyle={ styles.navBar }
            renderTitle={ this.renderTitle(this.language.search) }
          />
          <Scene
            key={ 'AppAdjusts' }
            component={ AppAdjusts }
            navTransparent={ true }
            navBarButtonColor={ buttonBackgroundColor }
            navigationBarStyle={ styles.navBar }
            renderTitle={ this.renderTitle(this.language.appAdjusts) }
          />
          <Scene
            key={ 'SignIn' }
            component={ SignIn }
            navTransparent={ true }
            renderTitle={ this.renderTitle(this.language.beginSession) }
          />
          <Scene
            key={ 'Register' }
            component={ Register }
            navTransparent={ true }
            renderTitle={ this.renderTitle(this.language.register) }
          />
        </Scene>
      </Router> 
    );
  }

  //Access to Adjust. There isn't systemToRead ( = '' )
  renderNavigation3() {
    const buttonBackgroundColor = Utils.Constants.buttonBackgroundColor
    return (
      <Router> 
        <Scene key='root'>
          <Scene 
            key={ 'Adjust' }
            component={ Adjust }
            renderTitle={ this.renderTitle('Ajustes') }
            navigationBarStyle={ styles.navBar }
            renderLeftButton={ this.renderMenuButton() }
          />
          <Scene 
            key={ 'MyMouvements' }
            component={ MyMouvements }
            renderTitle={ this.renderTitle('Movimientos') }
            navigationBarStyle={ styles.navBar }
            renderLeftButton={ this.renderMenuButton() }
            renderRightButton={ this.renderSearchButton() }
          />
          <Scene 
            key={ 'SignAtWork' }
            component={ SignAtWork }
            renderTitle={ this.renderTitle('Fichar') }
            navigationBarStyle={ styles.navBar }
            renderLeftButton={ this.renderMenuButton() }
            renderRightButton={ this.renderAdjustsButton() }
          />
          <Scene
            key={ 'Menu' }
            component={ Menu }
            navTransparent={ true }
            navBarButtonColor={ buttonBackgroundColor }
            navigationBarStyle={ styles.navBar }
            renderTitle={ this.renderTitle(this.language.menu) }
          />
          <Scene
            key={ 'Search' }
            component={ Search }
            navTransparent={ true }
            navBarButtonColor={ buttonBackgroundColor }
            navigationBarStyle={ styles.navBar }
            renderTitle={ this.renderTitle(this.language.search) }
          />
          <Scene
            key={ 'AppAdjusts' }
            component={ AppAdjusts }
            navTransparent={ true }
            navBarButtonColor={ buttonBackgroundColor }
            navigationBarStyle={ styles.navBar }
            renderTitle={ this.renderTitle(this.language.appAdjusts) }
          />
          <Scene
            key={ 'SignIn' }
            component={ SignIn }
            navTransparent={ true }
            renderTitle={ this.renderTitle(this.language.beginSession) }
          />
          <Scene
            key={ 'Register' }
            component={ Register }
            navTransparent={ true }
            renderTitle={ this.renderTitle(this.language.register) }
          />
        </Scene>
      </Router> 
    );
  }

  render() {
    const { isLogged, loaded } = this.state
    if (!loaded) {
      return (<Preloader />)
    }
    if (isLogged && loaded) {
      console.log('SystemToRead: ', this.state.systemToRead)
      if (this.state.systemToRead !== '') {
        if (this.state.systemToRead === '0') return <Preloader/>  // NO ENTIENDO ESTO
        else return (this.renderNavigation2()) //2
      } else return (this.renderNavigation3()) //3
    } else {
      return (this.renderNavigation1())
    }
  }
}

const styles = StyleSheet.create({
  title: {
    color: Utils.Constants.titleNavColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: Utils.Constants.buttonBackgroundColor,
    fontSize: 15,
  },
  navBar: {
    backgroundColor: Utils.Constants.buttonLabelColor,
  },
  cartButton: {
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: Utils.Constants.buttonLabelColor,
    height: 70,
  },
});