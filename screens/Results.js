import React, { useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, Image } from 'react-native';
export default function Results({ navigation, route }) {
    const data = route.params.data.data
    const imgLink = route.params.imgLink.imgLink
    console.log(imgLink)
    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: imgLink }} style={{ width: 200, height: 200 }} />
            <Text>{data}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 10
    },
});
