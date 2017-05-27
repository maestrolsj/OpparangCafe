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
    View,
    Button
} from 'react-native';
import {Navigation} from 'react-native-navigation';

import {connect}        from 'react-redux'
import * as LoginAction from '../actions/LoginAction';

class Tab1 extends Component {


    constructor(props) {
        super(props);
        this.GotoDetail = this.GotoDetail.bind(this);

    }



    GotoDetail(){

        this.props.navigator.push({
            screen          : 'Tab1Detail', // unique ID registered with Navigation.registerScreen
            title           : "첫번째 화면 상세", // navigation bar title of the pushed screen (optional)
            passProps       : {}, // Object that will be passed as props to the pushed screen (optional)
            animated        : true, // does the push have transition animation or does it happen immediately (optional)
            backButtonTitle : undefined, // override the back button title (optional)
            backButtonHidden: false, // hide the back button altogether (optional)
            navigatorButtons: {}, // override the nav buttons for the pushed screen (optional)
            navigatorStyle: {
                navBarHidden: false,
            }
        });


    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Tab1 {this.props.isLogin?'Yes':'No'}
                </Text>
                    <Button
                        onPress={this.GotoDetail}
                        title="go to detail"
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                    />


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

export default connect(mapStateToProps, mapDispatchToProps)(Tab1)


