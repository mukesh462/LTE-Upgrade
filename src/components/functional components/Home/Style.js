import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS, assets } from "../../../../constants";

const styles = StyleSheet.create({

  mainAudioContainer: {
    flex: 1,
    backgroundColor:'white'
  },
  audioText:{
        fontSize:SIZES.font, 
        alignSelf:'center',
        textAlign:'center',  
        margin:30,
        fontFamily:FONTS.regular
  }, 
  dragViewContainer: {
    flex: 2,
    width: 370,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#B5B5B5",
    flexDirection: "column",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:'#FAFAFA'
  },
  uploadIcon:{
    textAlign:'center'
  }, 
  uploadText:{
    textAlign:'center', 
    fontSize:SIZES.font,
    fontFamily:FONTS.bold
  }, 

  subViewContainer: {
    width: 350,
    height: 60,
    alignSelf: "center",
    marginHorizontal:50, 
    marginVertical:50, 
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
});

export default styles;
