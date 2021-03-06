
/**
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
    BackAndroid,
    ActivityIndicator,
    BackHandler,
    Platform,
    StatusBar,
    Dimensions,
    TouchableOpacity,
    Keyboard,
    AsyncStorage,
} from 'react-native';
// import Orientation from 'react-native-orientation';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import CookieManager from 'react-native-cookies';

const dimen = Dimensions.get('window');
const isIphoneX = () => Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 || dimen.width === 812)

const marginTop = ()=>Platform.OS ==='ios'?isIphoneX()?45:25:0

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: 'rgb(254, 143, 29)'
    },

    webView: {
        flex: 1,
        marginTop:marginTop()
    },
    instructions: {
        textAlign: 'center',
        fontSize: 17,
        color: 'rgb(254, 143, 29)',
        marginBottom: 5,
        marginTop: dimen.height * 0.3
    },
    btnClickContain: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        alignSelf: 'stretch',
        backgroundColor: 'rgb(254, 143, 29)',
    },
    btnContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    btnIcon: {
        height: 25,
        width: 25,
    },
});

export default class App extends Component<{}> {
    renderLoading = () => <ActivityIndicator size="large" style={{marginTop:dimen.height*0.5}}/>;
    renderLoadingWithData =()=><ActivityIndicator size="large" style={{height:dimen.height, marginTop:0.5}}/>

    constructor(props) {
        super(props);
        this.state = {
            isConnected: true,
            canGoBack: false,
            canGoForward: false,
            loggedIn: false,
            loadedCookie: false,
            canGoHome: false,
            marginTop: 45,
            login: null,
            password: null,
            showPreloader: false,
            url: ""
        }

        this._onNavigationStateChange = this._onNavigationStateChange.bind(this);
        this._onMessage = this._onMessage.bind(this);
        this._onLoDEnd = this._onLoDEnd.bind(this);
    }

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        BackHandler.removeEventListener('hardwareBackPress', this._backButton);
    }

    _backButton(){
        console.log('_back', this.state)
        if (this.state.canGoBack) {
            this._bridge.goBack()
            return true;
        }
        return false;
    }
    _keyboardDidShow () {
        this.setState({isKeyboardShow:true})
    }

    _keyboardDidHide () {
        this.setState({isKeyboardShow:false})
    }
    componentDidMount() {
        NetInfo.isConnected.fetch().done(isConnected => this.setState({isConnected}))
        // this.checkNewVersion()
        // Orientation.addOrientationListener(this._orientationDidChange);
        BackHandler.addEventListener('hardwareBackPress', this._backButton.bind(this));
        console.log('cookie', window.document, window.document?window.document.cookie:'');
        CookieManager.get('https://my.serverscheck.com')
            .then((res) => {
                console.log('CookieManager.get =>', res); // => 'user_session=abcdefg; path=/;'
            });
        // this._bridge.execute('alert("hello world")')
        setTimeout(()=>this.setState({login:null, password:null}), 5000)
        this._bridge.postMessage("r57ytyiuruytiurtyiu")
        console.log('bridge', this._bridge)
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

    _onNavigationStateChange=(navState)=> {
        // console.log('navState', navState, this._bridge)
        if (navState.url.search('https://my.serverscheck.com/home.php') === 0||navState.url.search('https://my.serverscheck.com/index.php') === 0 ) {
            this.setState({
                loggedIn: true,
                canGoHome: false

            });
        } else {
            this.setState({
                canGoHome: navState.canGoBack,
            });
        }
        if (navState.url.search('https://my.serverscheck.com/logout.php') === 0){
                console.log('logout')
            this._bridge.injectJavaScript("localStorage.clear();")
        }
        this.setState({
            url: navState.url,
            canGoBack: navState.canGoBack,
            canGoForward: navState.canGoForward,
        });
    };

    _onLoDEnd = (data)=>{
        if (this.state.url.search('https://my.serverscheck.com/home.php')===0){
            this.setState({showPreloader:false});
        }else if(this.state.url.search('https://my.serverscheck.com/login.php')===0||this.state.url==='https://my.serverscheck.com/'){
            console.log('onLoadEnd', data);
            this.setState({showPreloader:true});
        }
        console.log('onLoadEnd', this.state.showPreloader, this.state.url, this.state.url.search('https://my.serverscheck.com/login.php')===0&&this.state.login!==null&&this.state.password!==null);
    };

    _onMessage=(event)=> {
        //Prints out data that was passed.
        // let value = JSON.parse(event)
        let data =[];
        if (event.nativeEvent.data&&event.nativeEvent.data.length!==0&&event.nativeEvent.data!=="null,null"){
            data = event.nativeEvent.data.split(",");
            this.setState({login:data[0], password:data[1]});
        }else{
            this.setState({login:null, password:null, showPreloader:false})
        }

        console.log("onMessage",event.nativeEvent.data);
    };
    render() {
        let jsCode = `
        
        document.querySelectorAll("body > div > form > button")[0].addEventListener('click', function(event) {
            var login = document.getElementById("inputEmail").value;
            var password = document.getElementById("inputPassword").value;
           
            localStorage.setItem("login", login);
            localStorage.setItem("password", password);            
        });   
        let log = localStorage.getItem("login");
        let pass =  localStorage.getItem("password");
        setInterval(window.postMessage(log+","+pass),1000);
        
        if (
        window.location.href === "https://my.serverscheck.com/"
        && log!==undefined
        && log.length!==0
        && pass!==undefined
        && pass.length!==0
        ){
           document.getElementById("inputEmail").value=log;
           document.getElementById("inputPassword").value=pass;
           var login=document.getElementById("inputEmail").value;
           var password=document.getElementById("inputEmail").value;
           
           if (login.length!==0&&password.length!==0){
            document.querySelectorAll("body > div > form > button")[0].click();
           }                    
            
        }
        if (window.location.href.search("https://my.serverscheck.com/home.php")===0){
        alert("ghgg");
        }
        document.querySelectorAll("body > div > div.hidden-lg.hidden-md.hidden-sm.col-xs-12 > div > div > div > div > div.col-xs-10.text-left > a")[0].addEventListener('click', function(event) {
            var login = document.getElementById("inputEmail").value;
            var password = document.getElementById("inputPassword").value;
           alert("logout");
            // localStorage.setItem("login", login);
            // localStorage.setItem("password", password);            
        });   
    `;
        // const jsCode = "window.postMessage(document.cookie)";
        console.log('cookie', window&&window.document?window.document.cookie:'')
        // console.log('state', this.state)
        return (
            <View style={{
                flex: 1, backgroundColor: 'rgb(254, 143, 29)'
            }}>
                {this.state.showPreloader===true
                        ?
                            this.renderLoadingWithData()
                                :
                                null
                }
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="#c56000"
                />
                <WebView
                    mixedContentMode='always'
                    source={{
                        // uri: 'https://github.com/',
                        uri: 'https://my.serverscheck.com/',
                    }}
                    javaScriptEnabled={true}
                    ref={(b) => this._bridge = b}
                    style={styles.webView}//568 iPhone 5s 667 iPhone 6s
                    onError={() => NetInfo.isConnected.fetch().done(isConnected => this.setState({isConnected}))}
                    renderError={() => this.renderError()}
                    onNavigationStateChange={this._onNavigationStateChange}
                    onLoadEnd={this._onLoDEnd}
                    injectedJavaScript={jsCode}
                    onShouldStartLoadWithRequest={this.renderLoading}
                    onMessage={(data)=>this._onMessage(data)}
                    startInLoadingState={true}
                    renderLoading={this.renderLoading}


                />
                <View style={{height: this.state.isKeyboardShow?0:isIphoneX()?70:50, backgroundColor: 'rgb(254, 143, 29)', flexDirection: 'row'}}>
                    <TouchableOpacity
                        onPress={() => this._bridge.goBack()}
                        style={styles.btnClickContain}
                        disabled={!this.state.canGoBack}
                    >
                        <View
                            style={styles.btnContainer}>
                            <Icon
                                name="angle-left"
                                size={25}
                                color={!this.state.canGoBack ? "#ffffff" : "#A52A2A"}
                                style={styles.btnIcon}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this._bridge.injectJavaScript("window.location.href='https://my.serverscheck.com/home.php'");
                        }}
                        style={styles.btnClickContain}
                        disabled={!this.state.canGoHome}
                    >
                        <View
                            style={styles.btnContainer}>
                            <Icon
                                name="home"
                                size={25}
                                color={!this.state.canGoHome ? "#ffffff" : "#A52A2A"}
                                style={styles.btnIcon}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this._bridge.goForward()}
                        style={styles.btnClickContain}
                        disabled={!this.state.canGoForward}
                    >
                        <View
                            style={styles.btnContainer}>
                            <Icon
                                name="angle-right"
                                size={25}
                                color={!this.state.canGoForward ? "#ffffff" : "#A52A2A"}
                                style={styles.btnIcon}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }


}