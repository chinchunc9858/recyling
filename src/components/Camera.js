import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [snapshot, setSnapshot] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);

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
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        setUploadedImage(reader.result);
        classifyImage(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <div id="container">
        <div id="videoWrapper">
          <h1 id="Heading">Is it Recyclable?</h1>
          <video ref={videoRef} id="videoElement" width="1980" height="1080" autoPlay></video>

          <div id="buttonsContainer">
            <button id="TakePhotoButton" onClick={takeSnapshot} disabled={isLoading}>
              {isLoading ? 'Processing...' : '📷 Take Photo'}
            </button>
            <button id="FlipCameraButton">🔄 Flip Camera</button>
            <button id="UploadPhoto" onClick={handleUploadPhoto} disabled={isLoading}>
              {isLoading ? 'Processing...' : '📷 Upload a Photo'}
            </button>
          </div>
        </div>

        {prediction && (
          <div id="popup" className="popup" style={{ display: "flex" }}>
            <div className="popup-content">
              <h3>Classification Result:</h3>
              <p>Class: {prediction?.predictions[0].class}</p>
              <p>Confidence: {(prediction?.confidence * 100).toFixed(1)}%</p>
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

      {snapshot && <img src={snapshot} alt="Snapshot" style={{ maxWidth: '300px' }} />}
      {uploadedImage && <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: '300px' }} />}
    </>
  );
}

export default Camera;