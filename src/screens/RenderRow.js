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
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native';
import    {Navigation} from 'react-native-navigation';

import Ionicons         from 'react-native-vector-icons/Ionicons';
import FontAwesome         from 'react-native-vector-icons/FontAwesome';

var themeColor='#cf3273'

const heartIcon = ( <FontAwesome name="star"      size={16}   color={themeColor} />);
const pinIcon   = ( <Ionicons name="ios-pin-outline" size={15}   color="#5D5D5D" style={{ marginRight:5}} />)

const SCREEN_WIDTH = Dimensions.get('window').width;

class RenderRow extends Component {




    render() {

        var concept="";
        var i;
        for(i=0 ; i < this.props.item.concept.length ; i++){
            concept += this.props.item.concept[i]+ " ";
        }
        return (
                <View   style={styles.renderRowView} >
                    <Image source     = {require('../img/cafe1.png')}
                           style      = {{width:150, height:120 }} />

                    <View style={{backgroundColor:'white', flex:1}}>
                        <View style={styles.countView}>
                            {heartIcon}
                            <Text style={styles.favoriteCount}>130</Text>
                        </View>
                        <Text style={styles.cafeName}>{this.props.item.title}</Text>
                        <View style={styles.cafeDescription}>
                            <Text style={styles.cafeLocal}>[{this.props.item.address1}]</Text>
                            <Text style={styles.cafeLocalDetail}>{this.props.item.address2}</Text>
                            {pinIcon}
                            <Text style={styles.cafeDistance}>10km</Text>
                        </View>

                        <Text style={styles.cafeConcept}>{concept}</Text>
                    </View>
                </View>

        );
    }
}


const styles = StyleSheet.create({
    icon: {
        width : 26,
        height: 26,
    },
    filterContainer:{
        width           : SCREEN_WIDTH,
        height          : 35,
        flexDirection   :'row',
        backgroundColor :'#FFFDFF'
    },
    filterButton:{
        flex          :1,
        alignItems    :'center',
        justifyContent:'center',
        flexDirection :'row'
    },
    filterText:{
        textAlign  :'center',
        fontWeight :'bold',
        color      :themeColor
    },
    naviTitle:{
        flex       : 1,
        fontFamily : 'BMJUA',
        fontSize   : 20,
        color      :'white',
        textAlign  :'center'
    },
    cafeConcept:{
        fontSize    : 13,
        color       : themeColor,
        paddingLeft : 10,
        height      : 30,
        paddingTop  : 8
    },
    cafeName:{
        color       : '#212121',
        fontSize    : 18,
        fontWeight  : 'bold',
        paddingLeft : 10,
        height      : 25
    },
    divider:{
        width          : SCREEN_WIDTH,
        height         : 10,
        backgroundColor:'#f5f5f5',

    },
    cafeDescription:{
        flex          : 1,
        flexDirection :'row',
        alignItems    :'center',
        paddingBottom : 15
    },
    cafeLocal:{
        fontSize    : 14,
        color       : '#5D5D5D',
        paddingLeft : 10
    },
    cafeLocalDetail:{
        fontSize    : 13,
        color       : '#5D5D5D',
        paddingLeft : 6,
        flex        : 1
    },
    cafeDistance:{
        marginRight : 5,
        fontSize    : 12
    },
    linkCount:{
        color       : 'black',
        marginLeft  : 3,
        marginRight : 5,
        fontSize    : 11
    },
    favoriteCount:{
        color       : 'black',
        marginLeft  : 3,
        marginRight : 5,
        fontSize    : 11
    },
    searchBar:{
        flexDirection  : 'row',
        width          : SCREEN_WIDTH,
        height         : 30,
        backgroundColor: themeColor,
        alignItems     : 'center'
    },
    renderRowView : {flex:1,flexDirection:'row',height:120   },
    countView : {flexDirection:'row',justifyContent:'flex-end',alignItems:'center',height:25}

});


export default  RenderRow

