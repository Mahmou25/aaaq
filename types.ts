export interface ConversionStatus {
  step: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  message?: string;
}

export interface ConvertedDocument {
  htmlContent: string;
  fileName: string;
}