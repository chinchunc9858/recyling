import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import updatePoints from './updatePoint';

function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [snapshot, setSnapshot] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error accessing media devices: ", error);
      });
  }, []);

  const classifyImage = async (base64Data) => {
    
    setIsLoading(true);
    setError(null);
    setPrediction(null);
      
    let isRecyclable = function(rd) {
      switch(rd) {
        case "Aluminium":
          return [true, "Generally recyclable, but contamination (like food residue) can hinder the process. Aluminum cans are widely recycled."]
        case "Carton":
          return [false, "Cartons made of multiple materials (like Tetra Paks) are harder to recycle because they contain a mix of plastic, paper, and aluminum. Standard paper cartons (like milk cartons) may be recyclable depending on local facilities."]
        case "Glass":
          return [true, "Typically recyclable, but it needs to be clean and free of contaminants. Some specialty glass (like mirrors or window glass) may not be recyclable."]
        case "Organic Waste":
          return [false, "Not recyclable through standard recycling programs, but it can often be composted instead."]
        case "Other Plastics":
          return [false, "Plastics that are not labeled with recycling codes or are made of mixed materials (like some plastic packaging) may not be easily recyclable."]
        case "Paper and Cardboard":
          return [true, "Generally recyclable unless contaminated by food or grease. For example, pizza boxes may not be accepted if soiled."]
        case "Plastic":
          return [true, "Most plastics can be recycled, but the type of plastic matters (look for the recycling code). Some types of plastic are harder to process, like certain plastics in single-use items."]
        case "Textiles":
          return [false, "Generally not recyclable in curbside programs, but they can be reused or donated. Some specialized textile recycling programs exist."]
        case "Wood":
          return [true, "Wood can sometimes be recycled (especially clean, untreated wood), but it depends on the type and condition. Wood with paint or chemical treatment may not be accepted."]
        case "Can":
          return [true, "If this refers to aluminum or steel cans, they are typically recyclable. However, if it refers to other materials, it may not be recyclable."]
        case "Glass":
          return [true, "Recyclable in most places, but some types of glass (like mirrors, windows, and some cookware) are not recyclable due to different compositions."]
        case "Paper":
          return [true, "Most paper can be recycled unless contaminated with food or grease."]
        case "Plastic Bag":
          return [false, "Not recyclable through most curbside programs, as they tend to get caught in the recycling machinery. They can sometimes be recycled at specialized drop-off locations."]
        case "Styrofoam":
          return [false, "Not recyclable in most areas due to its composition and low density. It can be difficult and expensive to recycle and is often sent to landfills."]
        default:
          return [false, "Material not recognized or not commonly recyclable."]
      }
    };    
    
    try {
      const response = await axios({
        method: "POST",
        url: "https://classify.roboflow.com/recyclable-materials-ljuil/2",
        params: {
          api_key: "3hqlPUXCMnNg32o1s2Fx"
        },
        data: base64Data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
    
      setPrediction(response.data);
      setIsPopupVisible(true); // Show popup when prediction is received
    
      // Get the predicted class from the response
      const predictedClass = response.data?.predictions[0]?.class;
    
      // Check if the predicted class is recyclable
      let recyclable = isRecyclable(predictedClass);
      updatePoints(recyclable);
      console.log(recyclable); // This will print true/false based on the recyclability
    
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const takeSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/png');
    const base64Data = imageDataUrl.split(',')[1];
    setSnapshot(imageDataUrl);
    classifyImage(base64Data);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Reset states
      setUploadedImage(null);
      setSnapshot(null);
  
      // Create a new FileReader to read the uploaded file
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        setUploadedImage(reader.result); // Set the uploaded image
        classifyImage(base64Data); // Classify the uploaded image
      };
      reader.readAsDataURL(file); // Convert file to base64
  
      // Reset the file input after handling the file
      event.target.value = null;
    }
  };
  
  const handleUploadPhoto = () => {
    fileInputRef.current.click();
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSnapshot(null); // Reset snapshot
    setUploadedImage(null); // Reset uploaded image
  };
  
  return (
    <>
      <div id="container">
        <div id="videoWrapper">
          <h1 id="Heading">Is it Recyclable?</h1>
          <video ref={videoRef} id="videoElement" width="1980" height="1080" autoPlay></video>

          <div id="buttonsContainer">
            <button className="options" id="TakePhotoButton" onClick={takeSnapshot} disabled={isLoading}>
              {isLoading ? 'Processing...' : '📷 Take Photo'}
            </button>
            <button className="options" id="FlipCameraButton">🔄 Flip Camera</button>
            <button className="options" id="UploadPhoto" onClick={handleUploadPhoto} disabled={isLoading}>
              {isLoading ? 'Processing...' : '📷 Upload a Photo'}
            </button>
          </div>
        </div>

        {isPopupVisible && (
          <div id="popup" className="popup">
            <div className="popup-content">
              <h3 className="popupText">Classification Result:</h3>
              <p className="popupText">Class: {prediction?.predictions[0]?.class || "Unknown"}</p>
              <p className="popupText">Confidence: {prediction?.confidence ? `${(prediction.confidence * 100).toFixed(1)}%` : "N/A"}</p>
              <button id="popupexit" onClick={closePopup}>X</button>
              {snapshot && <img src={snapshot} alt="Snapshot" style={{ maxWidth: '300px' }} />}
              {uploadedImage && <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: '300px' }} />}
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}
      </div>

      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </>
  );
}

export default Camera;
