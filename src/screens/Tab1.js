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
    TextInput,
    TouchableHighlight
} from 'react-native';

import {connect}          from 'react-redux';
import * as LoginAction   from '../actions/LoginAction';
import Ionicons           from 'react-native-vector-icons/Ionicons';
import LocalFilterModal   from 'react-native-modalbox';
import ConceptFilterModal from 'react-native-modalbox';
import SortFileterModal   from 'react-native-modalbox';
import RenderRow          from './RenderRow';
import Tab1Detail         from './Tab1Detail';


var FirebaseHndler = require('./FirebaseHndler');


const SCREEN_WIDTH  = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

var limit      = 10;
var themeColor ='#cf3273';


class Tab1 extends Component {


    constructor(props) {
        super(props);

        //---------------- Binding to Custom Func ----------------
        this.gotoDetail     = this.gotoDetail.bind(this)    ;
        this.onEndReached   = this.onEndReached.bind(this)  ;
        this.renderRow      = this.renderRow.bind(this)     ;
        this.renderWordRow  = this.renderWordRow.bind(this) ;


        this.state = {
            data          : [],
            wordData      : [],
            wordListHeight: 0,
            modalVisible  : false,
            searchViewFlag: false,
            isOpen        : false,
            isDisabled    : false,
            //---- Local Filter
            TotalLocalYN  : true,  // 전체선택
            GangHwaYN     : false, // 강화
            IncheonYN     : false,
            SongdoYN      : false,
            //
            //가평
            //춘천
            //천안
            //평택
            //태안
            //서산
            //당진
            //아산
            //

            //---- Concept Filter
            TotalConceptYN  : true,  // 전체선택
            BookYN          : false, // 북카페
            OceanYN         : false, // 오션카페
            GardenYN        : false, // 가든보유
            KtraditionalYN  : false, // 한옥풍
            EroupeYN        : false, // 유럽풍
            GalleryYN       : false, // 갤러리
            DesertYN        : false, // 디저트
            BrunchYN        : false, // 브런치
            ForestYN        : false, // 숲속
            NightViewYN     : false, // 야경뷰
            ArtificialYN    : false, // 공예카페
            FlowerYN        : false, // 플라워
            StreetYN        : false, // 카페거리
            RoofTopYN       : false, // 루프탑
            DinningYN       : false, // 다이닝카페
        }
    }


    componentDidMount(){

        //FirebaseHndler.setCafeList();
        var that = this;
        FirebaseHndler.getCafeList(limit).then(function (items) {
            that.setState({data: [ ...items ]});
        }, function(err){ console.log(err) });
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
            <TouchableHighlight underlayColor='#F6F6F6' onPress={()=> this.setState({wordListHeight:0,wordData:[] ,text:item.item.name})} key={item.item.key} style={styles.searchWordrow}>
                <View style={{flexDirection:'row',height:40, alignItems:'center'}}>
                    <Text style={{marginLeft:10,color:'black'}}>{item.item.title}</Text>
                    <Text style={{marginLeft:15,color:'gray',fontSize:12}}>{item.item.address1}</Text>
                    <Text style={{marginLeft:5,color:'gray',fontSize:12}}>{item.item.address2}</Text>
                </View>
            </TouchableHighlight>
        );
    }


    render() {


        return (

            <View style={{flex: 1, backgroundColor:'#f5f5f5'}}>

                {!this.state.searchViewFlag&&<View style={styles.searchBar}>
                    <View style={{flex:1}}></View>
                    <Text style={styles.naviTitle}>오빠랑까페</Text>
                    <TouchableOpacity onPress={()=>{this.setState({searchViewFlag:true,wordListHeight:SCREEN_HEIGHT-80})}} style={{flex:1,alignItems:'flex-end'}}><Ionicons name="md-search" color="#FFFFFF" size={23} style={{marginRight:20}} /></TouchableOpacity>
               </View>}
                {this.state.searchViewFlag&&<View style={styles.textView}>

                    <Ionicons name="md-search" color="#FFFFFF" size={23} style={{flex:1,textAlign:'center'}} />
                    <TextInput
                        style={{width:250, height: 40, color:'white'}}
                        onChangeText={
                            (text) => {
                                let wordArr=[];

                                this.setState({text});
                                this.state.data.map(
                                    function(x){
                                       if(x.title.includes(text) || x.address1.includes(text) || x.address2.includes(text))
                                           wordArr.push(x);
                                    });
                                if(text.length > 0)  this.setState({wordData:wordArr});
                                else this.setState({wordData:[]});

                            }
                        }
                        value               = {this.state.text}
                        placeholder         = "카페 혹은 지명을 입력하세요"
                        placeholderTextColor= {'white'}
                        selectionColor      = {'white'}
                    />


                    <TouchableOpacity onPress={()=>{this.setState({searchViewFlag:false, wordListHeight:0,text:'' ,wordData:[]})}}  style={{flex:1,alignItems:'flex-end'}}><Ionicons name="md-close-circle" color="#FFFFFF" size={23} style={{marginRight:20}}/></TouchableOpacity>

                </View>}

               <View style={styles.filterContainer}>
                    <TouchableOpacity onPress={() => this.refs.localFilterModal.open()} style={styles.filterButton}>
                        <Text style={{color:'#000000'}}>지역 : </Text><Text style={styles.filterText}>전체</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.refs.conceptFilterModal.open()}  style={[styles.filterButton,{borderLeftWidth:4, borderRightWidth:4, borderColor:'#f5f5f5'}]}>
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
                        style                 = {{margin:10,marginBottom:80}}
                    />
                   <LocalFilterModal
                       style         = {{alignItems: 'center' }}
                       ref           = {"localFilterModal"}
                       swipeToClose  = {true}
                       onClosed      = {this.onClose}
                       onOpened      = {this.onOpen}
                       onClosingState= {this.onClosingState}>
                       <View><Text>지역선택</Text></View>
                       <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({TotalLocalYN: !this.state.TotalLocalYN, TotalLocalYN:true, IncheonYN:false, GangHwaYN:false})  }}  >
                           <Ionicons name="md-checkbox"  size={18}   color={this.state.TotalLocalYN?themeColor:'gray'} /><Text style={{marginLeft:15}}>전체</Text>
                       </TouchableOpacity>
                       <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({IncheonYN: !this.state.IncheonYN, TotalLocalYN:false})  }}  >
                           <Ionicons name="md-checkbox"  size={18}   color={this.state.IncheonYN?themeColor:'gray'} /><Text style={{marginLeft:15}}>인천</Text>
                       </TouchableOpacity>
                       <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({GangHwaYN: !this.state.GangHwaYN, TotalLocalYN:false})  }}  >
                           <Ionicons name="md-checkbox"  size={18}   color={this.state.GangHwaYN?themeColor:'gray'} /><Text style={{marginLeft:15}}>강화</Text>
                       </TouchableOpacity>

                       <TouchableOpacity onPress={() => this.refs.localFilterModal.close()}><Text>close</Text></TouchableOpacity>
                   </LocalFilterModal>

                   <ConceptFilterModal
                       style         = {{alignItems: 'center' }}
                       ref           = {"conceptFilterModal"}
                       swipeToClose  = {true}
                       onClosed      = {this.onClose}
                       onOpened      = {this.onOpen}
                       onClosingState= {this.onClosingState}>
                       <View><Text>지역선택</Text></View>
                       <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({TotalConceptYN: !this.state.TotalConceptYN, TotalConceptYN:true, BookYN:false, OceanYN:false})  }}  >
                           <Ionicons name="md-checkbox"  size={18}   color={this.state.TotalConceptYN?themeColor:'gray'} /><Text style={{marginLeft:15}}>전체</Text>
                       </TouchableOpacity>
                       <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({BookYN: !this.state.BookYN, TotalConceptYN:false})  }}  >
                           <Ionicons name="md-checkbox"  size={18}   color={this.state.BookYN?themeColor:'gray'} /><Text style={{marginLeft:15}}>북카페</Text>
                       </TouchableOpacity>
                       <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({OceanYN: !this.state.OceanYN, TotalConceptYN:false})  }}  >
                           <Ionicons name="md-checkbox"  size={18}   color={this.state.OceanYN?themeColor:'gray'} /><Text style={{marginLeft:15}}>오션뷰</Text>
                       </TouchableOpacity>

                       <TouchableOpacity onPress={() => this.refs.conceptFilterModal.close()}><Text>close</Text></TouchableOpacity>
                   </ConceptFilterModal>
               </View>
                <TouchableOpacity
                    onPress={() => {  this.setState({wordListHeight:0})  }}
                    style={{position:'absolute',top:40  ,width:SCREEN_WIDTH,height:this.state.wordListHeight, backgroundColor:'rgba(0,0,0,0.3)'}}>
                    <FlatList
                        data                  = {this.state.wordData}
                        initialNumToRender    = {20}
                        onEndReachedThreshold = {3}
                        renderItem            = {this.renderWordRow}
                        style                 = {{}}
                    />
                </TouchableOpacity>


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
    localFilterItem:{flexDirection:'row',height:40,width:200,alignItems:'center' },
    renderRowView : {flex:1,flexDirection:'row',height:120   },
    countView     : {flexDirection:'row',justifyContent:'flex-end',alignItems:'center',height:25},
    textView      : {width:SCREEN_WIDTH,height:40, flexDirection:'row',backgroundColor:themeColor,alignItems:'center'},
    searchWordrow : {width:SCREEN_WIDTH,backgroundColor:'white', borderBottomWidth:0.1, borderBottomColor:'#FCFCFC'}

});

const mapStateToProps = (state) => ({
    isLogin: state.LoginReducer.isLogin,  // getter
});

const mapDispatchToProps = {
    _setLogin: LoginAction.setLoginValue,  // setter
};

export default connect(mapStateToProps, mapDispatchToProps)(Tab1)


