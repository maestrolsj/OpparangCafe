/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import    {Navigation}  from 'react-native-navigation';
import * as LoginAction from '../actions/LoginAction';
import {connect}        from 'react-redux';

var  themeColor='#cf3273';


class LoadingScreen extends Component {


    componentDidMount(){

        this.props._setLogin(true);

        setTimeout(()=>{

            Navigation.startTabBasedApp({
                tabs: [
                    {
                        label         : 'Tab1',
                        screen        : 'Tab1',
                        icon          : require('../img/home.png'),
                        selectedIcon  : require('../img/home2.png'),
                        title         : '첫번째화면',
                        subtitle      : '섭타이틀',
                        navigatorStyle: {
                            navBarHidden:true,

                        }
                    },
                    {
                        label: 'Tab2',
                        screen: 'Tab2',
                        icon: require('../img/my.png'),
                        selectedIcon    : require('../img/my2.png'),
                        title           : '두번째화면',
                        navigatorStyle: {
                            navBarHidden:true,
                        }
                    }]
                ,
                appStyle: {
                    tabBarBackgroundColor    : themeColor,
                    tabBarButtonColor        : '#ffffff',
                    tabBarSelectedButtonColor: '#63d7cc',

                },
                tabsStyle: { // optional, **iOS Only** add this if you want to style the tab bar beyond the defaults
                    tabBarBackgroundColor    :  themeColor,
                    tabBarSelectedButtonColor: '#2980B9',
                    // tabBarButtonColor: '#ffffff'
                }

            });



        }, 2000)
        //서버작업
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                  Loading...
                </Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});


const mapStateToProps = (state) => ({
    isLogin: state.LoginReducer.isLogin,  // getter
});

const mapDispatchToProps = {
    _setLogin: LoginAction.setLoginValue,  // setter
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen)

