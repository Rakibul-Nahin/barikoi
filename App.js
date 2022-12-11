import {useState} from 'react';
import { Text, View, StyleSheet, TextInput, 
  Button , TouchableOpacity, ScrollView} 
from 'react-native';
import Constants from 'expo-constants';
import MapView, {Marker} from "react-native-maps"
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Axios from "axios"


export default function App() {

  const API_KEY = "NDQyOToxSU1QVFhSSkVZ";

  const [placeName, setPlaceName] = useState("Burger Lab");
  const [bangla, setBangla] = useState(false);
  const [places, setPlaces] = useState([]);


  const find_place_request=()=>{
    console.log("place name: ", placeName);
    Axios.get(
      "https://barikoi.xyz/v1/api/search/autocomplete/"+API_KEY+"/place?q="+placeName
    )
    .then( (res)=>{setPlaces(res.data["places"]);} )
    // .then( (res)=>{console.log(res.data["places"]);} )
    .catch( (err)=>{console.log(err);} )
  }

  return (
    <View style={styles.container}>
      <View style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>

        <Text style={{fontSize: 25}}>Search a place</Text>

        <View style={{flexDirection: "row", marginTop: 5}}>
          <Text style={{ marginRight: 10}}>Place Name: </Text>
          <TextInput 
            style={{
              marginRight: "10px",
              borderRadius:5,
              borderColor:"black",
              borderWidth: 1,
              width: "35%",
              textAlign: "center",
              marginRight: 10
            }}
            placeholder="place name"
            onChangeText={setPlaceName}
          />

          <Text style={{ marginRight: 10}}>Bangla: </Text>
          <BouncyCheckbox onPress={(isChecked) => {setBangla(isChecked)}} />
        </View>
              
        <TouchableOpacity
          onPress={()=>{find_place_request()}}
          style={{
            alignItems: "center",
            backgroundColor: "#4d90fa", 
            width: 100, height: 30,
            justifyContent: "center",
            borderRadius: 10,
            margin: 5,
          }}
        >
          <Text>Find Place</Text>
        </TouchableOpacity>

        <ScrollView style={{width: "100%", height: 100, borderColor: "black", borderWidth: 1, borderRadius: 5}}>
          {places.map((item)=>{
              console.log(item);
              return(<Text>Latitude: {item["latitude"]}, Longitude: {item["longitude"]}</Text>)
            })
          }
        </ScrollView>

      </View>

      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: 23.80865290094849,
          longitude:  90.42082681793359,
          latitudeDelta: 0.0722,
          longitudeDelta: 0.0321,
        }}
      >
        {places.map((items, index) => {
          console.log(items);
          return(
            <Marker
              key={index}
              coordinate={{latitude: items["latitude"], longitude: items["longitude"]}}
              title={"title"}
              description={"description"}
            />
          )
          
        })}

      </MapView>

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
   map: {
    width: '100%',
    height: '70%',
  },
});
