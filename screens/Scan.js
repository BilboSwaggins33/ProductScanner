import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import cheerio from 'cheerio'
import { children } from 'cheerio/lib/api/traversing';

export default function Scan({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  //const [forward, setForward] = useState(true)

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  async function loadProductData(bcode) {
    const searchUrl = "https://barcodelookup.com/" + bcode
    const amazonURL = "https://amazon.com/s?k=" + bcode + "&ref=nb_sb_noss"
    try {
      const response = await fetch(searchUrl)
      const text = await response.text();
      const $ = cheerio.load(text)
      console.log("worked!")
      var data = {}
      var imgLink = ""
      $("div.product-text-label").each((i, c) => {
        //console.log($(c).clone().children().remove().end().text().replace(/\n/g, ''))
        var category = $(c).clone().children().remove().end().text().replace(/\n/g, '')
        var desc = $(c).find('span.product-text').text().replace(/\n/g, '')
        //console.log($(c).find('span.product-text').text())
        data[category] = desc
      })
      $("img#img_preview").each((i, c) => {
        imgLink = $(c).attr("src")
      })
      navigation.navigate("Results", { data: { data }, imgLink: { imgLink }, amazonURL: { amazonURL } })
    } catch (e) {
      console.log(e)
    }
  }

  const handleBarCodeScanned = ({ type, data }) => {
    console.log("scanned")
    setScanned(true);
    loadProductData(data)
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
