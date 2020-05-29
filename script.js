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

var conversation = document.querySelector(".conversation");

recognition.onresult = function(event) {
  var utt = event.results[0][0].transcript;
  var linebreak = document.createElement("br");
  conversation.append('You: ' + utt);
  conversation.appendChild(linebreak);
  console.log('Confidence: ' + event.results[0][0].confidence);
  cityName = utt;
    let url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=a4b92e45ab61cfc3cb9be1af36127c2d";
    fetch(url)
    .then(response => response.json())
    .then(response => {
        console.log(response)
        useSpeechSynth("Temperature in " + cityName + " is " + response.main.temp + " Kelvin");
        conversation.append("Weatherbot: " + "Temperature in " + cityName + " is " + response.main.temp + " Kelvin");
        var linebreak2 = document.createElement("br");
        conversation.appendChild(linebreak2);
    }
        )


  }



recognition.onspeechend = function() {
  recognition.stop();
}

var synth = window.speechSynthesis;

function useSpeechSynth(text) {
  var utterThis = new SpeechSynthesisUtterance(text);
  synth.cancel();
  utterThis.lang = 'en-US';
  synth.speak(utterThis);
}
