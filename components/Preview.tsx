import React from 'react';
import { Download, FileText, CheckCircle } from 'lucide-react';

interface PreviewProps {
  htmlContent: string;
  onDownload: () => void;
  fileName: string;
}

const Preview: React.FC<PreviewProps> = ({ htmlContent, onDownload, fileName }) => {
  return (
    <div className="w-full animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <CheckCircle size={24} className="text-green-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">تم التحويل بنجاح</h3>
              <p className="text-blue-100 text-xs truncate max-w-[200px] opacity-80">{fileName}</p>
            </div>
          </div>
          
          <button
            onClick={onDownload}
            className="flex items-center gap-2 bg-white text-blue-700 px-6 py-2.5 rounded-full font-bold shadow-sm hover:shadow-md hover:bg-blue-50 transition-all active:scale-95"
          >
            <Download size={18} />
            <span>تحميل ملف Word</span>
          </button>
        </div>

        {/* Content Preview Wrapper */}
        <div className="p-6 bg-gray-50">
            <h4 className="text-gray-500 text-sm font-semibold mb-3 flex items-center gap-2">
                <FileText size={16} />
                معاينة المستند (نصي فقط)
            </h4>
          <div className="bg-white p-8 shadow-sm border border-gray-200 min-h-[400px] max-h-[600px] overflow-y-auto rounded-lg prose prose-sm max-w-none text-right" dir="auto">
            {/* We use dangerouslySetInnerHTML safely because the source is our own AI prompt result which we strip from scripts */}
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
          <p className="text-center text-gray-400 text-xs mt-4">
            قد تختلف المعاينة قليلاً عن ملف Word النهائي. حمل الملف للحصول على أفضل تنسيق.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Preview;