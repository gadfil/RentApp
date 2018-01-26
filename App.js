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
    Dimensions
} from 'react-native';
import Orientation from 'react-native-orientation';
// import Icon from 'react-native-vector-icons/dist/FontAwesome';


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
});

export default class App extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: true,
            canGoBack: false,
            canGoForward: false,

        }

    }

    componentDidMount() {
        NetInfo.isConnected.fetch().done(isConnected => this.setState({isConnected}))
        // this.checkNewVersion()
        Orientation.addOrientationListener(this._orientationDidChange);


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
        console.log(navState)
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
        return (
            <View style={{
                flex: 1, backgroundColor: 'rgb(254, 143, 29)'
            }}>
                <StatusBar
                    barStyle="light-content"
                />
                <WebView
                    mixedContentMode='always'
                    source={{uri: 'https://my.serverscheck.com/'}}
                    ref={(b) => this._bridge = b}
                    style={{flex: 1, marginTop: 45}}
                    onError={() => NetInfo.isConnected.fetch().done(isConnected => this.setState({isConnected}))}
                    renderError={() => this.renderError()}
                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                />
                <View style={{height:70, backgroundColor:'rgb(254, 143, 29)', flexDirection:'row'}}>
                    {/*<Icon name="angle-left" size={30} color="#900" />*/}
                    <Button  disabled ={!this.state.canGoBack} title="Back" onPress={()=> this._bridge.goBack()}/>
                    <Button disabled ={!this.state.canGoForward} title="Forward"  onPress={()=> this._bridge.goForward()}/>
                    <Button title="Home" />
                </View>
            </View>
        );
    }


}