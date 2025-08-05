import { StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';
import { useState } from 'react';
import { COLORS } from '../../../../constants';


const Landing = ({ navigation, route }) => {



  const [imageList , setImageList]= useState([
    "https://source.unsplash.com/1024x768/?nature",
    "https://source.unsplash.com/1024x768/?water",
    "https://source.unsplash.com/1024x768/?nature",
    "https://source.unsplash.com/1024x768/?tree",
    // require('../../../assets/adaptive-icon.png'), 
  ]);


   const onStartedPressed = ()=>{
    console.log(route);
    navigation.navigate('Login');
   };
  return (
    <View style={styles.container}>
      <SliderBox images={imageList} sliderBoxHeight={550}
      dotColor={COLORS.primary}
      inactiveDotColor="#90A4AE"
      paginationBoxVerticalPadding={20}
      autoplay
      circleLoop
      resizeMethod={'resize'}
      resizeMode={'cover'}
      />

     <Text style={styles.textStyle}>Education & Training</Text>
     <Text style={styles.subTextStyle}>In learning you will teach,</Text>
     <Text style={styles.subTextStyle}>and in teaching you will learn.</Text>
     <View style={styles.subViewContainer}>
     <TouchableOpacity onPress={onStartedPressed}
        style={styles.btnStyle}>
        <Text style={styles.btnTextStyle}>GET STARTED</Text>
      </TouchableOpacity>
     </View>
      {/* <StatusBar style="auto" /> */}
    </View>
  );
}

export default Landing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // fontFamily: 'NunitoSans-Bold',
  },
  textStyle:{
    alignSelf:"center",
    justifyContent:"center", 
    padding:15, 
    fontSize:28, 
  }, 
  subTextStyle:{
    color:'#767676', 
    fontSize:16, 
    margin:0, 
    alignSelf:"center",
    justifyContent:"center", 
  }, 
  subViewContainer:{
    width:350, 
    height:250,
    alignSelf:"center",
    justifyContent:"center", 
    
  }, 
  btnStyle:{
    alignItems: "center",
    backgroundColor: COLORS.primary,
    padding: 10, 
    borderRadius:5
  }, 
  btnTextStyle:{
    fontSize:20, 
    color:'#FFFFFF', 
  }, 
});
