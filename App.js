import {useState} from 'react';
import { Text, View, StyleSheet, TextInput, 
  Button , TouchableOpacity, ScrollView} 
from 'react-native';
import Constants from 'expo-constants';
import MapView, {Marker} from "react-native-maps"
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Axios from "axios"
import MyMapView from './Components/MyMapView';
import DemoView from './Components/DemoView';



export default function App() {
  

  return (
    <View style={styles.container}>
      <MyMapView />

      {/* <DemoView /> */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
    textAlign: "center"
  },


});
