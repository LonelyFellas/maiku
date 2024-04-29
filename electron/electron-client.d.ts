declare namespace ElectronClient {
  interface FileOperationOptions {
    type: 'save' | 'remove';
    data?: string | NodeJS.ArrayBufferView;
    outputPath: string;
  }
}
