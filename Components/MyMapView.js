import {useState, } from 'react';
import { Text, View, StyleSheet, TextInput, 
  Button , TouchableOpacity, ScrollView} 
from 'react-native';
import Constants from 'expo-constants';
import MapView, {Marker} from "react-native-maps"
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Axios from "axios"


export default function MyMapView() {
    
    const API_KEY = "NDQyOToxSU1QVFhSSkVZ";
    const [source, setSource] = useState("Burger Lab");
    const [bangla, setBangla] = useState(false);
    const [places, setPlaces] = useState([]);
  const [suggestions, setSuggestions] = useState([]);


  const find_place_request=()=>{
    // console.log("place name: ", placeName);
    Axios.get(
      "https://barikoi.xyz/v1/api/search/autocomplete/"+API_KEY+"/place?q="+source
    )
    .then( (res)=>{setPlaces(res.data["places"]);} )
    // .then( (res)=>{console.log(res.data["places"]);} )
    .catch( (err)=>{console.log(err);} )
  }

  const onSearchHandler=(text)=>{
    setSource(text)
    let searchValue = text;
    if(searchValue == ""){
      setSuggestions([]);
    }else{
      let request = "https://barikoi.xyz/v1/api/search/autocomplete/"+API_KEY+"/place?q="+searchValue;
      Axios.get(request)
      .then((res)=>{
        if("message" in res.data){
          setSuggestions([{"address": "no address found with this name"}])
        }else{
          setSuggestions(res.data["places"]);
        }
      })
      .catch((err)=>console.log(err))
    }
  }

  const onSuggestionPress=(item)=>{
    console.log("Suggestion press");
    setSource(item["address"]);
    setPlaces([item])
  }
    return(
        <View style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>

            <Text style={{fontSize: 25}}>Search a place</Text>
            
            {/* find place view */}
            <View style={{flexDirection: "row", margin: 5}}>
            	<Text style={{ marginRight: 10}}>Source Name: </Text>
				<TextInput 
					style={styles.textInput}
					placeholder="source place"
					onChangeText={(text)=>{onSearchHandler(text)}}
				/>

            	<Text style={{ marginRight: 10}}>Bangla: </Text>
            	<BouncyCheckbox onPress={(isChecked) => {setBangla(isChecked)}} />
            </View>

			<View style={{flexDirection: "row", margin: 5}}>
            	<Text style={{ marginRight: 10}}>Destination Name: </Text>
				<TextInput 
					style={styles.textInput}
					placeholder="Destination place"
					onChangeText={(text)=>{onSearchHandler(text)}}
				/>

				<TouchableOpacity
					onPress={()=>{find_place_request()}}
					style={styles.findPlace}
				>
					<Text>Find Place</Text>
				</TouchableOpacity>
            </View>
                
            

            {/* suggestion view */}
            <ScrollView style={{width: "100%", height: 150, borderColor: "black", borderWidth: 1, borderRadius: 5}}>
            {suggestions.map((item)=>{
                return (
                    <TouchableOpacity
                    style={styles.suggestionBtn}
                    onPress={()=>onSuggestionPress(item)}
                    >
                    <Text style={{color: "white"}}>{item["address"]}</Text>
                    </TouchableOpacity>
                )
                })}
            </ScrollView>

            {/* Map View */}
            <MapView 
                style={styles.map}
                initialRegion={{
                latitude: 23.81298811254991,
                longitude:  90.42189002037048,
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
                    title={items["address"]}
                    description={items["pType"]+" Post Code: "+items["postCode"]}
                    />
                )
                
                })}


            </MapView>

        </View>

        
    )
}

const styles = StyleSheet.create({
    
    map: {
		width: '100%',
		height: '60%',
    },
  
    suggestionBtn: {
		height: 20,
		// width: 50,
		backgroundColor: "#4287f5",
		borderRadius: 5,
		borderWidth: 1,
		margin: 1,
    },

	textInput:{
		
		marginRight: "10px",
		borderRadius:5,
		borderColor:"black",
		borderWidth: 1,
		width: "35%",
		textAlign: "center",
		marginRight: 10
		
	},

	findPlace:{
		alignItems: "center",
		backgroundColor: "#4d90fa", 
		width: 100, height: 30,
		justifyContent: "center",
		borderRadius: 10,
		margin: 5,
	},
  
  
  });
  