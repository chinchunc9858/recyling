import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { updatePoints, getTotalPoints } from "./updatePoint";

function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [snapshot, setSnapshot] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isCameraFlipped, setIsCameraFlipped] = useState(false); // State for camera flip

  useEffect(() => {
    // Fetch total points from Firebase when component mounts
    const fetchPoints = async () => {
      const points = await getTotalPoints();
      setTotalPoints(points);
    };
    fetchPoints();
  }, []);

  // Access the camera
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
  }, []);

  const takeSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/png");
    setSnapshot(imageDataUrl);
    classifyImage(imageDataUrl.split(",")[1]); // Pass base64 data to classifyImage
  };

  const classifyImage = async (base64Data) => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    const isRecyclable = function(rd) {
      switch(rd) {
        // ... (existing switch cases)
      }
    }

    try {
      const response = await axios({
        method: "POST",
        url: "https://classify.roboflow.com/recyclable-materials-ljuil/2",
        params: {
          api_key: "3hqlPUXCMnNg32o1s2Fx",
        },
        data: base64Data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      setPrediction(response.data);
      setIsPopupVisible(true);

      const predictedClass = response.data?.predictions[0]?.class;
      const [recyclable, description] = isRecyclable(predictedClass);

      await updatePoints(recyclable, description); // Update points in Firestore
      const updatedPoints = await getTotalPoints(); // Fetch updated points
      setTotalPoints(updatedPoints); // Update state

      console.log(recyclable);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(",")[1];
        setUploadedImage(reader.result); // Set uploaded image for display
        classifyImage(base64Data); // Classify the uploaded image
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  
    // Reset the file input to allow the same file to be uploaded again
    event.target.value = null;
  };

  return (
    <>
      {/* Display Total Points */}
      <div id="points">
        🏆 Total Points: {totalPoints}
      </div>

      <div id="container">
        <div id="videoWrapper">
          <h1 id="Heading">Is it Recyclable?</h1>
          <video
            ref={videoRef}
            id="videoElement"
            width="1980"
            height="1080"
            autoPlay
            style={{ transform: isCameraFlipped ? "scaleX(-1)" : "none" }} // Flip horizontally
          ></video>

          <div id="buttonsContainer">
            <button className="options" id="TakePhotoButton" onClick={takeSnapshot} disabled={isLoading}>
              {isLoading ? "Processing..." : "📷 Take Photo"}
            </button>
            <button className="options" id="FlipCameraButton" onClick={() => setIsCameraFlipped(!isCameraFlipped)}>
              🔄 Flip Camera
            </button>
            <button className="options" id="UploadPhoto" onClick={() => fileInputRef.current.click()} disabled={isLoading}>
              {isLoading ? "Processing..." : "📷 Upload a Photo"}
            </button>
          </div>
        </div>

        {isPopupVisible && (
          <div id="popup" className="popup">
            <div className="popup-content">
              <h3 className="popupText">Classification Result:</h3>
              <p className="popupText">Class: {prediction?.predictions[0]?.class || "Unknown"}</p>
              <button id="popupexit" onClick={() => {
                setIsPopupVisible(false);
                setSnapshot(null);
                setUploadedImage(null);
              }}>
                X
              </button>
              {snapshot && <img src={snapshot} alt="Snapshot" style={{ maxWidth: "300px" }} />}
              {uploadedImage && <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: "300px" }} />}
            </div>
          </div>
        )}

        {error && <div className="error-message">Error: {error}</div>}
      </div>

      <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </>
  );
}

export default Camera;
