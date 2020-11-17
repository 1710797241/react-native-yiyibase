import React from "react";
import {View,Text,TouchableOpacity} from 'react-native'


export default class App extends React.Component {
   

    render() {
        const { navigation } = this.props;
        return <View>
            <TouchableOpacity 
                onPress={()=>{
                    navigation.navigate('Details')
                }}
            ><Text>首页</Text></TouchableOpacity>

        </View>
    }
}