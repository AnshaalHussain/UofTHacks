// import axios from 'axios'
// import {useState, useEffect} from "react"
// function App() {
// axios.get("https://api.covid19tracker.ca/summary")
// .then((response) => console.log("RESPONSE", response))
// .catch(error => console.log("ERROR", error))
//   return (
//     <div>

//     </div>
//   );
// }

// export default App;

// import React, { Component, useEffect, useState } from "react";
// import axios from "axios";
// import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
// import CurrentLocation from './Map';
// const mapStyles = {
//   width: "75%",
//   height: "600px",
// };

// export class MapContainer extends Component {
//   state = {
//     showingInfoWindow: false, // Hides or shows the InfoWindow
//     activeMarker: {}, // Shows the active marker upon click
//     selectedPlace: {}, // Shows the InfoWindow to the selected place upon a marker
//   };
//   onMarkerClick = (props, marker, e) =>
//     this.setState({
//       selectedPlace: props,
//       activeMarker: marker,
//       showingInfoWindow: true,
//     });

//   onClose = (props) => {
//     if (this.state.showingInfoWindow) {
//       this.setState({
//         showingInfoWindow: false,
//         activeMarker: null,
//       });
//     }
//   };
//   render() {
//     return (
//       // <Map
//       //   google={this.props.google}
//       //   zoom={14}
//       //   style={mapStyles}
//       //   initialCenter={
//       //     {
//       //       lat: -1.2884,
//       //       lng: 36.8233
//       //     }
//       //   }
//       // >
//         <CurrentLocation
//         centerAroundCurrentLocation
//         google={this.props.google}
//       >
//         <Marker
//           onClick={this.onMarkerClick}
//           name={'Current Location'}
//         />
//         <InfoWindow
//           marker={this.state.activeMarker}
//           visible={this.state.showingInfoWindow}
//           onClose={this.onClose}
//         >
//           <div>
//             <h4>{this.state.selectedPlace.name}</h4>
//           </div>
//         </InfoWindow>
//         </CurrentLocation>
//       // </Map>
//     );
//   }
// }

// export default GoogleApiWrapper({
//   apiKey: `${process.env.REACT_APP_API_KEY_GOOGLE_MAPS}`,
// })(MapContainer);

// https://rapidapi.com/fyhao/api/text-sentiment-analysis-method/
import { useRef, useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./App.css";
import axios from "axios";
//import microPhoneIcon from "./microphone.svg";

function App() {
  const commands = [
    {
      command: "open *",
      callback: (website) => {
        window.open("http://" + website.split(" ").join(""));
      },
    },
    {
      command: "change background colour to *",
      callback: (color) => {
        document.body.style.background = color;
      },
    },
    {
      command: "reset",
      callback: () => {
        handleReset();
      },
    },
    ,
    {
      command: "reset background colour",
      callback: () => {
        document.body.style.background = `rgba(0, 0, 0, 0.8)`;
      },
    },
  ];
  const { transcript, resetTranscript } = useSpeechRecognition({ commands });
  const [isListening, setIsListening] = useState(false);
  const [analysis, setAnalysis] = useState("listening");
  const microphoneRef = useRef(null);


  useEffect(() => {
    const options = {
      method: "POST",
      url: "https://text-analysis12.p.rapidapi.com/sentiment-analysis/api/v1.1",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "text-analysis12.p.rapidapi.com",
        "x-rapidapi-key": `${process.env.REACT_APP_API_KEY_RAPID_API}`,
      },
      data: {
        language: "english",
        text: transcript,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setAnalysis(response.data.sentiment)
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [transcript]);


  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser is not Support Speech Recognition.
      </div>
    );
  }
  const handleListing = () => {
    setIsListening(true);
    microphoneRef.current.classList.add("listening");
    SpeechRecognition.startListening({
      continuous: true,
    });
  };
  const stopHandle = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
  };
  const handleReset = () => {
    stopHandle();
    resetTranscript();
  };

  return (
    <div className="microphone-wrapper">
      <div className="mircophone-container">
        <div
          className="microphone-icon-container"
          ref={microphoneRef}
          onClick={handleListing}
        >
          {/* <img src={microPhoneIcon} className="microphone-icon" /> */}
        </div>
        <div className="microphone-status">
          {isListening ? "Listening........." : "Click to start Listening"}
        </div>
        {isListening && (
          <button className="microphone-stop btn" onClick={stopHandle}>
            Stop
          </button>
        )}
      </div>
      {transcript && (
        <div className="microphone-result-container">
          <div className="microphone-result-text">{transcript}</div>
          <button className="microphone-reset btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      )}
      {analysis}
    </div>
  );
}
export default App;
