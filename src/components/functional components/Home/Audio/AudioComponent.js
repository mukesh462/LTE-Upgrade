import React, { useEffect , useState , createContext} from "react";
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';
import { DataProvider } from 'recyclerlistview';
import * as Permissions from 'expo-permissions';
export const AudioContext = createContext();
const AudioComponent=()=>{
    const [loaded , setLoaded] = useState(false);

    const [audioObject , setAudioObject] = useState({
            audioFiles: [],
            permissionError: false,
            dataProvider: new DataProvider(),
            playbackObj: null,
            soundObj: null,
            currentAudio: {},
            isPlaying: false,
            isPlayListRunning: false,
            currentAudioIndex: null,
            playbackPosition: null,
            playbackDuration: null,
            totalAudioCount : 0
    });

    useEffect(()=>{
        getPermission();
    });
    const permissionAlert = () => {
        Alert.alert('Permission Required', 'This app needs to read audio files!', [
          {
            text: 'I am ready',
            onPress: () => getPermission(),
          },
          {
            text: 'cancel',
            onPress: () => permissionAlert(),
          },
        ]);
      };
    const getPermission = async () => {
        // {
        //     "canAskAgain": true,
        //     "expires": "never",
        //     "granted": false,
        //     "status": "undetermined",
        //   }
        const permission = await MediaLibrary.getPermissionsAsync();
        if (permission.granted) {
          //    we want to get the audio file
          getAudioFiles();
        }
    
        if (!permission.canAskAgain && !permission.granted) {
            setAudioObject({ ...audioObject, permissionError: true });
        }
    
        if (!permission.granted && permission.canAskAgain) {
          const { status, canAskAgain } =
            await MediaLibrary.requestPermissionsAsync();
          if (status === 'denied' && canAskAgain) {
            //   we are going to display alert that user must allow this permission to work this app
            permissionAlert();
          }
    
          if (status === 'granted') {
            //    we want to get the audio file
            getAudioFiles();
          }
    
          if (status === 'denied' && !canAskAgain) {
            //   we want to display some error to the user
            setAudioObject({ ...audioObject, permissionError: true });
          }
        }
      };
    


    const getAudioFiles = async () => {
        const { dataProvider, audioFiles } = audioObject;
        let media = await MediaLibrary.getAssetsAsync({
          mediaType: 'audio',
        });
        media = await MediaLibrary.getAssetsAsync({
          mediaType: 'audio',
          first: media.totalCount,
        });
        audioObject.totalAudioCount = media.totalCount;
    
        setAudioObject({
          ...audioObject,
          dataProvider: dataProvider.cloneWithRows([
            ...audioFiles,
            ...media.assets,
          ]),
          audioFiles: [...audioFiles, ...media.assets],
        });
      };
      if (audioObject.permissionError)
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 25, textAlign: 'center', color: 'red' }}>
            It looks like you haven't accept the permission.
          </Text>
        </View>
      );
      return (
        <AudioContext.Provider value={audioObject}></AudioContext.Provider>
      );

}
export default AudioComponent;