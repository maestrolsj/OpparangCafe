import React, { Component } from 'react';
import {
    FlatList,
    Text,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Clipboard
} from 'react-native';

import Ionicons      from 'react-native-vector-icons/Ionicons';
import ImageSlider   from 'react-native-image-slider';

var FirebaseHndler = require('./FirebaseHndler');


const SCREEN_WIDTH = Dimensions.get('window').width;
var   themeColor   = '#cf3273';

class Tab1Detail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cafeInfo: "",
        };
    }

    render() {

        var address = this.props.item.address1 + ' ' + this.props.item.address2 + ' ' + this.props.item.address3;

        return (
            <View style={{flex:1,backgroundColor:'#f5f5f5'}}>
                <ImageSlider images={[
                    'https://image-proxy.namuwikiusercontent.com/r/http%3A%2F%2Follehsquare.kt.com%2Flayout%2Follehsquare%2Fimages%2Fslider%2Fcafe01.jpg',
                    'http://scontent.cdninstagram.com/t51.2885-15/s480x480/e35/15877587_1063006267156061_1006074446747795456_n.jpg?ig_cache_key=MTQzNTM3NDk4NzYzNjM4OTQzNg%3D%3D.2',
                    'http://secretbangkok.com/wp-content/uploads/2015/09/%EB%8D%B1%EC%8A%A4%ED%84%B0_-1.jpg'
                ]}  height={250} />
                <View style={{marginTop:20, backgroundColor:'white', shadowColor:'gray', width:SCREEN_WIDTH}}>
                    <Text style={styles.cafeConcept}>컨셉 : 오션뷰 / 루프탑</Text>
                </View>

                <Image   source={require('../img/map.png')} style={styles.mapView}  resizeMode="stretch" >
                    <Text style={{backgroundColor:'transparent', color:'black',fontSize:15, marginLeft:20}}>{address}</Text>
                </Image>

                <View style={{flexDirection:'row',backgroundColor:'#f5f5f5', marginTop:1,height:40}}>
                    <TouchableOpacity style={styles.addressView} onPress={()=>{ Clipboard.setString('Hello World');}}>
                        <Ionicons name="ios-copy-outline" size={18} color={themeColor}/><Text>  주소복사</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1,flexDirection:'row', backgroundColor:'white',  marginLeft:1,justifyContent:'center', alignItems:'center'}}>
                        <Ionicons name="ios-map-outline"  size={18} color={themeColor}/><Text>  지도보기</Text>
                    </TouchableOpacity>
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
    mapView:{
        width:SCREEN_WIDTH,
        height:90,
        marginTop:2,
        justifyContent:'center'
    },
    addressView:{
        flex:1,
        flexDirection:'row',
        backgroundColor:'white',
        marginRight:1,
        justifyContent:'center',
        alignItems:'center'
    },
    naviTitle:{
        flex       : 1,
        fontFamily : 'BMJUA',
        fontSize   : 20,
        color      : themeColor,
        textAlign  :'center'
    },
    cafeConcept:{
        fontSize   : 13,
        color      : themeColor,
        paddingLeft: 10,
        height     : 30,
        paddingTop : 8,
        //fontWeight : 'bold'
    }
});

export default Tab1Detail;