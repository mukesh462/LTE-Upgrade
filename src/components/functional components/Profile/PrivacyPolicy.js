import { Text, View, Image, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Platform } from "react-native";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { COLORS, SIZES, FONTS, assets, CONST } from "../../../../constants";
import { DatePickerModal } from 'react-native-paper-dates';
import { Ionicons, MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

const PrivacyPolicy = ({ navigation }) => {


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


    const postTicket = async () => {
        if (title.trim().length === 0 || message.trim().length === 0) {
            Toast.show({
                type: 'error',
                text1: 'Empty fields!'
            })
            return
        }

        try {
            const teacherID = await AsyncStorage.getItem('AuthState')
            console.log(teacherID);

            playAnimation()

            axios.post(
                `${CONST.baseUrl}/messages/addmessage`, {
                msg_title: title,
                msg_description: message,
                sent_teacher_id: teacherID
            }
            ).then((response) => {
                pauseAnimation()
                Toast.show({
                    type: 'success',
                    text1: 'Ticket Sent!'
                })
                setTitle("")
                setMessage("")

                // navigation.dispatch(StackActions.pop(1))

            })
        } catch (e) {
            // error reading value
            pauseAnimation()
            Toast.show({
                type: 'error',
                text1: 'Unknown error occured'
            })
            console.error(e.response)
        }
    }


    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")

    return (
        <SafeAreaView style={{ backgroundColor: COLORS.blueShade, width: '100%', height: '100%', alignItems: 'center', position:'relative' }}>
        <ScrollView contentContainerStyle={{paddingBottom : 150}} showsVerticalScrollIndicator={false}>
        
            <Text style={{
                fontSize: 24,
                alignContent: "center",
                textAlign: 'center',
                fontFamily: FONTS.bold,
                marginTop: 32,
            }}>
                Privacy Policy
            </Text>

            <TouchableOpacity
                onPress={() => {
                    navigation.dispatch(StackActions.pop(1))
                }}
                style={{ top: 32, position: 'absolute', left: 10 }}>
                <Ionicons name="arrow-back" size={32} color={COLORS.grey} style={{}} />
            </TouchableOpacity>


            <Text style={{
                fontSize: 20,
                alignContent: "center",
                textAlign: 'left',
                fontFamily: FONTS.bold,
                marginTop: 32,
                color: COLORS.textBlack,
                alignSelf: 'center',
                width: '95%'

            }}>
                Privacy Policy
            </Text>

            <Text style={{
                fontSize: 16,
                alignContent: "center",
                textAlign: 'justify',
                maxWidth: '95%',
                fontFamily: FONTS.regular,
                marginTop: 12,
                color: COLORS.textBlack,
                alignSelf: 'center',

            }}>
                This privacy policy applies to the LTE app (hereby referred to as "Application") for mobile devices developed and managed by a non-profit group, Let’s Teach English under the APR (Adarsh Palm Retreat) Charitable Trust. The app is designed to facilitate the teaching of basic English skills by teachers (hereby referred to as “users”) and is NOT accessed by learners.

            </Text>

            <Text style={{
                fontSize: 20,
                alignContent: "center",
                textAlign: 'left',
                fontFamily: FONTS.bold,
                marginTop: 32,
                color: COLORS.textBlack,
                alignSelf: 'center',
                width: '95%'

            }}>
                Personal Identification Information
            </Text>

            <Text style={{
                fontSize: 16,
                alignContent: "center",
                textAlign: 'justify',
                maxWidth: '95%',
                fontFamily: FONTS.regular,
                marginTop: 12,
                color: COLORS.textBlack,
                alignSelf: 'center',

            }}>
                The app does not collect any personal identification information from the users. We are committed to safeguarding the privacy of our users and ensuring a secure environment for teaching English skills without the need to collect personal data through the app.
            </Text>


            <Text style={{
                fontSize: 20,
                alignContent: "center",
                textAlign: 'left',
                fontFamily: FONTS.bold,
                marginTop: 32,
                color: COLORS.textBlack,
                alignSelf: 'center',
                width: '95%'

            }}>
                Non-personal Identification Information

            </Text>

            <Text style={{
                fontSize: 16,
                alignContent: "center",
                textAlign: 'justify',
                maxWidth: '95%',
                fontFamily: FONTS.regular,
                marginTop: 12,
                color: COLORS.textBlack,
                alignSelf: 'center',

            }}>
                We do not collect non-personal identification information about users when they interact with the app. The app is designed solely for educational purposes and does not require or store any information that can be used to identify individual users.
            </Text>

            <Text style={{
                fontSize: 20,
                alignContent: "center",
                textAlign: 'left',
                fontFamily: FONTS.bold,
                marginTop: 32,
                color: COLORS.textBlack,
                alignSelf: 'center',
                width: '95%'

            }}>
                How We Use Collected Information

            </Text>

            <Text style={{
                fontSize: 16,
                alignContent: "center",
                textAlign: 'justify',
                maxWidth: '95%',
                fontFamily: FONTS.regular,
                marginTop: 12,
                color: COLORS.textBlack,
                alignSelf: 'center',

            }}>
                Since the app does not collect any user information, there is no use of such data for purposes other than the core functionality of teaching English skills. The app is designed to operate without the need for collecting or processing any user data, ensuring maximum privacy and security.
            </Text>



            <Text style={{
                fontSize: 20,
                alignContent: "center",
                textAlign: 'left',
                fontFamily: FONTS.bold,
                marginTop: 32,
                color: COLORS.textBlack,
                alignSelf: 'center',
                width: '95%'

            }}>
                How We Protect Your Information

            </Text>

            <Text style={{
                fontSize: 16,
                alignContent: "center",
                textAlign: 'justify',
                maxWidth: '95%',
                fontFamily: FONTS.regular,
                marginTop: 12,
                color: COLORS.textBlack,
                alignSelf: 'center',

            }}>
                Given that no personal or non-personal identification information is collected through the app, the risk of data breach is significantly minimized. The app is developed with a strong focus on privacy by design, ensuring that the teaching and learning process is conducted in a secure digital environment.
            </Text>

            <Text style={{
                fontSize: 20,
                alignContent: "center",
                textAlign: 'left',
                fontFamily: FONTS.bold,
                marginTop: 32,
                color: COLORS.textBlack,
                alignSelf: 'center',
                width: '95%'

            }}>
                Changes to this privacy policy

            </Text>

            <Text style={{
                fontSize: 16,
                alignContent: "center",
                textAlign: 'justify',
                maxWidth: '95%',
                fontFamily: FONTS.regular,
                marginTop: 12,
                color: COLORS.textBlack,
                alignSelf: 'center',

            }}>
                The LTE Team has the discretion to update this privacy policy at any time. When we do that, we will revise the updated date at the bottom of this page. We encourage users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.
            </Text>

            <Text style={{
                fontSize: 20,
                alignContent: "center",
                textAlign: 'left',
                fontFamily: FONTS.bold,
                marginTop: 32,
                color: COLORS.textBlack,
                alignSelf: 'center',
                width: '95%'

            }}>
                Your Acceptance of these Terms


            </Text>

            <Text style={{
                fontSize: 16,
                alignContent: "center",
                textAlign: 'justify',
                maxWidth: '95%',
                fontFamily: FONTS.regular,
                marginTop: 12,
                color: COLORS.textBlack,
                alignSelf: 'center',

            }}>
                By using the application, you are consenting to the processing of your information as set forth in this privacy policy now and as amended by us.

            </Text>



            <Text style={{
                fontSize: 20,
                alignContent: "center",
                textAlign: 'left',
                fontFamily: FONTS.bold,
                marginTop: 32,
                color: COLORS.textBlack,
                alignSelf: 'center',
                width: '95%'

            }}>
                Contact Us


            </Text>

            <Text style={{
                fontSize: 16,
                alignContent: "center",
                textAlign: 'justify',
                maxWidth: '95%',
                fontFamily: FONTS.regular,
                marginTop: 12,
                color: COLORS.textBlack,
                alignSelf: 'center',

            }}>
                If you have any questions about this privacy policy, the practices of this app, or your interaction with this app, please contact us via email at letsteachenglish.act@gmail.com.


            </Text>


            </ScrollView>
        </SafeAreaView>
    )
}

export default PrivacyPolicy;

const styles = StyleSheet.create({
    dropdown: {
        height: 60,
        borderRadius: 6,
        borderWidth: 0,
        width: '95%',
        paddingHorizontal: 12,
        backgroundColor: 'white',
        marginTop: 4

    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
        color: COLORS.textGrey
    },
    selectedTextStyle: {
        fontSize: SIZES.smallFont,
        fontFamily: FONTS.semiBold
    },

});