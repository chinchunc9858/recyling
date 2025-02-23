import React, { useEffect, useRef, useState } from 'react';

function Camera() {
  const videoRef = useRef(null); // Ref for the video element
  const canvasRef = useRef(null); // Ref for the canvas element
  const fileInputRef = useRef(null); // Ref for the file input
  const [snapshot, setSnapshot] = useState(null); // State to store the snapshot
  const [uploadedImage, setUploadedImage] = useState(null); // State to store uploaded image

  useEffect(() => {
    // Attempt to access the media devices
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        stream.width = document.getElementById("videoElement").clientWidth;
        stream.height = document.getElementById("videoElement").clientHeight;
        console.log("Media stream successfully acquired!");
        videoRef.current.srcObject = stream; // Set the video source to the stream
      })
      .catch(function (error) {
        console.error("Error accessing media devices: ", error);
      });
  }, []); // Empty dependency array to run only once on mount

  const takeSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas dimensions to match video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto the canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas content to a base64-encoded image
    const imageDataUrl = canvas.toDataURL('image/png');
    setSnapshot(imageDataUrl); // Update state with the snapshot
  };

  const handleUploadPhoto = () => {
    fileInputRef.current.click(); // Trigger the hidden file input click
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        //setUploadedImage(reader.result); // Update state with the uploaded image
      };
      reader.readAsDataURL(file); // Read the file as a Data URL
    }
  };

  return (
    <>
      <div id="container">
        <div id="videoWrapper">
          <h1 id="Heading">Is it Recyclable?</h1>
          <video ref={videoRef} id="videoElement" width="1980" height="1080" autoPlay></video>

          <div id="buttonsContainer">
            <button id="TakePhotoButton" onClick={takeSnapshot}>📷 Take Photo</button>
            <button id="FlipCameraButton">🔄 Flip Camera</button>
            <button id="UploadPhoto" onClick={handleUploadPhoto}>📷 Upload a Photo</button>
          </div>
        </div>

        <div id="popup" className="popup">
          <div className="popup-content">
            <button id="button1">RECYCLABLE</button>
            <button id="button2">NOT RECYCLABLE</button>
          </div>
        </div>

      </div>

      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      /> {/* Hidden file input for uploading a photo */}

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      {/* Display the snapshot if it exists */}
      {snapshot && <img src={snapshot} alt="Snapshot" />}
      {/* Display the uploaded image if it exists */}
      {uploadedImage && <img src={uploadedImage} alt="Uploaded" />}
    </>
  );
}

export default Camera;
