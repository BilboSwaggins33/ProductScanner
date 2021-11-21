import React from "react";
import { useState } from "react";
import { View, ScrollView, Button, Switch } from "react-native";
import { Divider, Title, Text } from "react-native-paper";
export default function Settings() {
  const [showArticles, setShowArticles] = useState(false)
  const [showCEO, setShowCEO] = useState(false)
  const [showEthics, setShowEthics] = useState(false)
  const [showCompanySizeRating, setShowCompanySizeRating] = useState(false)
  /* Displaying all company info settings */
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Title style={{ marginVertical: 20 }}>Settings</Title>
      <Divider />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
        <Switch value={showArticles} onValueChange={() => setShowArticles(!showArticles)} /><Text style={{ fontSize: 20 }}>   Show Articles</Text></View>
      <Divider />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
        <Switch value={showCEO} onValueChange={() => setShowCEO(!showCEO)} /><Text style={{ fontSize: 20 }}>   Show CEO</Text></View>
      <Divider />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
        <Switch value={showEthics} onValueChange={() => setShowEthics(!showEthics)} /><Text style={{ fontSize: 20 }}>   Show Product Ethics</Text></View>
      <Divider />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
        <Switch value={showCompanySizeRating} onValueChange={() => setShowCompanySizeRating(!showCompanySizeRating)} /><Text style={{ fontSize: 20 }}>   Show Company Size</Text></View>

    </ScrollView>
  );
}

