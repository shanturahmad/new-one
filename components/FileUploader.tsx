import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CsvRow, ParseResult } from '../types';

interface FileUploaderProps {
  onDataLoaded: (data: CsvRow[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onDataLoaded }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    setError(null);
    setLoading(true);
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult) => {
        setLoading(false);
        if (results.data && results.data.length > 0) {
          onDataLoaded(results.data);
        } else {
          setError('The file appears to be empty or invalid.');
        }
      },
      error: (err: Error) => {
        setLoading(false);
        setError(`Parsing error: ${err.message}`);
      }
    });
  }, [onDataLoaded]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div 
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out
        ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
        ${fileName ? 'border-green-400 bg-green-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            onChange={handleChange}
            accept=".csv"
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center pointer-events-none">
            {loading ? (
                <div className="animate-pulse flex flex-col items-center">
                    <FileSpreadsheet className="w-10 h-10 text-blue-400 mb-3" />
                    <p className="text-sm text-blue-500 font-medium">Processing data...</p>
                </div>
            ) : fileName ? (
                <div className="flex flex-col items-center">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
                    <p className="text-sm text-gray-600 font-medium">Loaded: <span className="text-gray-900 font-bold">{fileName}</span></p>
                    <p className="text-xs text-gray-400 mt-1">Click or drag to replace</p>
                </div>
            ) : (
                <>
                    <Upload className={`w-10 h-10 mb-3 transition-colors ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">اضغط للتحميل</span> أو اسحب ملف CSV هنا
                    </p>
                    <p className="text-xs text-gray-400">ملفات CSV فقط (UTF-8)</p>
                </>
            )}
        </div>
      </div>
      
      {error && (
        <div className="mt-3 flex items-center text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
          <AlertCircle className="w-4 h-4 mr-2 ml-2" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;