import React, { useCallback } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type === 'application/pdf') {
          onFileSelect(file);
        } else {
          alert('الرجاء رفع ملف PDF فقط');
        }
      }
    },
    [onFileSelect, disabled]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`relative w-full border-2 border-dashed rounded-2xl p-10 transition-all duration-300 ${
        disabled
          ? 'border-gray-300 bg-gray-50 opacity-50 cursor-not-allowed'
          : 'border-blue-400 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-600 cursor-pointer'
      }`}
    >
      <input
        type="file"
        accept="application/pdf"
        onChange={handleInputChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className={`p-4 rounded-full ${disabled ? 'bg-gray-200' : 'bg-blue-100 text-blue-600'}`}>
          <UploadCloud size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">اضغط للرفع أو اسحب الملف هنا</h3>
          <p className="text-gray-500 mt-2 text-sm">ندعم ملفات PDF حتى حجم 10 ميجابايت</p>
        </div>
        {!disabled && (
          <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            <FileText size={14} />
            <span>يدعم اللغة العربية</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;