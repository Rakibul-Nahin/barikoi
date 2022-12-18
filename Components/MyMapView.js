import {useState, } from 'react';
import { Text, View, StyleSheet, TextInput, Image,
  Button , TouchableOpacity, ScrollView} 
from 'react-native';
import styles from './MyMapViewStyle';

import Constants from 'expo-constants';
import MapView, {Marker, Polyline} from "react-native-maps"
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Axios from "axios"

var polyline = require('@mapbox/polyline');

import closeImage from "../assets/close.png"

export default function MyMapView() {
    
    const API_KEY = "NDQyOToxSU1QVFhSSkVZ";
    const [source, setSource] = useState("North South University");
	// const [sCoord, setSCoord] = useState([{"latitude": 23.815129340315583, "longitude": 90.4256655995298}]); //NSU
	const [sCoord, setSCoord] = useState([{"latitude": 23.763691537172974, "longitude": 90.34360550102846}]); //NSU


	const [activeInput, setActiveInput] = useState(0);
	const [veiwOption, setViewOption] = useState(1);
	const [showSuggestions, setShowSuggestions] = useState("none");

	const [destination, setDestination] = useState("BRAC University");
	// const [dCoord, setDCoord] = useState([{"latitude": 23.780411328831853, "longitude": 90.4072028319861}]); //BRAC
	const [dCoord, setDCoord] = useState([{"latitude": 23.749582057132976, "longitude": 90.39444669729218}]); //BRAC
	
    const [places, setPlaces] = useState([]);
  	const [suggestions, setSuggestions] = useState([]);

	const [routeDetails, setRouteDetails] = useState({distance: "", duration: "", location: []});
	const [waypoints, setWaypoints] = useState([]);
	const [colors, setColors] = useState([]);



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


		// console.log(source, destination);

		const urls = "https://barikoi.xyz/v1/api/route/"+API_KEY+"/"+sCoord[0]["longitude"]+","+sCoord[0]["latitude"]+";"+dCoord[0]["longitude"]+","+dCoord[0]["latitude"]+""
		Axios({
			method: 'get',
			url: urls,
		})
		.then((res)=>{
			let polyString = res.data["routes"][0]["geometry"];
			// console.log(polyString);
			polyString = polyline.decode(polyString);
			let x = []
			for(let i=0; i<polyString.length; i++){
				if(i==0){
					x.push({latitude: polyString[i][0], longitude: polyString[i][1], colors:"#f70519", description: source})
				}else if(i==polyString.length-1){
					x.push({latitude: polyString[i][0], longitude: polyString[i][1], colors:"#0519f7", description: destination})

				}else{
					x.push({latitude: polyString[i][0], longitude: polyString[i][1], colors:"#29f705", description: "Waypoint "+i+1})
				}
			}
			// console.log(x);

			setPlaces([])
			setWaypoints(x)

			setRouteDetails({
				distance: parseFloat(res.data["routes"][0]["distance"]),
				duration: parseFloat(res.data["routes"][0]["duration"]),
			})
		})
		.catch((err)=>console.log(err.response.data))
	}


	const onOptimizedRoute=()=>{
		console.log("on optimized route");
		var data = JSON.stringify({
			"api_key": "NDQyOToxSU1QVFhSSkVZ",
			"source": sCoord[0]["latitude"]+", "+sCoord[0]["longitude"],
			"destination": dCoord[0]["latitude"]+", "+dCoord[0]["longitude"],
			"profile": "car"
		});
		
		var config = {
		method: 'post',
		url: 'https://barikoi.xyz/v2/api/route/optimized?api_key=NDQyOToxSU1QVFhSSkVZ',
		headers: { 
			'Content-Type': 'application/json'
		},
		data : data
		};
		
		Axios(config)
		.then(function (response) {
			let polyString = response.data["paths"][0]["points"];
			polyString = polyline.decode(polyString);
			
			let x = []
			// let c = []
			// let i = 0;
			// for(let a of polyString){
			// 	x.push({latitude: a[0], longitude: a[1]})
			// 	if(i==0){
			// 		c.push("#f70519")
			// 	}else if(i==polyString.length-1){
			// 		c.push("#0519f7")
			// 	}else{
			// 		c.push("#29f705")
			// 	}
			// 	i++;
			// }

			for(let i=0; i<polyString.length; i++){
				if(i==0){
					x.push({latitude: polyString[i][0], longitude: polyString[i][1], colors:"#f70519", description: source})
				}else if(i==polyString.length-1){
					x.push({latitude: polyString[i][0], longitude: polyString[i][1], colors:"#0519f7", description: destination})

				}else{
					x.push({latitude: polyString[i][0], longitude: polyString[i][1], colors:"#29f705", description: "Waypoint "+i+1})
				}
			}
			// console.log(x);

			setPlaces([])
			setWaypoints(x)

			setRouteDetails({
				distance: parseFloat(response.data["paths"][0]["distance"]),
				duration: parseFloat(response.data["paths"][0]["time"]),
			})

			x = 0
			for(let i=0; i<response.data["paths"][0]["instructions"].length; i++){
				x+= response.data["paths"][0]["instructions"][i]["time"]
			}
			console.log("total time is ", x);
			// console.log(response.data["paths"][0]["instructions"][0]["time"]);

		})
		.catch(function (error) {
			console.log(error);
		});
	}

	// Views

	const SearchPlaceView=()=>(
		<View>
			<Text style={styles.title}>Search a place</Text>
			<Text style={{color: "white", fontSize: 15}}>Search location: {source}</Text>
			<View style={{flexDirection: "row", margin: 5, justifyContent: "center", alignItems: "center"}}>
            	<Text style={{ marginRight: 10, color: "white", fontSize: 15, fontWeight: "700"}}>Place Name </Text>
				<TextInput 
					style={styles.textInput}
					placeholder="source place"
					onChangeText={(text)=>{
						setActiveInput(1)
						onSearchHandler(1, text)
					}}
					onFocus={()=>{setShowSuggestions("flex")}}
				/>

				<TouchableOpacity
					onPress={()=>{
						find_place_request()
						setShowSuggestions("none")
					}}
					style={styles.findPlace}
				>
					<Text style={{color: "white", fontSize: 15, fontWeight: "700"}}>Find Place</Text>
				</TouchableOpacity>

            </View>
		</View>
	)

	const SearchDirectionView=()=>(
		<View>
			<Text style={styles.title}>Find Route</Text>
			<Text style={{color: "white", fontSize: 15}}>Location 1: {source}</Text>
			<Text style={{color: "white", fontSize: 15}}>Location 2: {destination}</Text>
			<Text style={{color: "white", fontSize: 15}}>Distance: {routeDetails["distance"]/1000}km / {routeDetails["distance"]}m</Text>
			<Text style={{color: "white", fontSize: 15}}>Duration: {routeDetails["duration"]/60}minutes / {routeDetails["duration"]} milliseconds</Text>

			<View style={{flexDirection: "row", margin: 5,  alignItems: "center", flexWrap: 'wrap'}}>
				
				<Text style={{ margin: 10, color: "white", fontSize: 20, fontWeight: "700"}}>Place Name: </Text>
				<TextInput 
					style={styles.textInput}
					placeholder="source place"
					onChangeText={(text)=>{
						setActiveInput(1)
						onSearchHandler(1, text)
					}}
					onFocus={()=>{setShowSuggestions("flex")}}
				/>
				
				<Text style={{ margin: 10, color: "white", fontSize: 20, fontWeight: "700"}}>Destination Name: </Text>
				<TextInput 
					style={styles.textInput}
					placeholder="Destination place"
					onChangeText={(text)=>{
						setActiveInput(2)
						onSearchHandler(2, text)
					}}
					onFocus={()=>{setShowSuggestions("flex")}}
				/>
				<TouchableOpacity
					onPress={()=>{
						onFindRoute()
						// onOptimizedRoute()
						setShowSuggestions("none")
					}}
					style={[styles.findPlace, {width: "100%"}]}
				>
					<Text style={{color: "white", fontSize: 25, fontWeight: "700"}}>Find route</Text>
				</TouchableOpacity>
			</View>
			
			
		</View>
	)
	
	const onlyMapView=()=>(
		<View>
			<Text style={styles.title}>Find Route</Text>
			<Text style={{color: "white", fontSize: 15}}>Location 1: {source}</Text>
			<Text style={{color: "white", fontSize: 15}}>Location 2: {destination}</Text>
			<Text style={{color: "white", fontSize: 15}}>Distance: {routeDetails["distance"]/1000}km / {routeDetails["distance"]}m</Text>
			<Text style={{color: "white", fontSize: 15}}>Duration: {routeDetails["duration"]/60000}minutes / {routeDetails["duration"]} milliseconds</Text>
		</View>
	)

	const ShowView=()=>{
		if(veiwOption == 1){
			return SearchPlaceView()
		}else if(veiwOption == 2){
			return SearchDirectionView()
		}else if(veiwOption == 3){
			return onlyMapView()
		}
	}



    return(
        <View style={{
			flex: 1,
			flexDirection: "column",
			alignItems: "center",
		}}>

			<View style={styles.searchOptions}>
				<TouchableOpacity style={styles.searchOptionsBtn}
					onPress={()=>{
						setViewOption(1)
						setShowSuggestions("flex")
					}}
				>
					<Text style={{color: "white", fontSize: 15}}>Search Place</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.searchOptionsBtn}
					onPress={()=>{
						setViewOption(2)
						setShowSuggestions("flex")
					}}
				>
					<Text style={{color: "white", fontSize: 15}}>Search Route</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.searchOptionsBtn}
					onPress={()=>{
						setViewOption(3)
						setShowSuggestions("none")
					}}
				>
					<Text style={{color: "white", fontSize: 15}}>Map Only</Text>
				</TouchableOpacity>

			</View>

			<View>
				<Text style={{color: "white", fontSize: 10,}}>Active {activeInput}</Text>

				{ShowView()}
				<ScrollView 
					style={[styles.suggestionView, {display: showSuggestions}]}
					contentContainerStyle = {{alignItems: "center"}}
				
				>
					<TouchableOpacity
						style={{width:20, height:20, position: "absolute", left:10, top: 10}}
						onPress={()=>{setShowSuggestions("none")}}
					>
						<Image 
							style={{
								width:20, height:20
							}}
							source={closeImage} 
						/>
					</TouchableOpacity>

					{suggestions.map((item)=>{
						return (
							<TouchableOpacity
								style={styles.suggestionBtn}
								onPress={()=>onSuggestionPress(item)}
							>
								<Text style={{color: "white", marginLeft: 10,}}>{item["address"]}</Text>
							</TouchableOpacity>
						)
					})}
							

				</ScrollView>
				
			</View>

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
				// console.log(items);
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
					// console.log("my log",routeDetails["location"].length);
					return(
						<Marker
							key={index}
							coordinate={{"latitude": items["latitude"], "longitude": items["longitude"]}}
							title={items["description"]}
							description={""}
							pinColor={items["colors"]}
						/>
					)
					
				})}

				<Polyline
					coordinates={waypoints}
					strokeColor="#000"
					strokeWidth={6}
				/>


			</MapView>

        </View>

        
    )
}

  