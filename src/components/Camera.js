import React, { useEffect } from 'react';

function Camera() {
useEffect(() => {
    // Attempt to access the media devices
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        console.log("Media stream successfully acquired!");
        const videoElement = document.querySelector('#videoElement');
        videoElement.srcObject = stream;
    })
    .catch(function(error) {
        console.log("Error accessing media devices: ", error);
    });
}, []);

return (
    <>  
        <div id = "container">
            <video id = "videoElement" autoPlay></video>
            <button id = "TakePhotoButton"></button>
            <button id = "FlipCameraButton"></button>
        </div>
    </>
);
}

export default Camera;
