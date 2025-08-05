import * as React from "react";
import { COLORS, SIZES, FONTS, assets } from "../../../../constants";
import { StatusBar, TouchableOpacity } from "react-native";

import {
    Text,
    View,
    SafeAreaView,
    Pressable,
    Image,
    Dimensions
} from "react-native";





const OnBoardingThreeScreen = ({ navigation, route }) => {





    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, alignItems: 'center', flexDirection: 'column' }}>

            <StatusBar
                background={COLORS.white}
                backgroundColor={COLORS.white}
                barStyle="dark-content"
                style={{ backgroundColor: COLORS.white, flex: 1 }}
            ></StatusBar>

            <View style={{ width: '90%', justifyContent: 'center', alignItems: 'center', marginTop: 64 }}>
                <Text
                    style={{
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontSize: SIZES.extraLarge,
                        fontFamily: FONTS.bold,
                        color: COLORS.text,
                    }}
                >
                    Education & Training
                </Text>

                <Text
                    style={{
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontSize: SIZES.font,
                        fontFamily: FONTS.regular,
                        color: COLORS.textGrey,
                        marginTop: SIZES.medium
                    }}
                >
                    In learning you will teach, and in{'\n'}teaching you will learn.
                </Text>

            </View>



            <Image
                source={assets.boardingOne}
                style={{ width: Dimensions.get("window").width * 0.8, resizeMode: 'contain', height: Dimensions.get("window").width * 0.9, marginTop: 36 }} />


            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, width: '100%', position: 'absolute', bottom: 48, alignItems: 'center' }}>

                <Text
                    style={{
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontSize: SIZES.medium,
                        fontFamily: FONTS.semiBold,
                        color: COLORS.primary,
                        flex: 1
                    }}
                    onPress={() => { route.params.finishBoarding() }}
                >
                    Skip
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
                    <View style={{ height: 12, width: 12, borderRadius: 10, backgroundColor: COLORS.grey }} />
                    <View style={{ height: 12, width: 12, borderRadius: 10, backgroundColor: COLORS.grey, marginStart: 8 }} />
                    <View style={{ height: 12, width: 12, borderRadius: 10, backgroundColor: COLORS.blue, marginStart: 8 }} />

                </View>


                <TouchableOpacity
                    style={{ justifyContent: 'center', alignItems: 'center',flex: 1 }}
                    onPress={() => { route.params.finishBoarding() }}
                >
                    <Image
                    style={{height:48, width:48}}
                    source={assets.arrowCircleRight}/>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )

}

export default OnBoardingThreeScreen;