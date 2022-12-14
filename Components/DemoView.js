import MapView, { Polyline, Marker } from 'react-native-maps';
import { Button, StyleSheet, View, Text } from 'react-native';
import { useState } from 'react';
import axios from 'axios';

var polyline = require('@mapbox/polyline');

export default function DemoView() {

  const API_KEY = "NDQyOToxSU1QVFhSSkVZ";

  const source = {"latitude": 23.795754462858604, "longitude":  90.42396805116192};
  const destination = {"latitude": 23.785533081345847, "longitude": 90.39947866593133};

  const urls = "https://barikoi.xyz/v1/api/route/"+API_KEY+"/"+source["longitude"]+","+source["latitude"]+";"+destination["longitude"]+","+destination["latitude"]+""

  const [waypoints, setWaypoints] = useState([])

  const find_waypoints=()=>{

    var data = JSON.stringify({
			"api_key": "NDQyOToxSU1QVFhSSkVZ",
			"source": "23.746086,90.37368",
			"destination": "23.746214,90.371654",
			"profile": "car"
		});
		  
		// var config = {
		// method: 'post',
		// url: 'http://barikoi.xyz/v2/api/route/optimized?api_key=NDQyOToxSU1QVFhSSkVZ',
		// headers: { 
		// 	'Content-Type': 'application/json'
		// },
		// data : data
		// };
		  
		// axios(config)
		// .then(function (response) {
		// console.log(JSON.stringify(response.data));
		// })
		// .catch(function (error) {
		// console.log(error);
		// });

		// axios.post('http://barikoi.xyz/v2/api/route/optimized?api_key=NDQyOToxSU1QVFhSSkVZ',
		// 	{data},
		// 	{
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 		}
		// 	}
		// )
		// .then((res)=>console.log(res.data))
		// .catch((err)=>console.log(err.response.data))

    axios({
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
      console.log(x);
      setWaypoints(x)
    })
	
  }


  return(
    <View>
      <Button title='Press' onPress={()=>{find_waypoints()}}/>

      {/* {waypoints.map((item)=><Text>{item["latitude"]} {item["longitude"]}</Text>)} */}
      <MapView style={styles.map}>

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
    height: '90%',
  },
  
})

