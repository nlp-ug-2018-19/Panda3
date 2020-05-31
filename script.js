var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var startButton = document.querySelector('button');

startButton.onclick = function() {
  recognition.start();
  console.log('Start speaking!');
}

// KEYWORDS
var Temperature = false;
var Humidity = false;
var Wind = false;
var Weather = false;
var Pressure = false;
var Fog = false;
let City ="";

var conversation = document.querySelector(".conversation");

recognition.onresult = function(event) {
  var utt = event.results[0][0].transcript;
  var linebreak = document.createElement("br");
  conversation.append('You: ' + utt);
  conversation.appendChild(linebreak);
  console.log('Confidence: ' + event.results[0][0].confidence);
  var Words = utt.split(" ")
      console.log (Words)
      for (prop in Words) {
        if (Words[prop] == "temperature") {
          Temperature = true 
        }
      };
      for (prop in Words) {
        if (Words[prop] == "humidity") {
          Humidity = true
        }
      };
      for (prop in Words) {
        if (Words[prop] == "wind") {
          Wind = true
        }
      };
      for (prop in Words) {
        if (Words[prop] == "weather") {
          Weather = true
        }
      };
      for (prop in Words) {
        if (Words[prop] == "pressure") {
          Pressure = true
        }
      };
      for (prop in Words) {
        if ((Words[prop] == "fog") || (Words[prop] == "mist")) {
          Fog = true
        }
      };
      //Find the city
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
    try {
      let url = "https://api.openweathermap.org/data/2.5/weather?q=" + City + "&appid=a4b92e45ab61cfc3cb9be1af36127c2d";
      fetch(url)
      .then(response => response.json())
      .then(response => {
          if (Temperature == true) {
              useSpeechSynth("temperature in " + City + " is " + float2int((response.main.temp - 273.15)) + " degrees Celsius")
              conversation.append("Weatherbot: " + "Temperature in " + City + " is " + float2int((response.main.temp - 273.15)) + "°C. ");
              var linebreak2 = document.createElement("br");
              conversation.appendChild(linebreak2);
              Temperature = false

          };
          if (Humidity == true) {
              useSpeechSynth("humidity in " + City + " is " + response.main.humidity + " percent")
              conversation.append("Weatherbot: " + "Humidity in " + City + " is " + response.main.humidity + " percent.");
              var linebreak2 = document.createElement("br");
              conversation.appendChild(linebreak2);
              Humidity = false 
          };

          if ( Wind == true) {
            useSpeechSynth("the speed of the wind in " + City + " is " + response.wind.speed + " meters per second")
            conversation.append("Weatherbot: " + "The speed of the wind in " + City + " is " + response.wind.speed + " m/s.");
            var linebreak2 = document.createElement("br");
            conversation.appendChild(linebreak2);
            Wind = false 
        };
          if ( Weather == true) {
            useSpeechSynth("the general weather in " + City + " is " + response.weather[0].description)
            conversation.append("Weatherbot: " + "The general weather in " + City + " is: " + response.weather[0].description + ".");
            var linebreak2 = document.createElement("br");
            conversation.appendChild(linebreak2);
            Weather = false 
        };
          if (Pressure == true) {
            useSpeechSynth("the atmospheric pressure in " + City + " is " + response.main.pressure + "hectopascals")
            conversation.append("Weatherbot: " + "The atmospheric pressure in " + City + " is: " + response.main.pressure + " hPa.");
            var linebreak2 = document.createElement("br");
            conversation.appendChild(linebreak2);
            Pressure = false 
        };
        if (Fog == true) {
          try {
            if (response.weather[1].description == "mist") {
              useSpeechSynth("there is mist in " + City)
              conversation.append("Weatherbot: " + "There is mist in " + City + ".");
            }
            else if (response.weather[1].description == "fog") {
              useSpeechSynth("there is fog in " + City)
              conversation.append("Weatherbot: " + "There is fog in " + City + ".");
            }
            else {
              useSpeechSynth("there is no fog or mist in " + City)
              conversation.append("Weatherbot: " + "There is no fog or mist in " + City + ".");
            }
          }
          catch(err) {
            useSpeechSynth("there is no fog or mist in " + City)
            conversation.append("Weatherbot: " + "There is no fog or mist in " + City + ".");
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
  useSpeechSynth("Please make sure you speak clearly and use the right city name")
  conversation.append("Weatherbot: Please make sure you speak clearly and use the right city name.");
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
  utterThis.lang = 'en-US';
  synth.speak(utterThis);
}
