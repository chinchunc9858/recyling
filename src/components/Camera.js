import React, { useEffect, useRef, useState } from 'react';

function Camera() {
  const videoRef = useRef(null); // Ref for the video element
  const canvasRef = useRef(null); // Ref for the canvas element
  const [snapshot, setSnapshot] = useState(null); // State to store the snapshot

  useEffect(() => {
    // Attempt to access the media devices
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
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

  return (
    <>
      {/* Video element to display the camera feed */}
      
      <div id = "container">
        <video ref={videoRef} id="videoElement" width="1980" height="1080" autoPlay></video>
      </div>
      

      {/* Button to take a snapshot */}
      <button id = "TakePhotoButton" onClick={takeSnapshot}>📷 Take Photo</button>
      <button id = "FlipCameraButton">🔄 Flip Camera</button>

      {/* Hidden canvas element to capture the snapshot */}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      {/* Display the snapshot if it exists */}
      {snapshot && <img src={snapshot} alt="Snapshot" />}
    </>
  );
}

export default Camera;