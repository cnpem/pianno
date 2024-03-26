import { useState } from 'react';

type CopyToClipboard = {
  data: string;
  isError: boolean;
  message?: string;
};

export const useCopyToClipboard = (): [
  (text: string) => Promise<void>,
  CopyToClipboard,
] => {
  const [copyResult, setCopyResult] = useState<CopyToClipboard>({
    data: '',
    isError: false,
  });

  const copyToClipboard = async (text: string) => {
    if (!navigator.clipboard) {
      setCopyResult({
        data: text,
        isError: true,
        message: 'Clipboard API not available',
      });
      throw new Error('Clipboard API not available');
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopyResult({
        data: text,
        isError: false,
        message: 'Copied to clipboard',
      });
    } catch (err) {
      setCopyResult({
        data: text,
        isError: true,
        message:
          err instanceof Error ? err.message : 'Failed to copy to clipboard',
      });
      throw err;
    }
  };

  return [copyToClipboard, copyResult];
};
