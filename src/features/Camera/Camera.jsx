import React, { useState, useRef, useEffect, useCallback } from 'react';
import Button from '../../components/Button';
import './Camera.css';

import stopIcon from "../../assets/icons/music/stop.svg";
import nextIcon from "../../assets/icons/music/next.svg";
import ejectIcon from "../../assets/icons/music/eject.svg";

const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
    <circle cx="8" cy="8" r="6" />
  </svg>
);

const SaveIcon = () => (
  <img src={ejectIcon} alt="Save" style={{ width: 20, height: 20 }} />
);

const RetakeIcon = () => (
  <img src={stopIcon} alt="Retake" style={{ width: 20, height: 20 }} />
);

const SwitchIcon = () => (
  <img src={nextIcon} alt="Switch" style={{ width: 20, height: 20 }} />
);

const Camera = ({ onClose }) => {
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('user');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const offscreenCanvasRef = useRef(null);

  // Initialize camera
  useEffect(() => {
    let currentStream = null;
    const initCamera = async () => {
      try {
        if (currentStream) {
          currentStream.getTracks().forEach(track => track.stop());
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 }, // Lowering ideal for that 90s feel
            height: { ideal: 720 }
          },
          audio: false,
        });
        setStream(mediaStream);
        currentStream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Camera access denied or not available.");
      }
    };

    initCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  useEffect(() => {
    if (videoRef.current && stream && !videoRef.current.srcObject) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, photo]);

  // Continuously draw video to canvas with 90s effects
  useEffect(() => {
    let animationFrameId;

    const renderLoop = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.videoWidth > 0 && !photo) {
        if (!offscreenCanvasRef.current) {
          offscreenCanvasRef.current = document.createElement('canvas');
        }
        const offscreen = offscreenCanvasRef.current;

        // Target a standard 90s resolution (e.g., 640x480 or smaller)
        const targetWidth = 640;
        const targetHeight = (video.videoHeight / video.videoWidth) * targetWidth;

        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        if (offscreen.width !== targetWidth || offscreen.height !== targetHeight) {
          offscreen.width = targetWidth;
          offscreen.height = targetHeight;
        }

        const ctx = canvas.getContext('2d');
        const octx = offscreen.getContext('2d');

        // 1. Draw to offscreen at low res (Pixelation step)
        octx.save();
        if (facingMode === 'user') {
          octx.scale(-1, 1);
          octx.drawImage(video, -targetWidth, 0, targetWidth, targetHeight);
        } else {
          octx.drawImage(video, 0, 0, targetWidth, targetHeight);
        }
        octx.restore();

        // 2. Add some CRT noise/grain to the offscreen
        const imageData = octx.getImageData(0, 0, targetWidth, targetHeight);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 15;
          data[i] = Math.min(255, Math.max(0, data[i] + noise));
          data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
          data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
        }
        octx.putImageData(imageData, 0, 0);

        // 3. Upscale back to main canvas (with smoothing disabled for chunkier pixels)
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);

        // 4. Apply a slight color tint/filter (using context filter if supported, or manual)
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(255, 230, 200, 0.1)'; // Sepia/warm tint
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [photo, facingMode]);

  const takePhoto = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    setPhoto(dataUrl);
  }, []);

  const resetCamera = useCallback(() => {
    setPhoto(null);
  }, []);

  const savePhoto = useCallback(() => {
    if (!photo) return;
    const link = document.createElement('a');
    link.href = photo;
    link.download = `RetroPhoto_${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [photo]);

  return (
    <div className="camera-container">
      <aside className="camera-sidebar">
        <div className="camera-controls">
          <Button
            className="camera-shutter-btn"
            onClick={photo ? resetCamera : takePhoto}
            title={photo ? "Retake Photo" : "Take Photo"}
            ariaLabel="Shutter"
            variant="control"
            isPressed={!!photo}
          >
            <div className="camera-shutter-inner">
              {photo ? <RetakeIcon /> : <CameraIcon />}
            </div>
          </Button>

          {photo && (
            <Button
              className="camera-save-btn"
              onClick={savePhoto}
              title="Save to Device"
              ariaLabel="Save"
              variant="control"
            >
              <SaveIcon />
            </Button>
          )}

          {!photo && (
            <Button
              className="camera-switch-btn"
              onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
              title="Switch Camera"
              ariaLabel="Switch"
              variant="control"
            >
              <SwitchIcon />
            </Button>
          )}
        </div>
      </aside>

      <main className="camera-main">
        {error ? (
          <div className="camera-message">
            <p>{error}</p>
          </div>
        ) : (
          <div className="camera-view-wrapper">
            <video
              ref={videoRef}
              style={{ display: 'none' }}
              autoPlay
              playsInline
              muted
            />
            <div className="retro-overlay"></div>
            {photo && (
              <img src={photo} alt="Captured" className="camera-photo-preview" />
            )}
            <canvas
              ref={canvasRef}
              className="camera-canvas"
              style={{ display: photo ? 'none' : 'block' }}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Camera;


