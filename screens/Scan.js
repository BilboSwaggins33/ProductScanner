import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import cheerio from 'cheerio'
import companies from './companies'
import { getAPINews, getSentiment } from '../utils/newsapi';
import { ActivityIndicator } from 'react-native-paper';

export default function Scan({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false)
  
  function levenshteinDistance(str1, str2) {
    const track = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1, // deletion
          track[j - 1][i] + 1, // insertion
          track[j - 1][i - 1] + indicator, // substitution
        );
      }
    }
    return track[str2.length][str1.length];
  }


  const searchCompany = (str) => {
    var smallestValue = Object.keys(companies)[0]
    var cID = companies[Object.keys(companies)[0]]
    for (let key in companies) {
      //finding the closest company name on https://guide.ethical.org.au/ to the manufacturer of the product 
      if (levenshteinDistance(key, str) < levenshteinDistance(smallestValue, str)) {
        smallestValue = key
        cID = companies[key]
      }
    }
    return cID
  }

  useEffect(() => {
    (async () => {
      /* Get Camera permissions */
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      console.log(status)
      setHasPermission(status === 'granted');
    })();
  }, []);

  async function loadProductData(bcode) {
    /* Webscrape and get all information after scanning product */
    const searchUrl = "https://barcodelookup.com/" + bcode
    const amazonURL = "https://amazon.com/s?k=" + bcode + "&ref=nb_sb_noss"
    try {
      const response = await fetch(searchUrl)
      const text = await response.text();
      //using cheerio to webscrape barcodelookup because api costs money
      const $ = cheerio.load(text)
      var data = {}
      var imgLink = ""
      var companyURL = "https://google.com"
      $("div.product-text-label").each((i, c) => {
        //get basic product information using cheerio
        var category = $(c).clone().children().remove().end().text().replace(/\n/g, '').replace(/\s/g, '')
        category = category.substr(0, category.length - 1)
        var desc = $(c).find('span.product-text').text().replace(/\n/g, '')
        data[category] = desc
      })
      //get product image
      $("img#img_preview").each((i, c) => {
        imgLink = $(c).attr("src")
      })
      //webscrape wikipedia for more information on company
      let wikiresp = await fetch("https://en.wikipedia.org/w/index.php?search=~" + data["Manufacturer"].replace('/\s/g', '_') + "&title=Special:Search&profile=advanced&fulltext=1&ns0=1")
      let wikitext = await wikiresp.text()
      let $$ = cheerio.load(wikitext)      
      //this company url finder works, but only limited amount of requests, so keep it commented for now
      //fetch("https://companyurlfinder.com/cuf?companyName=" + data["Manufacturer:"] + "&api_key=3o5OfQAsF0Y7PgGN4cAD61nsrN8yaUmnirlvQs4P", { method: "GET" }).then(response => response.json())
      //.then(d => {
      //  companyURL = d.result.url
      // });
      //webscraping company ethics using parsed dictionary in companies.js
      var praise = []
      var criticism = []
      const $$$ = cheerio.load(await (await fetch("https://guide.ethical.org.au/company/?company=" + searchCompany(data["Manufacturer"]))).text())
      $$$("td.companyPraise > div > table > tbody > tr > td > a").each((i, c) => {
        praise.push($(c).text())
      })
      $$$("td.companyCriticism > div > table > tbody > tr > td > a").each((i, c) => {
        criticism.push($(c).text())
      })
      //use wikipedias fuzzy searching wikipedia to find closest related page to company name
      var wikiURL = "https://en.wikipedia.org" + $$("div.mw-search-result-heading").first().find("a").attr("href")
      wikiresp = await fetch(wikiURL)
      wikitext = await wikiresp.text()
      $$ = cheerio.load(wikitext)
      var leaders = []
      let curName = ""
      let numWords = 0
      //finding founders
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
      //finding comapny assets
      let full = $$('th > span > a:contains("Total assets")').parent().parent().parent().children().eq(1).text().trim()
      let numIndex = full.search(/\d/)
      let parenthesis = full.indexOf("(")
      let size = full.substr(numIndex, parenthesis - numIndex)

      //getting comapny articles
      let news = await getAPINews(data["Manufacturer"]);

      var total = 0
      var numArticles = 0
      for (let i = 0; i < news.length; i++) {
        let sentiment = (await getSentiment(news[i].title)).result.polarity
        if (sentiment != 0) {
          total += sentiment
          numArticles += 1
        }

      }
      //get overall sentiment score on company
      let score = total / numArticles
      setLoading(false)
      /* Navigate to Results with information */
      navigation.navigate("Results", { data, imgLink, amazonURL, wikiURL, leaders, praise, criticism, size, score, news })
    } catch (e) {
      console.log(e)
    }
  }


  const handleBarCodeScanned = ({ type, data }) => {
    /* Start Getting Product Information */
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
      {loading && <ActivityIndicator color="white" />}
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
