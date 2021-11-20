import React, { useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, Image, Linking, View } from 'react-native';
import { Title,Button, Card, Paragraph, Avatar, List } from 'react-native-paper';
var conversions = {
    "million":1000000,
    "billion":1000000000,
    "thousand":1000
}

export default function Results({ navigation, route }) {
    const data = route.params.data
    const imgLink = route.params.imgLink
    const amazonURL = route.params.amazonURL 
    const wikiURL = route.params.wikiURL
    const leaders = route.params.leaders
    const size = route.params.size
    const news = route.params.news
    const score = route.params.score
    const criticism = route.params.criticism
    const praise = route.params.praise
    const companyURL = route.params.companyURL    


    function getSize(){
        if(size.includes("billion")){
            return "Large Enterprise"
        }
        else if(size.includes("million")){
            return 'Mid-Market Enterprise'
        }
        else{
            return "Small Business"
        }
    }
    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: imgLink }} style={{ width: "100%",aspectRatio:1,borderWidth:5,borderColor:"#eee",marginBottom:15 }} />
            <Title>Basic Information</Title>
                <Text><Text style={{fontWeight:"bold"}}>Category:</Text> {data["Category"]}</Text>
                <Text><Text style={{fontWeight:"bold"}}>Description:</Text> {data["Description"]}</Text>
                <Text><Text style={{fontWeight:"bold"}}>Manufacturer:</Text> {data["Manufacturer"]}</Text>
                <Text><Text style={{fontWeight:"bold"}}>Leaders:</Text> {leaders.join(", ")}</Text>
                <Text><Text style={{fontWeight:"bold"}}>Company Size:</Text> ${size} - {getSize()}</Text>
            <Title style={{marginTop:20}}>Company Related Articles</Title>
            <Text><Text style={{fontWeight:'bold'}}>Positivity Rating:</Text> {score*100}%</Text>
            {news.map((article,index)=>(
                 <Card key={index} style={{marginVertical:10,borderWidth:3,borderColor:"#eee"}}>
                 <Card.Title title={article.title} subtitle={article.description}/>
                 
                 <Card.Cover source={{ uri: article.urlToImage }} />
                 <Card.Actions style={{justifyContent:'space-between'}}>
                     
                     <Text>By {article.author}</Text>
                   <Button mode="outlined" onPress={()=>Linking.openURL(article.url)} color="black">Visit</Button>
                 </Card.Actions>
               </Card>
            ))}
            
            <View>
                <Title>Company Actions :(</Title>
                {criticism.map((item, key) => (
                     <List.Item
                     key={key}
                     description="Negative"
                     title={item}
                     left={props => <List.Icon {...props} icon="cancel" />}
                   />
                ))}
                <Text style={{ fontWeight: "bold" }}>:)</Text>
                {praise.map((item, key) => (
                    <List.Item
                    key={key}
                    description="Positive"
                    title={item}
                    left={props => <List.Icon {...props} icon="check" />}
                  />
                ))}{/* format ui and expand button*/}
            </View>
            <Title style={{marginTop:20}}>Links</Title>
            <View style={{flexDirection:'row',justifyContent:"space-between"}}>
            <Button color="blue" mode="contained" onPress={() => Linking.openURL(amazonURL)}>Amazon</Button>
            <Button mode="contained" color="blue" onPress={() => Linking.openURL(wikiURL)}>Wikipedia</Button>
            <Button mode="contained" color="blue"  onPress={() => Linking.openURL(companyURL)}>Company</Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "white"
    },
});
