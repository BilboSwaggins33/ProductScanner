import React, { useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, Image, Linking, Button, View } from 'react-native';
export default function Results({ navigation, route }) {
    const data = route.params.data.data
    const imgLink = route.params.imgLink.imgLink
    const amazonURL = route.params.amazonURL.amazonURL
    const wikiURL = route.params.wikiURL.wikiURL
    const founders = route.params.founders
    console.log(data)
    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: imgLink }} style={{ width: "100%",aspectRatio:1 }} />
            <View>
                <Text><Text style={{fontWeight:"bold"}}>Category:</Text> {data["Category"]}</Text>
                <Text><Text style={{fontWeight:"bold"}}>Description:</Text> {data["Description"]}</Text>
                <Text><Text style={{fontWeight:"bold"}}>Manufacturer:</Text> {data["Manufacturer"]}</Text>
                <Text><Text style={{fontWeight:"bold"}}>Founders:</Text> {founders.join(", ")}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
            <Button title="Amazon" onPress={() => Linking.openURL(amazonURL)}>Amazon Link: {amazonURL}</Button>
            <Button title="Wikipedia" onPress={() => Linking.openURL(wikiURL)}>Wikipedia Link: {wikiURL}</Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding:10,
        backgroundColor:"white"
    },
});
