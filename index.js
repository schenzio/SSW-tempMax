// Import stylesheets
import "./style.css";
//
const apiKey = "5c546389656e9425c3eb5ec97f1a0188";
const URL =
  "https://api.openweathermap.org/data/2.5/weather?APPID=" +
  apiKey +
  "&units=metric&q=";
var cityElems = Array.from(document.getElementsByClassName("citta"));
for (let elem of cityElems) {
  elem.onclick = () => display(elem.innerHTML);
}
document.getElementById("calcoloMedia").onclick = () => media();
document.getElementById("calcoloMassima").onclick = () => massima();

function doCity(city, callback) {
  //esegue chiamata ajax a open weather map apikey
  let promise = fetch(URL + city)
    .then(response => response.json(), error => alert(error))
    .then(data => callback(data));
    //il primo then ottiene l'oggetto json, il secondo gli applica il callback
  return promise;
}
async function display(city) {
  let t = await doCity(city, data => data.main.temp);
  let tMax = await doCity(city, data => data.main.temp_max);
  document.getElementById("risposta").innerHTML =
    "A " + city + " ci sono " + t + " gradi e " + tMax + " di massima";
}
async function massima() {
  //quando sono risolte tutte le promesse ottengo lista con le t max 
  let tempsMax = await Promise.all(
    //doCity è applicata a ogni città
    cityElems.map(cityElem =>
      doCity(cityElem.innerHTML, data => data.main.temp_max)
    )
  );
  //riduco l'array delle temp max al valore massimo
  var massimo = tempsMax.reduce((maxx, tempMax) => Math.max(tempMax, maxx));
  document.getElementById("massima").innerText = massimo;
}
async function media() {
  let temps = await Promise.all(
    cityElems.map(cityElem => doCity(cityElem.innerHTML, data => data.main.temp))
  );
  let somma = temps.reduce((somma, temp) => temp + somma);
  document.getElementById("media").innerText = somma / cityElems.length;
}