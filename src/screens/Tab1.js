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
    Button,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Image,
    Animated,
    TextInput
} from 'react-native';

import {connect}        from 'react-redux';
import * as LoginAction from '../actions/LoginAction';
import Ionicons         from 'react-native-vector-icons/Ionicons';
import LocalFilterModal from 'react-native-modalbox';
import RenderRow        from './RenderRow';
import Tab1Detail       from './Tab1Detail';


var FirebaseHndler = require('./FirebaseHndler');


const SCREEN_WIDTH = Dimensions.get('window').width;

var limit      = 10;
var themeColor ='#cf3273';


class Tab1 extends Component {


    constructor(props) {
        super(props);

        //---------------- Binding to Custom Func ----------------
        this.gotoDetail     = this.gotoDetail.bind(this)    ;
        this.onEndReached   = this.onEndReached.bind(this)  ;
        this.renderRow      = this.renderRow.bind(this)     ;


        this.state = {
            data: [],
            wordData:[],
            modalVisible: false,
            searchViewFlag:false,
            isOpen    : false,
            isDisabled: false,
            //---- Local Filter
            TotalLocalYN       : true,
            GangHwaYN          : false,
            IncheonYN          : false,
            SongdoYN           : false,

        }
    }


    componentDidMount(){

        //FirebaseHndler.setCafeList();
        var that = this;
        FirebaseHndler.getCafeList(limit).then(function (items) {
            that.setState({data: [ ...items ]});
        }, function(err){
            console.log(err)
        });

    }


    onEndReached(){

        var that = this;

        limit = limit+10;
        FirebaseHndler.getCafeList(limit).then(function (items) {
            that.setState({data: [ ...items ]});
        }, function(err){   console.log(err)     });

    };


    gotoDetail(item){
        this.props.navigator.push({
            screen           : 'Tab1Detail', // unique ID registered with Navigation.registerScreen
            title            : item.title,        // navigation bar title of the pushed screen (optional)
            passProps        : {item},           // Object that will be passed as props to the pushed screen (optional)
            animated         : true,         // does the push have transition animation or does it happen immediately (optional)
            backButtonTitle  : undefined,    // override the back button title (optional)
            backButtonHidden : false,        // hide the back button altogether (optional)
            navigatorButtons : {},           // override the nav buttons for the pushed screen (optional)
            navigatorStyle   : {
                navBarHidden : false,
            }
        });

    }



    renderRow(item){

        return (
            <View key={item.item.key} >
                <TouchableOpacity onPress={()=>this.gotoDetail(item.item)}>
                  <RenderRow item={item.item}/>
                </TouchableOpacity>
                <View style={styles.divider}></View>
            </View>
        );
    }

    renderWordRow(item){

        return(
            <View key={item.item.key} style={{width:SCREEN_WIDTH,height:30,backgroundColor:'white', borderWidth:0.2, borderColor:'#EAEAEA',justifyContent:'center'}}>
                <Text style={{marginLeft:10,color:'black'}}>{item.item.name}</Text>
            </View>
        );
    }


    render() {


        return (

            <View style={{flex: 1, backgroundColor:'#f5f5f5'}}>

                {!this.state.searchViewFlag&&<View style={styles.searchBar}>
                    <View style={{flex:1}}></View>
                    <Text style={styles.naviTitle}>오빠랑까페</Text>
                    <TouchableOpacity onPress={()=>{this.setState({searchViewFlag:true, wordData:[{key:'roy',name:'로이카페'},{key:'santorini',name:'산토리니'},{key:'beach',name:'비치카페'}]})}} style={{flex:1,alignItems:'flex-end'}}><Ionicons name="md-search" color="#FFFFFF" size={23} style={{marginRight:20}} /></TouchableOpacity>
               </View>}
                {this.state.searchViewFlag&&<View style={styles.textView}>

                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Ionicons name="md-search" color="#FFFFFF" size={23}  /></View>
                    <TextInput
                        style={{width:250, height: 35, color:'white' }}
                        onChangeText={(text) => this.setState({text})}
                        value={this.state.text}
                        placeholder="카페 혹은 지명을 입력하세요"
                        placeholderTextColor={'white'}
                        selectionColor={'white'}

                    />

                    <TouchableOpacity onPress={()=>{this.setState({searchViewFlag:false, wordData:[]})}}  style={{flex:1,alignItems:'flex-end'}}><Ionicons name="md-close-circle" color="#FFFFFF" size={23} style={{marginRight:20}}/></TouchableOpacity>

                </View>}

               <View style={styles.filterContainer}>
                    <TouchableOpacity onPress={() => this.refs.localFilterModal.open()} style={styles.filterButton}>
                        <Text style={{color:'#000000'}}>지역 : </Text><Text style={styles.filterText}>전체</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {  this.setState({conceptFilterModal: true})  }}  style={[styles.filterButton,{borderLeftWidth:4, borderRightWidth:4, borderColor:'#f5f5f5'}]}>
                        <Text style={{color:'#000000'}}>컨셉 : </Text><Text style={styles.filterText}>전체</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {  this.setState({sortFilterModal: true})  }}  style={styles.filterButton}>
                        <Text style={{color:'#000000'}}>정렬 : </Text><Text style={styles.filterText}>없음</Text>
                    </TouchableOpacity>
               </View>

               <View>
                    <FlatList
                        data                  = {this.state.data}
                        initialNumToRender    = {20}
                        onEndReachedThreshold = {3}
                        onEndReached          = {this.onEndReached}
                        renderItem            = {this.renderRow}
                        shouldItemUpdate      = {(props,nextProps)=>  { return props.item!==nextProps.item } }
                        style                 = {{margin:10}}
                    />
                   <LocalFilterModal
                       style         = {{ justifyContent: 'center',   alignItems: 'center'}}
                       ref           = {"localFilterModal"}
                       swipeToClose  = {true}
                       onClosed      = {this.onClose}
                       onOpened      = {this.onOpen}
                       onClosingState= {this.onClosingState}>
                       <View>
                           <Text>지역선택</Text>
                       </View>
                       <TouchableOpacity style={{flexDirection:'row',width:200,backgroundColor:'gold'}} onPress={() => {  this.setState({IncheonYN: !this.state.IncheonYN, TotalLocalYN:false})  }}  >
                           <Ionicons name="md-checkbox"  size={18}   color={this.state.IncheonYN?themeColor:'gray'} /><Text>Incheon</Text>
                       </TouchableOpacity>

                       <TouchableOpacity onPress={() => this.refs.localFilterModal.close()} ><Text>close</Text></TouchableOpacity>
                   </LocalFilterModal>
               </View>
                <FlatList
                    data                  = {this.state.wordData}
                    initialNumToRender    = {20}
                    onEndReachedThreshold = {3}
                    renderItem            = {this.renderWordRow}
                    style                 = {{position:'absolute',top:40 ,width:SCREEN_WIDTH, height:400}}
                />
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
        fontSize    : 15,
        color       : '#5D5D5D',
        paddingLeft : 10
    },
    cafeLocalDetail:{
        fontSize    : 13,
        color       : '#5D5D5D',
        paddingLeft : 10,
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
        height         : 40,
        backgroundColor: themeColor,
        alignItems     : 'center'
    },
    renderRowView : {flex:1,flexDirection:'row',height:120   },
    countView     : {flexDirection:'row',justifyContent:'flex-end',alignItems:'center',height:25},
    textView :{ width:SCREEN_WIDTH,height:40, flexDirection:'row',backgroundColor:themeColor,alignItems:'center'}


});

const mapStateToProps = (state) => ({
    isLogin: state.LoginReducer.isLogin,  // getter
});

const mapDispatchToProps = {
    _setLogin: LoginAction.setLoginValue,  // setter
};

export default connect(mapStateToProps, mapDispatchToProps)(Tab1)


