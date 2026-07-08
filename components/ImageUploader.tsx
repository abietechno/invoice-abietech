
import React, { useRef } from 'react';

interface ImageUploaderProps {
  label: string;
  onUpload: (file: string | null) => void;
  currentImage: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onUpload, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      onUpload(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <div 
            onClick={triggerFileInput}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500 cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition"
        >
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/svg+xml"
            className="hidden"
        />
        {currentImage ? (
            <div className="relative p-2 h-full w-full flex items-center justify-center">
                <img src={currentImage} alt="Preview" className="max-h-full max-w-full object-contain" />
                <button
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold hover:bg-red-600"
                    title="Remove image"
                >
                    X
                </button>
            </div>
        ) : (
            <span>Klik untuk memilih gambar</span>
        )}
        </div>
    </div>
  );
};

export default ImageUploader;
