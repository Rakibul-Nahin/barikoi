import MapView, { Polyline, Marker } from 'react-native-maps';
import { Button, StyleSheet, View, Text } from 'react-native';
import { useState } from 'react';
import axios from 'axios';

var polyline = require('@mapbox/polyline');

export default function DemoView() {

	const API_KEY = "NDQyOToxSU1QVFhSSkVZ";

	const source = [23.815129340315583, 90.4256655995298];
	const destination = [23.780411328831853, 90.4072028319861];

	const urls = "https://barikoi.xyz/v1/api/route/"+API_KEY+"/"+source[1]+","+source[0]+";"+destination[1]+","+destination[0]+""

	const [waypoints, setWaypoints] = useState([]);
	const [colors, setColors] = useState([]);
	const [hints, setHints] = useState([]);

  const find_waypoints=()=>{

		axios({
			method: 'get',
			url: urls,
		})
		.then((res)=>{
			let polyString = res.data["routes"][0]["geometry"];
			polyString = polyline.decode(polyString);
			console.log(polyString.length);
			let x = [];
			for(let a of polyString){
				x.push({latitude: a[0], longitude: a[1]})
			}
			// console.log(x.length);
			setWaypoints(x)

			// hints

			let hint = [];
			for(let a of res.data["waypoints"]){
				polyString = a["hint"];
				polyString = polyline.decode(polyString);

				let y = [];
				for(let b of polyString){
				y.push({latitude: b[0], longitude: b[1]})
				}
				console.log(y.length);
				hint.push(y);
			}

			setHints(hint)

    })
    .catch((err)=>console.log(err))
	
  }

	const optimized_waypoints=()=>{
		console.log("on optimized route");
		var data = JSON.stringify({
			"api_key": "NDQyOToxSU1QVFhSSkVZ",
			"source": source[0]+", "+source[1],
			"destination": destination[0]+", "+destination[1],
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
		
		axios(config)
		.then(function (response) {
			JSON.stringify(response.data)
		
			let polyString = response.data["paths"][0]["points"];
			polyString = polyline.decode(polyString);
			console.log(polyString.length);
			let x = [];
			let c = []
			let i = 0;
			for(let a of polyString){
				x.push({latitude: a[0], longitude: a[1]})
				if(i==0){
					c.push("#f70519")
				}else if(i==polyString.length-1){
					c.push("#0519f7")
				}else{
					c.push("#29f705")
				}
				i++;
			}
			// console.log(x.length);


			setColors(c)
			setWaypoints(x)
		})
		.catch(function (error) {
			console.log(error);
		});
		
	}


  return(
	<View>
		<Button title='Press' onPress={()=>{
			// find_waypoints()
			optimized_waypoints()
		}}/>

		{/* {waypoints.map((item)=><Text>{item["latitude"]} {item["longitude"]}</Text>)} */}
		<MapView style={styles.map}>

			{waypoints.map((items, index) => {
				// console.log(items.length);
				return(
				<Marker
				key={index}
				coordinate={items}
				title={"waypoint "+index}
				description={""}
				pinColor={colors[index]}
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
    height: '90%',
  },
  
})

