type TextRecognitionModule = {
  recognize: (imageUri: string) => Promise<{ text: string }>;
};


let TextRecognition: TextRecognitionModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  TextRecognition = require('@react-native-ml-kit/text-recognition').default;
} catch {
  TextRecognition = null;
}

export class OcrError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OcrError';
  }
}


const MIN_TEXT_LENGTH = 15;

export async function extrairTextoDoRotulo(imageUri: string): Promise<string> {
  if (!TextRecognition) {
    throw new OcrError(
      'O leitor de rótulos não está disponível neste app. Use o app de desenvolvimento do Nutribase (não o Expo Go).',
    );
  }

  let texto: string;
  try {
    const resultado = await TextRecognition.recognize(imageUri);
    texto = (resultado?.text ?? '').trim();
  } catch {
    throw new OcrError('Não foi possível ler a imagem. Tente tirar a foto novamente.');
  }

  if (texto.length < MIN_TEXT_LENGTH) {
    throw new OcrError(
      'Não conseguimos ler o texto do rótulo. Tente de novo com mais luz, sem tremer, e enquadrando a lista de ingredientes.',
    );
  }

  return texto;
}
