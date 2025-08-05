/* StudDashboard.j */
import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../../../constants';

const StudStyle = StyleSheet.create({
    studMainContainer:{
        alignItems:'center', 
        marginVertical:20,
    }, 
    gradeText:{
        color:'#58585A',
        marginVertical:3
    }, 
    moreText:{
        color:'#2664DE',
        marginVertical:10
    },
    nameTextStyle:{
        fontSize:26,
    }, 
    textStyle:{
        fontSize:40,
        fontWeight:'bold',
        fontFamily:FONTS.bold
    },
    goodText:{
        color:'#DD550D', 
    },
    excellentText:{
        color:'#1EC12A', 
    },
    completedText:{
        color:'#2865DE', 
    },
    studyingText:{
        color:'#F41E78', 
    },
    subTextStyle:{
        color:'#58585A',
        fontSize:14,
        fontFamily:FONTS.regular

    }, 
    mainContainer:{
        alignSelf:'center',
        flexDirection:'row', 
    },
    completionAlign:{
        flexDirection:'column', 
        alignItems:'center',
        alignSelf:'stretch',
        marginHorizontal:30
    },

    /* StudPerformance.js */
    mainView:{
        marginVertical:25,
        alignItems:'center'
    },
    gridView: {
        marginTop: 10,
      },
      itemCode: {
        fontWeight: 'bold',
        fontSize: 24,
        color: '#1EC12A',
        borderColor:'gray',
        borderWidth:0.75,
        height: 75,
        padding:18,
        textAlign:'center',
      },
      subViewContainer: {
        width: 350,
        height: 60,
        alignSelf: "center",
        marginHorizontal:50, 
        marginVertical:30, 
        justifyContent:"flex-end" 
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
})

export default StudStyle