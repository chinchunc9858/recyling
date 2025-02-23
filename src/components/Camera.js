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
  }, []);  // Empty dependency array to run only once on mount

return (
    <>
        <video id="videoElement" width="1980" height="1080" autoPlay></video>

    </>
);
}

export default Camera;
