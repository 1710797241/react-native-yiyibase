import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Root, StyleProvider, View } from "native-base";
import React from "react";
import Constants from "../Constants";
import { NBConfig } from "../models";
import { getLastNBUserALL, setNBUserAll } from "../user";
import { NBPageInstantDetail } from "./instants";
import { NBPages, NBCompAppThemeConfig } from "./types";
import NBCompApp from "./NBCompApp";

export interface NBCompBaseAppRootAppRouter {
    name: string,
    component: React.ComponentType<any>
}

export interface NBCompBaseAppRootPros {
    theme?: any,
    routes?: Array<NBCompBaseAppRootAppRouter>,
    bottomTabRouters?:Array<NBCompBaseAppRootAppRouter>,
    useInstantsLibs?: boolean,
    nbConfig?: NBConfig,
    themeConfig?: NBCompAppThemeConfig
}

const Stack = createStackNavigator();
const BottomTabNavigator = createBottomTabNavigator();

export class NBCompBaseAppRoot extends React.Component<NBCompBaseAppRootPros, { isLoaded?: boolean }> {

    constructor(props: NBCompBaseAppRootPros) {
        super(props);
        this.state = { isLoaded: false };

        if (props.themeConfig) {
            NBCompApp.themeConfig = Object.assign({}, Object.assign(NBCompApp.themeConfig, props.themeConfig));
        }
    }

    componentDidMount() {
        this.setState({ isLoaded: false });
        const nbConfig: NBConfig = this.props.nbConfig;
        Promise.resolve(nbConfig ? nbConfig : Constants.readLocalConf()).then(conf => {
            return Promise.all([getLastNBUserALL().then(u => {
                return setNBUserAll(u);
            }), conf ? Constants.setConf(conf).then(r => true) : Promise.resolve(true)]);
        }).then(is => {
            this.setState({ isLoaded: true });
        }).catch(err => {
            console.warn(err);
            this.setState({ isLoaded: true });
        })
    }

    render() {
        if (!this.state.isLoaded) {
            return <View />
        }
        const { theme, routes,useInstantsLibs } = this.props;
        let bottomTab: Array<NBCompBaseAppRootAppRouter> = [];
        let appRouters:Array<NBCompBaseAppRootAppRouter> = [];
        
        if (routes) {
            appRouters = [
                ...routes
            ]
        }

        if (useInstantsLibs === undefined || useInstantsLibs) {
            appRouters.push({
                name: NBPages.InstantPage,
                component: NBPageInstantDetail
            })
        }

        return <Root>
            
               <NavigationContainer ref={o => NBCompApp.navigation = o}>
                      <Stack.Navigator>
                    
                            {
                                appRouters.map(v => <Stack.Screen key={v.name} name={v.name} component={v.component}></Stack.Screen>)
                            }
                       
                      
                      </Stack.Navigator>
                   
                       
                    </NavigationContainer>
            
        </Root>
    }
}