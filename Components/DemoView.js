import MapView, { Polyline, Marker } from 'react-native-maps';
import { Button, StyleSheet, View, Text } from 'react-native';
import { useState } from 'react';
import Axios from 'axios';

export default function DemoView() {

  const API_KEY = "NDQyOToxSU1QVFhSSkVZ";

  const source = {"latitude": 23.745887831091718, "longitude": 90.37410782920075};
  const destination = {"latitude": 23.7504666993296, "longitude": 90.39535963206144};

  const [waypoints, setWaypoints] = useState([])

  const find_waypoints=()=>{

    let data = {
      "api_key": API_KEY,
      "source": "23.746086,90.37368",
      "destination": "23.746214,90.371654",
      "profile": "car",
    };

    console.log("clicked");
    Axios.post("https://barikoi.xyz/v2/api/route/optimized?api_key=NDQyOToxSU1QVFhSSkVZ",
      {
        header: {
          "content-type": "application/json"
        },
        "body": JSON.stringify(data)
      }
    ).then((res)=>{console.log(res);})
    .catch((err)=>console.log(err))
  }


  return(
    <View>
      <Button title='Press' onPress={()=>{find_waypoints()}}/>

      {/* {waypoints.map((item)=><Text>{item["latitude"]} {item["longitude"]}</Text>)} */}
      {/* <MapView style={styles.map}>

        {waypoints.map((items, index) => {
          console.log(items);
          return(
            <Marker
            key={index}
            coordinate={{"longitude": items[0], "latitude": items[1]}}
            title={"address"}
            description={"descirption"}
            />
          )
            
        })}

      </MapView> */}



    </View>
    
  )
  
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '70%',
  },
  
})

