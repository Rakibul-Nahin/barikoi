import { StyleSheet } from "react-native";
const styles = StyleSheet.create( {

	searchOptions:{
		flexDirection: "row",
		alignItems: "flex-start",
		marginTop: 5,
	},

	searchOptionsBtn: {
		width: "32%",
		height: 40,
		backgroundColor: "#40a9f5",
		borderRadius: 10,
		borderColor: "white",
		borderWidth: 2,
		justifyContent: "center",
		alignItems: "center",

	},

    title:{
        fontSize: 25, 
        fontWeight:"700", 
        color: "white", 
        alignSelf: 'center',
        textShadowOffset:{width:-5, height:3},
        textShadowColor: "rgba(246, 245, 247, 0.7)",
        textShadowRadius: 5
    },
    
    map: {
		width: '100%',
		height: '100%',
    },
  
	suggestionView:{
		borderRadius: 5,
        backgroundColor: "black",
        maxHeight: 400,
        marginBottom : 95
	},

    suggestionBtn: {
        width: "90%", height: 42,
        justifyContent: "center",
		// backgroundColor: "#4287f5",
		backgroundColor: "#932dfa",
		borderRadius: 5,
		borderWidth: 1,
		marginTop: 7,
    },

	textInput:{
		
		marginRight: "10px",
		borderRadius:5,
		borderColor:"white",
		borderWidth: 1,
		width: "40%",
		textAlign: "center",
		marginRight: 5,
        backgroundColor: "#e2e1e3",
        color: "black",
        height: 30,
	},

	findPlace:{
		alignItems: "center",
		backgroundColor: "#4d90fa", 
		width: 100, height: 35,
		justifyContent: "center",
		borderRadius: 10,
	},
  
  
})



export default styles;