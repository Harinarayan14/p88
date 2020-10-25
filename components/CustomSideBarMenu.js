import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { DrawerItems } from "react-navigation-drawer";
import firebase from "firebase";
import {Avatar} from "react-native-elements"
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import CustomButton from "./CustomButton";

export default class CustomSideBarMenu extends Component {
  state = {
    userId : firebase.auth().currentUser.email,
    image: null,
    name: "",
    docId : ""
   };

   
   selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
       allowsEditing: true,
       aspect: [4, 3],
       quality: 1,
    });
    console.log(uri);
    if (!cancelled){
     this.uploadImage(uri,this.state.userId);
    } 
  }

  uploadImage=async(uri,userId)=>{
     var response = await fetch(uri);
     var blob = await response.blob();
     var ref = firebase.storage().ref().child("user_profile/"+userId)
     return ref.put(blob).then((response)=>{
       this.fetchImage(userId);
     })
  }

  fetchImage=(userId)=>{
    var storageRef = firebase.storage().ref().child("user_profile/"+ userId);
    storageRef.getDownloadURL().then((url)=>{
       this.setState({
          image:url
       }).catch((error)=>{
         console.log(error);
         this.setState({
           image:""
         })
       })
    })
  }

  updateProfilePicture=(uri)=>{
    db.collection('users').doc(this.state.docId).update({
      image : uri
    })
  }

  getUserProfile(){
    db.collection('users')
    .where('email_id','==',this.state.userId)
    .onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.setState({
          name : doc.data().first_name + " " + doc.data().last_name,
          docId : doc.id,
          image : doc.data().image
        })
      })
    })
  }


componentDidMount(){
 this.getUserProfile();
 this.fetchImage(this.state.userId);

}
  render() {
    return (
      <View style={styles.container}>
        <View style={{flex:0.5,borderColor:'red',borderWidth:2,alignItems:'center',backgroundColor:'orange'}}>

<Avatar
    rounded
    source={{
      uri:
        this.state.image
      }}
    size="medium"

     overlayContainerStyle={{backgroundColor: 'white'}}
     onPress={() => this.selectPicture()}
     activeOpacity={0.7}
     containerStyle={{flex:0.75,width:'40%',height:'20%', marginLeft: 20, marginTop: 30,borderRadius:40}}
  />


<Text style = {{fontWeight:'100',fontSize:20,paddingTop:10,}}> {this.state.name}</Text>

</View>
        <View style={styles.upperContainer}>

          <DrawerItems {...this.props} />
        </View>
        <View style={styles.lowerContainer}>
          <CustomButton
            title={"Log Out"}
            style={styles.button}
            titleStyle={styles.buttonText}
            onPress={() => {
              this.props.navigation.navigate("Login");
              firebase.auth().signOut();
            }}
          />
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  upperContainer: {
    flex: 0.8,
    paddingTop: 30
  },
  lowerContainer: {
    flex: 0.2,
    justifyContent: "flex-end",
    paddingBottom: 30
  },
  button: {
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 0,
    padding: 10,
    shadowColor: "#fff",
    elevation: 0
  },
  buttonText: {
    fontWeight: "bold",
    color: "#000"
  }
});

