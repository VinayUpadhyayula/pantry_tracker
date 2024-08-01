'use client'
import React, { useRef } from 'react';
import { useRouter } from "next/navigation";
import Camera from 'react-camera-pro';

const CameraPage = () => {
  const camera :any= useRef(null);
  const history = useRouter();

  const handleCapture = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      history.push('/', { image: photo });
    }
  };

  return (
    <div>
                      <Camera ref={camera} errorMessages={errorMessages} />
                      <button onClick={() => {
                        if (camera.current) {
                          const photo = camera.current.takePhoto();
                          setImage(photo);
                        }
                      }}>Capture</button>
                    </div>
  );
};

export default CameraPage;
