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
let tempPattern = /temperatur(e|a|ę)/
var Humidity = false;
let humPattern = /wilgo(ć|tno)/
let City ="";

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
        for (item in Words[prop].split("")) {
          console.log((Words[prop])[item])
          if ((Words[prop])[item] == (Words[prop])[item].toUpperCase()) {
            City = Words[prop]
          }
        }
      };
      console.log("TEMP " + Temperature);
      console.log("HUM " + Humidity);
      console.log("CITY " + City)

      let url = "https://api.openweathermap.org/data/2.5/weather?q=" + City + "&appid=a4b92e45ab61cfc3cb9be1af36127c2d";
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
          City = ""
      }
          )



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
