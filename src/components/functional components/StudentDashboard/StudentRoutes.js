import 'react-native-gesture-handler';

import * as React from "react";


import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentsList from './StudentsList';
import StudentProfileView from "../StudentDashboard/studdashboard";
import LevelReview from '../Sessions/LevelReview';
import LevelReviewZero from '../Sessions/LevelReviewZero';

const Stack = createNativeStackNavigator();

const StudentRoutes = ({route}) => {
    return (
        <Stack.Navigator initialParams={{ teacherID: route.params.teacherID }}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Students List" component={StudentsList} initialParams={{teacherID: route.params.teacherID}} />
            <Stack.Screen name="Student Profile" component={StudentProfileView} />
            <Stack.Screen name="Level Review" component={LevelReview} />
            <Stack.Screen name="Level Review Zero" component={LevelReviewZero} />

        </Stack.Navigator>
    )
}

export default StudentRoutes;