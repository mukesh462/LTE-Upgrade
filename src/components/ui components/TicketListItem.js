import { View, Text, TouchableOpacity, Image, Modal } from "react-native";
import Checkbox from 'expo-checkbox';
import { React, useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS, assets } from "../../../constants";
import { Ionicons } from '@expo/vector-icons';



const TicketListItem = ({onclick, name, education, id, time, status, onClick}) => {



    return (
        <TouchableOpacity 
        onPress={onClick}
        style={{ width: '100%', flexDirection: 'row', height: 75, padding: 12, marginTop:4, backgroundColor:'white', borderRadius:8, marginTop:16 }}>
            <View style={{ height: 50, width: 50, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', borderRadius:4 }}>
                <Text style={{
                    fontFamily: FONTS.semiBold,
                    fontSize: 16,
                    color: 'white'
                }}>
                    {id}
                </Text>
            </View>

            <View style={{marginStart:12, paddingVertical:8, justifyContent:'space-between'}}>
                <Text numberOfLines={1} style={{
                    fontFamily: FONTS.semiBold,
                    fontSize: 16,
                    color: 'black',
                    maxWidth: "75%",
                }}>
                    {name}
                </Text>
                <Text style={{
                    fontFamily: FONTS.regular,
                    fontSize: 14,
                    color: COLORS.grey,
                }}>
                    {time}
                </Text>
            </View>

                {status? <Image
                source={assets.ticketOpen}
                style={{ position: 'absolute', right: 16, top:20, width:24, height:25, resizeMode:'contain', marginTop:8 }}
                /> : 
                <Image
                source={assets.ticketClose}
                style={{ position: 'absolute', right: 16, top:20, width:24, height:25, resizeMode:'contain', marginTop:8 }}/> }

        </TouchableOpacity>
    )
}

export default TicketListItem;