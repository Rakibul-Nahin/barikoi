import {useState, } from 'react';
import { Text, View, StyleSheet, TextInput, 
  Button , TouchableOpacity, ScrollView} 
from 'react-native';
import Constants from 'expo-constants';
import MapView, {Marker, Polyline} from "react-native-maps"
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Axios from "axios"

var polyline = require('@mapbox/polyline');

export default function MyMapView() {
    
    const API_KEY = "NDQyOToxSU1QVFhSSkVZ";
    const [source, setSource] = useState("Burger Lab");
	const [sCoord, setSCoord] = useState([]);

	const [activeInput, setActiveInput] = useState(0)

	const [destination, setDestination] = useState("BRAC University")
	const [dCoord, setDCoord] = useState([]);

    const [places, setPlaces] = useState([]);
  	const [suggestions, setSuggestions] = useState([]);

	const [waypoints, setWaypoints] = useState([])



  const find_place_request=()=>{
    // console.log("place name: ", placeName);
	let x = (activeInput == 1) ? source : destination
    Axios.get(
      "https://barikoi.xyz/v1/api/search/autocomplete/"+API_KEY+"/place?q="+x
    )
    .then( (res)=>{setPlaces(res.data["places"]);} )
    // .then( (res)=>{console.log(res.data["places"]);} )
    .catch( (err)=>{console.log(err);} )
  }

  const onSearchHandler=(number, text)=>{
	if(number ==1){
		setSource(text)
	}else{
		setDestination(text)
	}

    let searchValue = text;
	// console.log(searchValue);
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
    // console.log("Suggestion press");
	if(activeInput == 1){
		setSCoord([item])
		setSource(item["address"]);
	}else{
		setDestination(item["address"]);
		setDCoord([item])
	}
    setPlaces([item])
  }

  const onFindRoute=()=>{
	console.log("Pressed find route");
	console.log(sCoord);
	console.log(dCoord);

	let source = {"latitude": sCoord[0]["latitude"], "longitude":  sCoord[0]["longitude"]};
  	let destination = {"latitude": dCoord[0]["latitude"], "longitude":  dCoord[0]["longitude"]};

	console.log(source, destination);


	const urls = "https://barikoi.xyz/v1/api/route/"+API_KEY+"/"+source["longitude"]+","+source["latitude"]+";"+destination["longitude"]+","+destination["latitude"]+""
	Axios({
		method: 'get',
		url: urls,
	})
	.then((res)=>{
		let polyString = res.data["routes"][0]["geometry"];
		console.log(polyString);
		polyString = polyline.decode(polyString);
		let x = []
		for(let a of polyString){
			x.push({latitude: a[0], longitude: a[1]})
		}
		// console.log(x);

		setPlaces([])
		setWaypoints(x)
	})
	.catch((err)=>console.log(err.response.data))
  }



    return(
        <View style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>

            <Text style={{fontSize: 25}}>Search a place</Text>

			<Text>Active {activeInput}, source text: {source}, destination text: {destination}</Text>
            
            {/* find place view */}
            <View style={{flexDirection: "row", margin: 5,}}>
            	<Text style={{ marginRight: 10}}>Source Name: </Text>
				<TextInput 
					style={styles.textInput}
					placeholder="source place"
					onChangeText={(text)=>{
						setActiveInput(1)
						onSearchHandler(1, text)
					}}
				/>

				<TouchableOpacity
					onPress={()=>{find_place_request()}}
					style={styles.findPlace}
				>
					<Text>Find Place</Text>
				</TouchableOpacity>

            </View>

			<View style={{flexDirection: "row", margin: 5}}>
            	<Text style={{ marginRight: 10}}>Destination Name: </Text>
				<TextInput 
					style={styles.textInput}
					placeholder="Destination place"
					onChangeText={(text)=>{
						setActiveInput(2)
						onSearchHandler(2, text)
					}}
				/>
				<TouchableOpacity
					onPress={()=>{onFindRoute()}}
					style={styles.findPlace}
				>
					<Text>Find route</Text>
				</TouchableOpacity>
				
            </View>
                
            

            {/* suggestion view */}
            <ScrollView style={styles.suggestionView}>
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

				{waypoints.map((items, index) => {
					console.log(items);
					return(
						<Marker
							key={index}
							coordinate={items}
							title={"waypoint "+index}
							description={""}
						/>
					)
					
				})}

				<Polyline
					coordinates={waypoints}
					strokeColor="#000"
					strokeWidth={3}
				/>


            </MapView>

        </View>

        
    )
}

const styles = StyleSheet.create({
    
    map: {
		width: '100%',
		height: '62%',
    },
  
	suggestionView:{
		width: "100%", 
		height: 120, 
		borderColor: "black", 
		borderWidth: 1, 
		borderRadius: 5
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
		marginRight: 5
		
	},

	findPlace:{
		alignItems: "center",
		backgroundColor: "#4d90fa", 
		width: 100, height: 30,
		justifyContent: "center",
		borderRadius: 10,
	},
  
  
  });
  