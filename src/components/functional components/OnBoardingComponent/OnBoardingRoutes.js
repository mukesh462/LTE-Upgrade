import 'react-native-gesture-handler';

import * as React from "react";


import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnBoardingScreen from './OnBoardingScreen';
import OnBoardingTwoScreen from './OnBoardingTwoScreen';
import OnBoardingThreeScreen from './OnBoardingThreeScreen';

const Stack = createNativeStackNavigator();

const OnBoardingRoutes = ({route}) => {
    return (
        <Stack.Navigator initialParams={{  }}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="OnBoardingOne" component={OnBoardingScreen} initialParams={route.params}/>
            <Stack.Screen name="OnBoardingTwo" component={OnBoardingTwoScreen} initialParams={route.params}/>
            <Stack.Screen name="OnBoardingThree" component={OnBoardingThreeScreen} initialParams={route.params}/>
        </Stack.Navigator>
    )
}

export default OnBoardingRoutes;