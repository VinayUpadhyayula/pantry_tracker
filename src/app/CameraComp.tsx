import { useRef, useState } from "react";
import { Camera } from "react-camera-pro";

interface CameraCompProps
{
  setImage:(img:any)=>void;
  setDisplayImage :(imgflag:boolean)=>void;
}
const CameraComp: React.FC<CameraCompProps> = ({setImage,setDisplayImage}) => {
const camera: any = useRef(null);
 const [facingMode, setFacingMode] = useState('environment');
const errorMessages = {
    noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
    permissionDenied: 'Permission denied. Please refresh and give camera permission.',
    switchCamera:
      'It is not possible to switch camera to different one because there is only one video device accessible.',
    canvas: 'Canvas is not supported.'
  };
  const capturePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      setImage(photo);
      setDisplayImage(false);
    }
  };
  const flipCamera = () => {
    setFacingMode((prevFacingMode) => (prevFacingMode === 'environment' ? 'user' : 'environment'));
  };
    return (
        <div style={{ width: '100%', height: 'auto', borderRadius: '8px', overflow: 'hidden' }}>
                      <Camera ref={camera} errorMessages={errorMessages} facingMode={facingMode as 'user' | 'environment'}/>
                      <button
                        onClick={capturePhoto}
                        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 p-1"
                        style={{
                          background: "url('https://img.icons8.com/ios/50/000000/compact-camera.png') center / 50px no-repeat",
                          width: '80px',
                          height: '80px',
                          border: 'solid 4px black',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        }}
                      >
                      </button>
                      <button
                        onClick={flipCamera}
                        className="absolute bottom-2 left-3/4 transform -translate-x-1/2 p-1"
                        style={{
                          width: '80px',
                          height: '80px',
                          border: 'solid 4px black',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        }}
                      >Flip Camera
                      </button>
                    </div>
    );
};
export  {CameraComp};