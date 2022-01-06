import React from "react";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useRef } from "react";
import * as ml5 from "ml5";
import { useState } from "react";

const Ml5 = ({ path }) => {
  let videoEl = useRef();
  const MODEL_PATH =
    "https://teachablemachine.withgoogle.com/models/vHXFDzjtC/";
  let [classifier, setClassifier] = useState();
  let [label, setLabel] = useState();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((mediaStream) => {
      videoEl.current.srcObject = mediaStream;
    });
    ml5.imageClassifier((path || MODEL_PATH) + "model.json").then((x) => {
      console.log("inited", x);
      setClassifier(x);
    });
  }, []);

  return (
    <div>
      {" "}
      Hello ML5
      {classifier && (
        <button
          onClick={() => {
            classifier.classify(videoEl.current, (error, result) => {
              console.log("classifier", error, result);
              setLabel(result[0].label);
            });
          }}
        >
          Classify
        </button>
      )}
      <video
        style={{ border: "1px solid red" }}
        ref={videoEl}
        autoPlay={true}
      />
      AI: {label}
    </div>
  );
};

export default Ml5;
