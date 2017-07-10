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
    TextInput, Keyboard,
    TouchableHighlight,
    Platform
} from 'react-native';

import {connect}          from 'react-redux';
import * as LoginAction   from '../actions/LoginAction';
import Ionicons           from 'react-native-vector-icons/Ionicons';
import LocalFilterModal   from 'react-native-modalbox';
import SortFileterModal   from 'react-native-modalbox';
import RenderRow          from './RenderRow';
import Tab1Detail         from './Tab1Detail';


var FirebaseHndler = require('./FirebaseHndler');


const SCREEN_WIDTH  = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
var CAFELIST_HEIGHT;

var limit      = 10;
var themeColor ='#cf3273';

var wordSearchYN = false;

var quickWordList =[];
var localArr      =[];

class Tab1 extends Component {


    constructor(props) {
        super(props);

        if (Platform.OS === 'ios') CAFELIST_HEIGHT = SCREEN_HEIGHT -145;
        else                       CAFELIST_HEIGHT = SCREEN_HEIGHT -160;

        //---------------- Binding to Custom Func ----------------
        this.gotoDetail     = this.gotoDetail.bind(this)    ;
        this.onEndReached   = this.onEndReached.bind(this)  ;
        this.renderRow      = this.renderRow.bind(this)     ;
        this.renderWordRow  = this.renderWordRow.bind(this) ;
        this.wordClick      = this.wordClick.bind(this)     ;
        this.onClose        = this.onClose.bind(this)       ;

        this.state = {
            data          : [],
            wordData      : [],
            wordListHeight: 0,
            modalVisible  : false,
            searchViewFlag: false,
            isOpen        : false,
            isDisabled    : false,
            filterText    : '전체',
            //---- Local Filter
            TotalLocalYN  : true , // 전체선택
            GangHwaYN     : false, // 강화
            IncheonYN     : false, // 인천(월미도, 송도 등)
            PajuYN        : false, // 부산
            JongroYN      : false, // 종로(서/북, 삼청, 부암)
            BusanYN       : false, // 부산
            GimpoYN       : false, // 김포
            HanamYN       : false, // 하남
            NamYangYN     : false, // 남양주, 양평
            YongInYN      : false, // 용인
            GapyungYN     : false, // 가평
            ChunCheonYN   : false, // 춘천

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

            /* Concept Filter
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
            DinningYN       : false, // 다이닝카페*/
        }
    }


    componentDidMount(){

        console.log("=============+#######  componentDidMount  ######+===============");
        //FirebaseHndler.setCafeList();

       quickWordList = FirebaseHndler.getQuickWordList();
       console.log(quickWordList);
       this.getCafeList();
    }

    getCafeList(){

        var that = this;
        FirebaseHndler.getCafeList(limit).then(function (items) {
            that.setState({data: [ ...items ]});
        }, function(err){ console.log(err) });

    }
    setLocalFilter(){//필터 설정 적용 시

        localArr=[];
        console.log(this.state.TotalLocalYN)

        if(this.state.GangHwaYN)   localArr.push("강화");
        if(this.state.IncheonYN)   localArr.push("인천");
        if(this.state.GimpoYN)     localArr.push("김포");
        if(this.state.HanamYN)     localArr.push("하남");
        if(this.state.BusanYN)     localArr.push("부산");
        if(this.state.PajuYN)      localArr.push("파주");
        if(this.state.JongroYN)    localArr.push("종로");
        if(this.state.NamYangYN)   localArr.push("남양주양평");
        if(this.state.YongInYN)    localArr.push("용인");
        if(this.state.GapyungYN)   localArr.push("가평");
        if(this.state.ChunCheonYN) localArr.push("춘천");

        this.refs.localFilterModal.close();

    }

    onClose(){

        if(this.state.TotalLocalYN){

            console.log("==== TOTAL SEARCH ====");
            this.setState({filterText:'전체'});
            this.getCafeList();
        }
        else {
            this.setState({filterText:'필터중'});
            var that = this;
            var temp = [];
            wordSearchYN = true;
            for (var i = 0; i < localArr.length; i++) {

                FirebaseHndler.getLocalCafe(localArr[i]).then(function (items) {

                    for (var j = 0; j < items.length; j++) temp.push(items[j]);

                    that.setState({data: temp});
                }, function (err) {
                    console.log(err)
                });
            }
        }
    }


    onEndReached(){

        if(wordSearchYN == false) {
            console.log("=============+#######  onEndReached  ######+===============");
            var that = this;

            limit = limit + 10;
            FirebaseHndler.getCafeList(limit).then(function (items) {
                that.setState({data: [...items]});
            }, function (err) {
                console.log(err)
            });
        }
        else limit = 10;
    };

    gotoDetail(item){
        this.props.navigator.push({
            screen           : 'Tab1Detail', // unique ID registered with Navigation.registerScreen
            title            : item.title,   // navigation bar title of the pushed screen (optional)
            passProps        : {item},       // Object that will be passed as props to the pushed screen (optional)
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

    wordClick(item) {

        var that     = this;
        wordSearchYN = true;
        Keyboard.dismiss();
           this.setState({wordListHeight: 0, wordData: [], text: item.item.title});

            FirebaseHndler.getOneCafe(item.item.title).then(function (items) {

                that.setState({data: [ items ]});
            }, function(err){ console.log(err) });

    }

    renderWordRow(item){

        console.log(item.item);
        return(
            <TouchableHighlight underlayColor='#F6F6F6' onPress={()=>{this.wordClick(item)}}  key={item.item.key} style={styles.searchWordrow}>
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

                {!this.state.searchViewFlag &&<View style={styles.searchBar}>
                    <View style={{flex:1}}></View>
                    <Text style={styles.naviTitle}>오빠랑까페</Text>
                    <TouchableOpacity onPress={()=>{this.setState({searchViewFlag:true,wordListHeight:SCREEN_HEIGHT-80})}} style={{flex:1,alignItems:'flex-end'}}>
                        <Ionicons name="md-search" color="#FFFFFF" size={23} style={{marginRight:20}} />
                    </TouchableOpacity>
                    </View>
                }
                {this.state.searchViewFlag&&<View style={styles.textView}>

                    <Ionicons name="md-search" color="#FFFFFF" size={23} style={{flex:1,textAlign:'center'}} />
                    <TextInput
                        style={{width:250, height: 40, color:'white'}}
                        onChangeText={
                            (text) => {
                                let wordArr=[];

                                this.setState({text});
                                quickWordList.map(
                                    function(x){
                                       if(x.title.includes(text) || x.address1.includes(text) || x.address2.includes(text))    wordArr.push(x);
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

                    <TouchableOpacity onPress={()=>{
                        wordSearchYN=false;
                        this.setState({searchViewFlag:false, wordListHeight:0,text:'' ,wordData:[]});
                        this.getCafeList();
                        }
                    }
                        style={{flex:1,alignItems:'flex-end'}}><Ionicons name="md-close-circle" color="#FFFFFF" size={23} style={{marginRight:20}}/>
                    </TouchableOpacity>

                </View>}

               <View style={styles.filterContainer}>
                    <TouchableOpacity onPress={() => this.refs.localFilterModal.open()} style={styles.filterButton}>
                        <Text style={{color:'#000000'}}>지역 : </Text><Text style={styles.filterText}>{this.state.filterText}</Text>
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
                        shouldItemUpdate      = {(props,nextProps)=>  {
                            console.log("### props >> " + props.item);
                            console.log("### next props >> " + nextProps.item);
                            return props.item!==nextProps.item } }
                        style                 = {{margin:10,marginBottom:80, height: CAFELIST_HEIGHT}}
                    />
                   <LocalFilterModal
                       style         = {{alignItems: 'center' }}
                       ref           = {"localFilterModal"}
                       swipeToClose  = {false}
                       onClosed      = {this.onClose}
                       onOpened      = {this.onOpen}
                       onClosingState= {this.onClosingState}>
                       <View><Text>지역을 선택하세요</Text></View>
                       <View style={{flex:1,  justifyContent:'center',alignItems:'center', paddingLeft:10, paddingRight:10}}>

                           <View style={styles.localRow}>
                               <TouchableOpacity style={styles.localFilterItem}
                                                 onPress={() => {
                                                     this.setState({TotalLocalYN: !this.state.TotalLocalYN,
                                                                   IncheonYN    : false,  GangHwaYN : false, GimpoYN:false, PajuYN:false, JongroYN:false, HanamYN:false, NamYangYN:false, YongInYN:false, BusanYN : false,
                                                                   ChunCheonYN  : false,  GapyungYN : false  }) }}  >
                                   <Ionicons name="md-checkbox"  size={18}   color={this.state.TotalLocalYN?themeColor:'gray'}  style={{marginLeft:15}} /><Text style={{marginLeft:10}}>전체선택</Text>
                               </TouchableOpacity>
                           </View>

                           <View style={styles.localRow}>
                               <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({IncheonYN: !this.state.IncheonYN, TotalLocalYN:false}) }}  >
                                   <Ionicons name="md-checkbox"  size={18}   color={this.state.IncheonYN?themeColor:'gray'}  style={{marginLeft:15}}  /><Text style={{marginLeft:10}}>인천 (송도,월미도 등)</Text>
                               </TouchableOpacity>
                               <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({GangHwaYN: !this.state.GangHwaYN, TotalLocalYN:false}) }}  >
                                   <Ionicons name="md-checkbox"  size={18}   color={this.state.GangHwaYN?themeColor:'gray'} style={{marginLeft:15}}/><Text style={{marginLeft:10}}>강화</Text>
                               </TouchableOpacity>
                           </View>
                           <View style={styles.localRow}>
                               <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({GimpoYN: !this.state.GimpoYN, TotalLocalYN:false})  }}  >
                                   <Ionicons name="md-checkbox"  size={18}   color={this.state.GimpoYN?themeColor:'gray'} style={{marginLeft:15}}/><Text style={{marginLeft:10}}>김포</Text>
                               </TouchableOpacity>
                               <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({PajuYN: !this.state.PajuYN, TotalLocalYN:false})   }}  >
                                   <Ionicons name="md-checkbox"  size={18}   color={this.state.PajuYN?themeColor:'gray'} style={{marginLeft:15}} /><Text style={{marginLeft:10}}>파주</Text>
                               </TouchableOpacity>
                           </View>
                           <View style={styles.localRow}>
                               <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({JongroYN: !this.state.JongroYN, TotalLocalYN:false})  }}  >
                                   <Ionicons name="md-checkbox"  size={18}   color={this.state.JongroYN?themeColor:'gray'} style={{marginLeft:15}}/><Text style={{marginLeft:10}}>종로(서/북, 삼청, 부암)</Text>
                               </TouchableOpacity>
                               <View style={styles.localFilterItem}></View>

                           </View>
                           <View style={styles.localRow}>
                               <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({HanamYN: !this.state.HanamYN, TotalLocalYN:false})  }}  >
                                   <Ionicons name="md-checkbox"  size={18}   color={this.state.HanamYN?themeColor:'gray'} style={{marginLeft:15}} /><Text style={{marginLeft:10}}>하남</Text>
                               </TouchableOpacity>
                               <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({NamYangYN: !this.state.NamYangYN, TotalLocalYN:false})   }}  >
                                   <Ionicons name="md-checkbox"  size={18}   color={this.state.NamYangYN?themeColor:'gray'} style={{marginLeft:15}}/><Text style={{marginLeft:10}}>남양주, 양평</Text>
                               </TouchableOpacity>
                           </View>
                           <View style={styles.localRow}>
                               <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({IncheonYN: !this.state.IncheonYN, TotalLocalYN:false})  }}  >
                                   <Ionicons name="md-checkbox"  size={18}   color={this.state.IncheonYN?themeColor:'gray'} style={{marginLeft:15}}/><Text style={{marginLeft:10}}>인천 (송도,월미도 등)</Text>
                               </TouchableOpacity>
                               <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({GangHwaYN: !this.state.GangHwaYN, TotalLocalYN:false})   }}  >
                                   <Ionicons name="md-checkbox"  size={18}   color={this.state.GangHwaYN?themeColor:'gray'} style={{marginLeft:15}}/><Text style={{marginLeft:10}}>강화</Text>
                               </TouchableOpacity>
                           </View>
                           <View style={styles.localRow}>
                               <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({YongInYN: !this.state.YongInYN, TotalLocalYN:false})  }}  >
                                   <Ionicons name="md-checkbox"  size={18}   color={this.state.YongInYN?themeColor:'gray'} style={{marginLeft:15}}/><Text style={{marginLeft:10}}>용인</Text>
                               </TouchableOpacity>
                               <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({BusanYN: !this.state.BusanYN, TotalLocalYN:false})   }}  >
                                   <Ionicons name="md-checkbox"  size={18}   color={this.state.BusanYN?themeColor:'gray'} style={{marginLeft:15}}/><Text style={{marginLeft:10}}>부산</Text>
                               </TouchableOpacity>
                           </View>
                           <View style={styles.localRow}>
                               <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({ChunCheonYN: !this.state.ChunCheonYN, TotalLocalYN:false})  }}  >
                                   <Ionicons name="md-checkbox"  size={18}   color={this.state.ChunCheonYN?themeColor:'gray'} style={{marginLeft:15}}/><Text style={{marginLeft:10}}>춘천</Text>
                               </TouchableOpacity>
                               <TouchableOpacity style={styles.localFilterItem} onPress={() => {  this.setState({GapyungYN: !this.state.GapyungYN, TotalLocalYN:false})   }}  >
                                   <Ionicons name="md-checkbox"  size={18}   color={this.state.GapyungYN?themeColor:'gray'} style={{marginLeft:15}}/><Text style={{marginLeft:10}}>가평</Text>
                               </TouchableOpacity>
                           </View>

                           <View style={[styles.localRow,{marginBottom:100}]}>
                               <TouchableOpacity onPress={()=>this.setLocalFilter()} ><Text>설정적용</Text></TouchableOpacity>
                           </View>


                       </View>
                   </LocalFilterModal>


               </View>
                <TouchableOpacity
                    onPress={() => {  this.setState({wordListHeight:0})  }}
                    style={{position:'absolute',top:40  ,width:SCREEN_WIDTH,height:this.state.wordListHeight, backgroundColor:'rgba(0,0,0,0.3)'}}>
                    <FlatList
                        keyboardShouldPersistTaps = {'handled'}
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
    localFilterItem:{flexDirection:'row',flex:1,alignItems:'center',height:50,backgroundColor:'#F6F6F6',margin:1 },
    localRow      : {flexDirection:'row' ,flex:1, justifyContent:'center', alignItems:'center'},
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


