import React, { useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, Image, Linking, Button, View } from 'react-native';
export default function Results({ navigation, route }) {
    const data = route.params.data
    const imgLink = route.params.imgLink
    const amazonURL = route.params.amazonURL
    const wikiURL = route.params.wikiURL
    const companyURL = route.params.companyURL
    const founders = route.params.founders
    const criticism = route.params.criticism
    const praise = route.params.praise

    //console.log(data)
    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: imgLink }} style={{ width: "100%", aspectRatio: 1 }} />
            <View>
                <Text><Text style={{ fontWeight: "bold" }}>Category:</Text> {data["Category"]}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Description:</Text> {data["Description"]}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Manufacturer:</Text> {data["Manufacturer"]}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Founders:</Text> {founders.join(", ")}</Text>
            </View>
            <View>
                <Text style={{ fontWeight: "bold" }}>:(</Text>
                {criticism.map((item, key) => (
                    <Text key={key}>{item}</Text>
                ))}
                <Text style={{ fontWeight: "bold" }}>:)</Text>
                {praise.map((item, key) => (
                    <Text key={key}>{item}</Text>
                ))}
            </View>

            <View>
                <Button title="Link Amazon" onPress={() => Linking.openURL(amazonURL)} />
                <Button title="Link Wikipedia" onPress={() => Linking.openURL(wikiURL)} />
                <Button title="Link Company Page" onPress={() => Linking.openURL(companyURL)} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: "white"
    },
});
