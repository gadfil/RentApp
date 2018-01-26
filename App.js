/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    WebView,
    View,
    Button,
    NetInfo,
    Linking,
    Platform,
    StatusBar,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import Orientation from 'react-native-orientation';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import CookieManager from 'react-native-cookies';

const LOGIN_URL = "https://my.serverscheck.com/";
const HOME_URL = "https://my.serverscheck.com/home.php";

const dimen = Dimensions.get('window');
const isIphoneX = () => Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 || dimen.width === 812)
const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: 'rgb(254, 143, 29)'
    },

    instructions: {
        textAlign: 'center',
        fontSize: 17,
        color: 'rgb(254, 143, 29)',
        marginBottom: 5,
        marginTop:dimen.height*0.3
    },
    btnClickContain: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        alignSelf: 'stretch',
        backgroundColor: 'rgb(254, 143, 29)',
        // borderRadius: 5,
        // padding: 5,
        // marginTop: 5,
        // marginBottom: 5,
    },
    btnContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        // borderRadius: 2,
    },
    btnIcon: {
        height: 25,
        width: 25,
    },
});

export default class App extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: true,
            canGoBack: false,
            canGoForward: false,
            loggedIn: false,
            loadedCookie: false,
        }

    }

    componentDidMount() {
        NetInfo.isConnected.fetch().done(isConnected => this.setState({isConnected}))
        // this.checkNewVersion()
        Orientation.addOrientationListener(this._orientationDidChange);

        CookieManager.get(HOME_URL).then((res) => {
            let isAuthenticated;
            if (res && res.hasOwnProperty('__cfduid')) {
                isAuthenticated = true;
                let coocies = ''
                for(let key in res){
                    coocies+=`${key}=${res[key]}; `
                }
                this.setState({
                    cookie: coocies
                })
                console.log('coocies', coocies)
            }
            else {
                isAuthenticated = false;
            }
            console.log('CookieManager.get =>', res); // => 'user_session=abcdefg; path=/;'
            this.setState({
                loggedIn: isAuthenticated,
                loadedCookie: true
            });
        });
    }

    _orientationDidChange = (orientation) => {
        this._bridge.forceUpdate()
        if (orientation === 'LANDSCAPE') {
            // do something with landscape layout
        } else {
            // do something with portrait layout
        }
    }


    reload() {
        this._bridge.reload()
    }

    renderError() {
        return (
            <View style={{flex: 1, backgroundColor: '#ffff'}}>

                <Text style={styles.instructions}>
                    Check your connection and try again
                </Text>
                <Button title="RETRY" onPress={() => this.reload()}/>
            </View>
        )
    }

    _onNavigationStateChange(navState) {
        console.log('navState',navState, this._bridge)
        if (navState.url == HOME_URL) {
            this.setState({
                loggedIn: true,
            });
        }
        this.setState({
            canGoBack: navState.canGoBack,
            canGoForward: navState.canGoForward,
        });
    }
    render() {

        console.log('isConnected', this.state.isConnected)
        // marginTop: Platform.OS == 'ios' ? 20 : 0        if (!this.state.isConnected) {

        // if (!this.state.isConnected) {
        //     this.renderError()
        // }
        // let source = this.state.cookie?{}
        return (
            <View style={{
                flex: 1, backgroundColor: 'rgb(254, 143, 29)'
            }}>
                <StatusBar
                    barStyle="light-content"
                />
                <WebView
                    mixedContentMode='always'
                    source={{
                        uri: 'https://my.serverscheck.com/home.php',
                        // headers:{cookie: "AWSELB=9173D589162CFBC8D07BAF076CEBC9CD2D733A268C106E3B0E721C49F871540A553A308563DE1EAB0482C0811F6A43AB65178957BFA0C17382744682476B76AE86542310C0; PHPSESSID=7mjve4nvvhie3vjvrm0pt0lolb; __cfduid=da9d4b497ca537bdb86504db2f8e593e81516987633"}
                        headers:{cookie: ".2.1566498311.1516885310; _gid=GA1.2.826278415.1516885310; PHPSESSID=rk9qde7j55d1acf1s2i7mmu40t; AWSELB=9173D589162CFBC8D07BAF076CEBC9CD2D733A268C106E3B0E721C49F871540A553A308563DE1EAB0482C0811F6A43AB65178957BFA0C17382744682476B76AE86542310C0"}
                    }}
                    ref={(b) => this._bridge = b}
                    style={{flex: 1, marginTop: 45}}
                    onError={() => NetInfo.isConnected.fetch().done(isConnected => this.setState({isConnected}))}
                    renderError={() => this.renderError()}
                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                />
                <View style={{height:70, backgroundColor:'rgb(254, 143, 29)', flexDirection:'row'}}>
                    <TouchableOpacity
                        onPress={()=> this._bridge.goBack()}
                        style={styles.btnClickContain}
                        disabled ={!this.state.canGoBack}
                    >
                        <View
                            style={styles.btnContainer}>
                            <Icon
                                name="angle-left"
                                size={30}
                                color={!this.state.canGoBack?"#ffffff":"#0000ff"}
                                style={styles.btnIcon}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=> this._bridge.startInLoadingState}
                        style={styles.btnClickContain}
                        // disabled ={!this.state.canGoHome}
                    >
                        <View
                            style={styles.btnContainer}>
                            <Icon
                                name="home"
                                size={30}
                                color={!this.state.canGoBack?"#ffffff":"#0000ff"}
                                style={styles.btnIcon}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=> this._bridge.goForward()}
                        style={styles.btnClickContain}
                        disabled ={!this.state.canGoForward}
                    >
                        <View
                            style={styles.btnContainer}>
                            <Icon
                                name="angle-right"
                                size={30}
                                color={!this.state.canGoForward?"#ffffff":"#0000ff"}
                                style={styles.btnIcon}/>
                        </View>
                    </TouchableOpacity>

                    {/*<Button  disabled ={!this.state.canGoBack} title="Back" onPress={()=> this._bridge.goBack()}/>*/}
                    {/*<Button disabled ={!this.state.canGoForward} title="Forward"  onPress={()=> this._bridge.goForward()}/>*/}
                </View>
            </View>
        );
    }


}
