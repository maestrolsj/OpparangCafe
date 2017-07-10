import  React, {Component} from 'react';
import {
    Text,
    View,
    Image,
} from 'react-native';



import firebase from 'react-native-firebase';

// Initialize Firebase
const firebaseConfig = {
    apiKey       : "AIzaSyDkiA-JusaERFmPLwA6oa8kQurOlDCT4ns",
    authDomain   : "opparangcafe.firebaseio.com",
    databaseURL  : "https://opparangcafe.firebaseio.com/",
    storageBucket: "",
};

var quickWordList=[];

const firebaseApp = firebase.initializeApp(firebaseConfig);

var getCafeList = function (limit) {

    return new Promise(
        function (resolve, reject) {

             var itemsRef = firebaseApp.database().ref('CafeList').orderByChild('favorite').limitToFirst(limit);
         //   var itemsRef = firebaseApp.database().ref('CafeList').orderByChild('address1').equalTo('김포');
           var result=[];

            itemsRef.once('value', (snap) => {

                snap.forEach((child) => {
                    result.push(child.val());

                });
                resolve(result);

            });
        }
    )
}


var getLocalCafe = function (local) {

    return new Promise(
        function (resolve, reject) {

            var result = [];

            console.log("###### >>> Filered >> " + local);
            var itemsRef = firebaseApp.database().ref('CafeList').orderByChild('address1').equalTo(local);

            itemsRef.once('value', (snap) => {

                snap.forEach((child) => {
                    result.push(child.val());
                    resolve(result);
                });
            });
        }
    )
}

var getOneCafe = function (searchWord) {

    return new Promise(
        function (resolve, reject) {

            var itemsRef = firebaseApp.database().ref('CafeList').child(searchWord);

            itemsRef.once('value', (snap) => {

                resolve(snap._value);

            });
        }
    )
}

var getQuickWord = function (local) {


    return new Promise(
        function (resolve, reject) {

            var itemsRef = firebaseApp.database().ref('QuickWord');


            itemsRef.once('value', (snap) => {

                snap.forEach((child) => {
                    quickWordList.push(child.val());

                });
                resolve(quickWordList);

            });
        }
    )
}

var getQuickWordList = function () {

    return quickWordList;
}



var setCafeList = function () {

    return new Promise(
        function (resolve, reject) {

            var itemsRef = firebaseApp.database().ref('CafeList');

            for(var i=0 ; i<100;i++)
            itemsRef.push({key:"카페이름"+i,
                link:i+500,
                favorite:i+1000,
                title:"카페이름"+i,
                tel:"02-2344-3244",
                address1:"인천",
                address2:"강남구 대치동",
                address3:"월곶리 13-2",
                concept:["루프탑","오션뷰"],
                mainImage:'http://main.png',
                imageUrl:['http://test1.jpg','http://test2.jpg','http://test3.jpg']});


        }
    )
}

exports.getCafeList      = getCafeList;
exports.setCafeList      = setCafeList;
exports.getOneCafe       = getOneCafe;
exports.getQuickWord     = getQuickWord;
exports.getQuickWordList = getQuickWordList;
exports.getLocalCafe     = getLocalCafe;
export default firebaseApp;
