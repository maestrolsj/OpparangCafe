import { Navigation } from 'react-native-navigation';
import LoadingScreen     from './LoadingScreen';
import Tab1     from './Tab1';
import Tab2     from './Tab2';
import Tab1Detail from './Tab1Detail';


// FOR REDUX --------------------------------
import configureStore from '../store/configureStore'
import { Provider } from 'react-redux'
const Store = configureStore();
//---------------------------------------------

// register all screens of the app (including internal ones)
export function registerScreens() {

    Navigation.registerComponent('LoadingScreen', () => LoadingScreen,Store,Provider); // 네비게이터에 로딩 화면 등록
    Navigation.registerComponent('Tab1', () => Tab1,Store,Provider);
    Navigation.registerComponent('Tab2', () => Tab2);
    Navigation.registerComponent('Tab1Detail', () => Tab1Detail);
}