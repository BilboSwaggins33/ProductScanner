import axios from "axios"

/* Get all news articles */
export async function getAPINews(topic){
  const promise = new Promise((resolve, reject)=>{
    axios({
      method: "get",
      url: "https://newsapi.org/v2/everything?qInTitle=" + topic + "&sortBy=popularity&apiKey=19c73dfd439e44bda32df963064b8872"
    }).then((response) => {
      resolve(response.data.articles);
    }, (error) => {
      reject(error);
    });
  })
  return promise;
}
/* Call to a sentiment analysis API */
export async function getSentiment(line){
  const promise = new Promise((resolve, reject)=>{
    axios({
      method: "post",
      url: "https://sentim-api.herokuapp.com/api/v1/",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      data: {
        "text": line
      }
    }).then((response) => {
      resolve(response.data);
    }, (error) => {
      reject(error);
    })
  })
  return promise;
}

