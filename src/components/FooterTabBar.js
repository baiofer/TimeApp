//React imports
import React, { Component } from 'react'
//React Native imports
import { Text } from 'react-native'
//Native base imports
import { Footer, FooterTab, Button } from 'native-base'
//Utils imports
import Icon from 'react-native-vector-icons/FontAwesome'
//PropTypes imports
import PropTypes from 'prop-types'


export default class FooterTabBar extends Component {

    static propTypes = {
        iconName1: PropTypes.string,
        iconColor1: PropTypes.string,
        iconName2: PropTypes.string,
        iconColor2: PropTypes.string,
        iconName3: PropTypes.string,
        iconColor3: PropTypes.string,
        labelColor1: PropTypes.string,
        labelColor2: PropTypes.string,
        labelColor3: PropTypes.string,
        label1: PropTypes.string,
        label2: PropTypes.string,
        label3: PropTypes.string,
        onPress1: PropTypes.func,
        onPress2: PropTypes.func,
        onPress3: PropTypes.func,
    }

    static defaultProps = {
        iconName1: 'bicycle',
        iconColor1: 'bicycle',
        iconName2: 'bicycle',
        iconColor2: 'black',
        iconName3: 'black',
        iconColor3: 'black',
        labelColor1: 'black',
        labelColor2: 'black',
        labelColor3: 'black',
        label1: 'Option1',
        label2: 'Option2',
        label3: 'Option3',
        onPress1: () => {},
        onPress2: () => {},
        onPress3: () => {},
    }

    render() {
        return(
            <Footer>
                <FooterTab>
                    <Button 
                        vertical
                        onPress={ () => this.props.onPress1() }
                    >
                        <Icon 
                            name={ this.props.iconName1 } 
                            style={{ color: this.props.iconColor1 }}
                            size={ 30 }
                        />
                        <Text style={{ color: this.props.labelColor1, fontSize: 12 }}>{ this.props.label1 }</Text>
                    </Button>
                    <Button 
                        vertical
                        onPress={ () => this.props.onPress2() }
                    >
                        <Icon 
                            name={ this.props.iconName2 } 
                            style={{ color: this.props.iconColor2 }}
                            size={ 30 }
                        />
                        <Text style={{ color: this.props.labelColor2, fontSize: 12 }}>{ this.props.label2 }</Text>
                    </Button>
                    <Button 
                        vertical
                        onPress={ () => this.props.onPress3() }
                    >
                        <Icon 
                            name={ this.props.iconName3 } 
                            style={{ color: this.props.iconColor3 }}
                            size={ 30 }
                        />
                        <Text style={{ color: this.props.labelColor3, fontSize: 12 }}>{ this.props.label3 }</Text>
                    </Button>
                </FooterTab>
            </Footer>
        )
    }
}