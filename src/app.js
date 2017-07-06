import {Navigation} from 'react-native-navigation';

// screen related book keeping
import {registerScreens} from './screens';

registerScreens();


Navigation.startSingleScreenApp({
    screen: {
        screen: 'LoadingScreen',
        title : 'LoadingTitle',
        navigatorStyle: {
            navBarHidden            : true,
            navBarBackgroundColor   : '#4dbce9',
            navBarTextColor         : '#ffff00',
            navBarSubtitleTextColor : '#ff0000',
            navBarButtonColor       : '#ffffff',
            statusBarTextColorScheme: 'light'
        }
    },
});
