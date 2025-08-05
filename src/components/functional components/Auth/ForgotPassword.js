import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { EvilIcons } from '@expo/vector-icons'; import {
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
    StyleSheet,
    Linking
} from "react-native";
import { StackActions } from '@react-navigation/native';

import { StatusBar } from "react-native";
import { COLORS, SIZES, FONTS, assets, CONST, en, fr, es } from "../../../../constants";
import { TextInput } from "@react-native-material/core";
import Toast from 'react-native-toast-message';
import axios from "axios";

const ForgotPassword = ({ navigation }) => {

    const validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const [email, setEmail] = useState("")

    const [animSpeed, setAnimSpeed] = useState(false)
    const animRef = useRef()


    function playAnimation() {
        setAnimSpeed(true)
    }


    function pauseAnimation() {
        setAnimSpeed(false)
    }

    useEffect(() => {
        setTimeout(() => {
            animRef.current?.play();
        }, 100)
    }, [animSpeed])


    const [isSent, setSent] = useState(false)



    const triggerForgotPassword = async () => {
        if (validateEmail(email) == null) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Email'
            })
        } else {

            axios.post(
                `${CONST.baseUrl}/teacherapp/forgot/password`, { email: email.trim().toLowerCase() }
            ).then((response) => {

                console.log(response.data)

                Toast.show({
                    type: 'info',
                    text1: response.data.message
                })
                setSent(true)

                // setTimeout(() => {
                //     navigation.dispatch(StackActions.pop(1))
                // }, 2000);





            }).catch((error) => {
                console.error(error)
                console.log(error.response);
                Toast.show({
                    type: 'error',
                    text1: 'Please try again later'
                })
            });

        }
    }

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, alignItems: 'center', padding: 4 }}>
            <StatusBar
                background={COLORS.white}
                backgroundColor={COLORS.white}
                barStyle="dark-content"
                style={{ backgroundColor: COLORS.white, flex: 1 }}
            ></StatusBar>

            <View style={{
                width: '100%',
                height: 64,
                shadowColor: COLORS.homeCard,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                backgroundColor: COLORS.white,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                paddingHorizontal: 16,

            }}>


                <TouchableOpacity
                    onPress={() => {

                        navigation.dispatch(StackActions.pop(1))
                    }}
                    style={{ position: 'absolute', left: 24, width: 36, height: 36, justifyContent: 'center', alignItems: 'center' }}>
                    <EvilIcons name="arrow-left" size={36} color="black" />

                </TouchableOpacity>

                <Text
                    style={{
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontSize: SIZES.medium,
                        fontFamily: FONTS.semiBold,
                        color: COLORS.black,
                    }}
                >
                    Reset Password
                </Text>


            </View>



            <Text
                style={{
                    alignSelf: 'flex-start',
                    marginHorizontal: 24,
                    width: '90%',
                    marginTop: 28,
                    fontSize: SIZES.smallFont,
                    fontFamily: FONTS.regular,
                    color: COLORS.bankAccent,
                }}
            >
                Enter your email
            </Text>


            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 18 }}>
                <TextInput value={email} onChangeText={(text) => { setEmail(text) }} variant="outlined" label="Email" style={{ marginHorizontal: 16, width: '90%' }} color={COLORS.blue} />
            </View>

            <View style={{ ...Styles.subViewContainer, position: 'absolute', bottom: 20 }}>
                <TouchableOpacity disabled={isSent} onPress={() => {
                    if (animSpeed) return
                    // setInter(true)
                    triggerForgotPassword()
                }} style={Styles.btnStyle}>
                    {
                        animSpeed ? <ActivityIndicator size="small" color='white' />
                            : <Text style={Styles.btnTextStyle}>{isSent ? "Email Sent" :"Send reset link"}</Text>

                    }
                </TouchableOpacity>
            </View>



            {/* <RectButton text="Send" position='absolute' bottom={60} onClick={() => { triggerForgotPassword() }} /> */}

            <Toast
                position='bottom'
                bottomOffset={20}
            />
            {/* {animSpeed &&
                        <View style={{
                            shadowColor: COLORS.homeCard,
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.3,
                            shadowRadius: 2,
                            elevation: 8,
                            position: 'absolute', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)', alignSelf: 'center', padding: 24, marginTop: 16
                        }}>

                            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '-20%' }}>
                                <Image source={assets.logo} style={{ width: 250, height: 250, resizeMode: 'contain', position: 'absolute', zIndex: 10, }} />
                                <Lottie source={require('../../../assets/flight-loader.json')} style={{ height: 350, width: 350, alignSelf: 'center' }} />
                            </View>
                            <Lottie source={require('../../../assets/loading.json')} autoPlay style={{ height: 50, width: 50, alignSelf: 'center' }} loop ref={animRef} speed={1} />


                        </View>

                    } */}

        </SafeAreaView>

    )
}

export default ForgotPassword;

const Styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        alignItems: "center",
        alignSelf: 'center',
        width: '90%'
    },
    header: {
        fontFamily: FONTS.semiBold,
        fontSize: SIZES.extraLarge,
        alignContent: "center",
    },
    headerText: {
        fontSize: 16,
        alignContent: "center",
        textAlign: 'center',
        fontFamily: FONTS.regular
    },
    input: {
        height: 40,
        width: 350,
        margin: 12,
        borderWidth: 1,
        borderColor: "#0000001F",
        padding: 10,
    },
    subLoginViewContainer: {
        width: '100%',
        height: 50,
        alignSelf: "center",
        justifyContent: "center",
        borderColor: "#0000001F",
        borderWidth: 1,
        borderRadius: 5,
        marginTop: SIZES.doubleLarge,
        alignItems: 'center',
        justifyContent: 'center'
    },
    signinStyle: {
        justifyContent: 'center',
        alignItems: "center",
        padding: 10,
        borderRadius: 5,
    },
    subViewContainer: {
        width: 350,
        height: 250,
        alignSelf: "center",
        justifyContent: "center",
    },
    btnStyle: {
        alignItems: "center",
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 5,
    },

    btnTextStyle: {
        fontSize: 20,
        color: "#FFFFFF",
    },
});