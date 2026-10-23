import type { RefObject } from 'react';
import type { View } from 'react-native';

export interface Retangulo {
  x: number;
  y: number;
  width: number;
  height: number;
}


let Manipulator: any = null;
try {

  Manipulator = require('expo-image-manipulator');
} catch {
  Manipulator = null;
}


export function medirNaTela(ref: RefObject<View | null>): Promise<Retangulo | null> {
  return new Promise((resolve) => {
    if (!ref.current) return resolve(null);
    const timer = setTimeout(() => resolve(null), 1000);
    ref.current.measureInWindow((x, y, width, height) => {
      clearTimeout(timer);
      resolve({ x, y, width, height });
    });
  });
}


export async function recortarParaMoldura(
  uri: string,
  fotoLargura: number,
  fotoAltura: number,
  camera: Retangulo,
  moldura: Retangulo,
): Promise<string> {
  if (!Manipulator) {
    console.warn('[crop] expo-image-manipulator indisponível, usando a foto inteira.');
    return uri;
  }

  try {
    const escala = Math.max(camera.width / fotoLargura, camera.height / fotoAltura);
    const sobraX = (fotoLargura * escala - camera.width) / 2;
    const sobraY = (fotoAltura * escala - camera.height) / 2;

    const x = Math.max(0, Math.floor((moldura.x - camera.x + sobraX) / escala));
    const y = Math.max(0, Math.floor((moldura.y - camera.y + sobraY) / escala));
    const largura = Math.min(Math.round(moldura.width / escala), fotoLargura - x);
    const altura = Math.min(Math.round(moldura.height / escala), fotoAltura - y);

    if (__DEV__) console.log('[crop]', { fotoLargura, fotoAltura, camera, moldura, x, y, largura, altura });
    if (largura < 50 || altura < 50) return uri;

    const contexto = Manipulator.ImageManipulator.manipulate(uri);
    contexto.crop({ originX: x, originY: y, width: largura, height: altura });
    const imagem = await contexto.renderAsync();
    const resultado = await imagem.saveAsync({ format: Manipulator.SaveFormat.JPEG, compress: 1 });
    return resultado.uri;
  } catch {
    return uri;
  }
}