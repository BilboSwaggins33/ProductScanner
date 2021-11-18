import React, { useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, Image, Linking, Button, View } from 'react-native';
export default function Results({ navigation, route }) {
    const data = route.params.data.data
    const imgLink = route.params.imgLink.imgLink
    const amazonURL = route.params.amazonURL.amazonURL
    const wikiURL = route.params.wikiURL.wikiURL
    //console.log(data)
    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: imgLink }} style={{ width: 200, height: 200 }} />
            <View>
                <Text>{JSON.stringify(data)}</Text>
            </View>
            <Button title="Link Amazon" onPress={() => Linking.openURL(amazonURL)}>Amazon Link: {amazonURL}</Button>
            <Button title="Link Wikipedia" onPress={() => Linking.openURL(wikiURL)}>Wikipedia Link: {wikiURL}</Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 10
    },
});
