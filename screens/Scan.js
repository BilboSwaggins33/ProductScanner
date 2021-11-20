

import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import cheerio from 'cheerio'
import companies from './companies'
import { getAPINews, getSentiment } from '../utils/api';
import { ActivityIndicator } from 'react-native-paper';

export default function Scan({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);
const [loading,setLoading]=useState(false)
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      console.log(status)
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
        var category = $(c).clone().children().remove().end().text().replace(/\n/g, '').replace(/\s/g, '')
        category = category.substr(0, category.length - 1)
        var desc = $(c).find('span.product-text').text().replace(/\n/g, '')
        //console.log($(c).find('span.product-text').text())
        data[category] = desc
      })
      $("img#img_preview").each((i, c) => {
        imgLink = $(c).attr("src")
      })
      let wikiresp = await fetch("https://en.wikipedia.org/w/index.php?search=~" + data["Manufacturer"].replace('/\s/g', '_') + "&title=Special:Search&profile=advanced&fulltext=1&ns0=1")
      let wikitext = await wikiresp.text()
      let $$ = cheerio.load(wikitext)
      var wikiURL = "https://en.wikipedia.org" + $$("div.mw-search-result-heading").first().find("a").attr("href")
      wikiresp = await fetch(wikiURL)
      wikitext = await wikiresp.text()
      $$ = cheerio.load(wikitext)
      var leaders = []
      let curName = ""
      let numWords = 0
      $$('th > div:contains("Key people")').parent().parent().children().eq(1).contents().map(function () {

        let title = $$(this).text()
        if (title.trim().length > 0 && !title.includes("[")) {
          curName += (numWords == 1 ? " " : "") + title
          numWords += 1
        }
        if (numWords == 2) {
          leaders.push(curName)
          curName = ""
          numWords = 0
        }
      })
      let full = $$('th > span > a:contains("Total assets")').parent().parent().parent().children().eq(1).text().trim()
      let numIndex = full.search(/\d/)
      let parenthesis = full.indexOf("(")
      let size = full.substr(numIndex, parenthesis - numIndex)
      
      let news = await getAPINews(data["Manufacturer"]);
      console.log(news)

      var badNews = []
      var total = 0
      var numArticles = 0
      for (let i = 0; i < news.length; i++) {
        let sentiment = (await getSentiment(news[i].title)).result.polarity
        if(sentiment!=0){
          if(sentiment<0){
            badNews.push(news[i])
          }
          total += sentiment
          numArticles+=1
        }
        
      }
      let score = total/numArticles
      setLoading(false)
      navigation.navigate("Results", { data, imgLink, amazonURL, wikiURL, leaders, size,score,news:badNews })
    } catch (e) {
      console.log(e)
    }
  }


  const handleBarCodeScanned = ({ type, data }) => {
    console.log("scanned")
    setLoading(true)
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
        onBarCodeScanned={loading ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {loading && <ActivityIndicator color="white"/>}
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
