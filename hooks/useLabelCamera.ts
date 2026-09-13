import { useCallback, useEffect, useRef, useState } from 'react';
import { CameraView, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';

export function useLabelCamera() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  useEffect(() => {
  if (permission && !permission.granted && permission.canAskAgain) {
    requestPermission();
  }
}, [permission]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [error, setError] = useState<string | null>(null);

  const capturePhoto = useCallback(async (): Promise<CameraCapturedPicture | null> => {
    if (!cameraRef.current || isCapturing) return null;

    setIsCapturing(true);
    setError(null);

    try {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (!result) {
        setError('Não foi possível capturar a imagem. Tente novamente.');
        return null;
      }
      setPhoto(result);
      return result;
    } catch (e) {
      setError('Não foi possível capturar a imagem. Tente novamente.');
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing]);

  const resetPhoto = useCallback(() => setPhoto(null), []);

  return {
    cameraRef,
    permission,
    requestPermission,
    isCapturing,
    photo,
    error,
    capturePhoto,
    resetPhoto,
  };
}
