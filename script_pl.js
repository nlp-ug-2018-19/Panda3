var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = 'pl-PL';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var startButton = document.querySelector('button');

startButton.onclick = function() {
  recognition.start();
  console.log('Start speaking!');
}

// KEYWORDS
var Temperature = false;
let tempPattern = /temperatur(e|a|ę)/;
var Humidity = false;
let humPattern = /wilgo(ć|tno)/;
var Wind = false;
let windPattern = /wiatr|wietrznie|wieje/;
var Pressure = false;
let pressurePattern = /ciśnieni(e|a)/;
var Fog = false;
let fogPattern = /mgł(a|ę|y)/;
let City ="";
let owiePattern = /owie$/;
let awiePattern = /(?<!o)wie$/;
let nPattern = /(?<=(n|m))ie$/;
let achPattern = /(?<!ł)ach$/;
let lachPattern = /łach$/;
let awiuPattern = /awiu$/;
let szczyPattern = /szczy$/;
let kuPattern = /(?<=(k|g))u$/;
let niPattern = /(?<=(n|m))ii?$/;
let niuPattern = /niu$/;

var conversation = document.querySelector(".conversation");

recognition.onresult = function(event) {
  var utt = event.results[0][0].transcript;
  var linebreak = document.createElement("br");
  conversation.append('Użytkownik: ' + utt);
  conversation.appendChild(linebreak);
  console.log('Confidence: ' + event.results[0][0].confidence);
  var Words = utt.split(" ")
      console.log (Words)
      for (prop in Words) {
        console.log(Words[prop] + " " + (typeof (Words[prop])));
        if (tempPattern.test(Words[prop])) {
          Temperature = true 
        }
      };
      for (prop in Words) {
        if (humPattern.test(Words[prop])) {
          Humidity = true
        }
      };        
      for (prop in Words) {
        if (windPattern.test(Words[prop])) {
          Wind = true
        }
      };          
      for (prop in Words) {
        if (pressurePattern.test(Words[prop])) {
          Pressure = true
        }
      };        
      for (prop in Words) {
        if (fogPattern.test(Words[prop])) {
          Fog = true
        }
      };
      for (prop in Words) {
        for (item in Words[prop].split("")) {
          console.log((Words[prop])[item])
          if ((Words[prop])[item] == (Words[prop])[item].toUpperCase()) {
            City = Words[prop]
            if (owiePattern.test(City)) {
              cityCon = City.replace(owiePattern, 'ów')
              }
            else if (awiePattern.test(City)) {
              cityCon = City.replace(awiePattern, 'wa')
              }
            else if (nPattern.test(City)) {
              cityCon = City.replace(nPattern, '')
              }
            else if (achPattern.test(City)) {
              cityCon = City.replace(achPattern, 'e')
              }
            else if (lachPattern.test(City)) {
              cityCon = City.replace(lachPattern, 'ły')
              }              
            else if (awiuPattern.test(City)) {
              cityCon = City.replace(awiuPattern, 'aw')
              }              
            else if (szczyPattern.test(City)) {
              cityCon = City.replace(szczyPattern, 'szcz')
              }              
            else if (kuPattern.test(City)) {
              cityCon = City.replace(kuPattern, '')
              }
            else if (niPattern.test(City)) {
              cityCon = City.replace(niPattern, 'ia')
            }
            else if (niuPattern.test(City)) {
              cityCon = City.replace(niuPattern, 'ń')
            }
          }
        }
      };
      console.log("TEMP " + Temperature);
      console.log("HUM " + Humidity);
      console.log("CITY " + City)
    try {  
      let url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityCon + "&appid=a4b92e45ab61cfc3cb9be1af36127c2d";
      fetch(url)
      .then(response => response.json())
      .then(response => {
          if (Temperature == true) {
              useSpeechSynth("temperatura w " + City + " wynosi " + float2int((response.main.temp - 273.15)) + " stopnie Celsjusza")
              conversation.append("Weatherbot: " + "Temperatura w " + City + " wynosi " + float2int((response.main.temp - 273.15)) + "°C. ");
              var linebreak2 = document.createElement("br");
              conversation.appendChild(linebreak2);
              Temperature = false

          };
          if (Humidity == true) {
              useSpeechSynth("Wilgoć w " + City + " wynosi " + response.main.humidity + " procent")
              conversation.append("Weatherbot: " + "Wilgoć w " + City + " wynosi " + response.main.humidity + " procent.");
              var linebreak2 = document.createElement("br");
              conversation.appendChild(linebreak2);
              Humidity = false 
          };
          if ( Wind == true) {
            useSpeechSynth("Prędkość wiatru w " + City + " to " + response.wind.speed + " metrów na sekundę")
            conversation.append("Weatherbot: " + "Prędkość wiatru w " + City + " to " + response.wind.speed + " m/s.");
            var linebreak2 = document.createElement("br");
            conversation.appendChild(linebreak2);
            Wind = false 
        };
          if (Pressure == true) {
            useSpeechSynth("Ciśnienie w " + City + " wynosi " + response.main.pressure + "hektopaskali")
            conversation.append("Weatherbot: " + "Ciśnienie w " + City + " wynosi " + response.main.pressure + " hPa.");
            var linebreak2 = document.createElement("br");
            conversation.appendChild(linebreak2);
            Pressure = false 
        };
        if (Fog == true) {
          try {
            if (response.weather[1].description == "mist") {
              useSpeechSynth("W " + City + " jest mgła")
              conversation.append("Weatherbot: " + "W " + City + " jest mgła.");
            }
            else if (response.weather[1].description == "fog") {
              useSpeechSynth("W " + City + " jest mgła")
              conversation.append("Weatherbot: " + "W " + City + " jest mgła.");
            }
            else {
              useSpeechSynth("W " + City + " nie ma mgły")
              conversation.append("Weatherbot: " + "W " + City + " nie ma mgły.");
            }
        }
          catch (err) {
            useSpeechSynth("W " + City + " nie ma mgły")
            conversation.append("Weatherbot: " + "W " + City + " nie ma mgły.");
        }
          var linebreak2 = document.createElement("br");
          conversation.appendChild(linebreak2);
          Fog = false 
        };
          City = ""
      }
          )



  }
catch (err) {
  useSpeechSynth("Upewnij się, że mówisz wyraźnie i podano prawidłową nazwę miasta")
  conversation.append("Weatherbot: Upewnij się, że mówisz wyraźnie i podano prawidłową nazwę miasta.");
  var linebreak2 = document.createElement("br");
  conversation.appendChild(linebreak2);
}
}
function float2int (value) {
  return value | 0;
}


recognition.onspeechend = function() {
  recognition.stop();
}

var synth = window.speechSynthesis;

function useSpeechSynth(text) {
  var utterThis = new SpeechSynthesisUtterance(text);
  //synth.cancel();
  utterThis.lang = 'pl-PL';
  synth.speak(utterThis);
}
