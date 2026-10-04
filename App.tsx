import React, { useState } from 'react';
import { convertPdfToHtml } from './services/geminiService';
import FileUpload from './components/FileUpload';
import Preview from './components/Preview';
import Footer from './components/Footer';
import { ConversionStatus } from './types';
import { Loader2, Sparkles, FileType, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<ConversionStatus>({ step: 'idle' });
  const [resultHtml, setResultHtml] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileSelect = async (file: File) => {
    setFileName(file.name);
    setStatus({ step: 'uploading', message: 'جاري قراءة الملف...' });

    try {
      // Small delay to show UI state change
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStatus({ step: 'processing', message: 'جاري التحليل بواسطة الذكاء الاصطناعي وتقسيم الصفحات...' });
      
      const html = await convertPdfToHtml(file);
      
      setResultHtml(html);
      setStatus({ step: 'completed' });
    } catch (error) {
      console.error(error);
      setStatus({ 
        step: 'error', 
        message: 'حدث خطأ أثناء المعالجة. يرجى التأكد من أن الملف سليم والمحاولة مرة أخرى.' 
      });
    }
  };

  const handleDownload = () => {
    if (!resultHtml) return;

    // Construct a complete HTML file with Word-compatible namespaces
    // Added specific CSS for .page-break to be recognized by MS Word
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'
            dir='rtl'>
      <head>
        <meta charset='utf-8'>
        <title>${fileName}</title>
        <style>
          body { font-family: 'Arial', sans-serif; text-align: right; direction: rtl; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
          td, th { border: 1px solid #000; padding: 8px; }
          p { margin-bottom: 1em; line-height: 1.5; }
          
          /* CSS to force page breaks in MS Word */
          .page-break {
            page-break-before: always;
            clear: both;
            display: block;
            height: 0;
            visibility: hidden;
          }
        </style>
      </head>
      <body>
    `;
    const footer = "</body></html>";
    const sourceHTML = header + resultHtml + footer;

    // Add BOM for proper UTF-8 handling in Word
    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Changing extension to .doc often works better for forcing Word to open HTML as a doc content
    link.download = fileName.replace('.pdf', '') + '_converted.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setStatus({ step: 'idle' });
    setResultHtml(null);
    setFileName('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8">
      {/* Global styles for preview visualization of page breaks */}
      <style>{`
        .page-break { 
          border-top: 2px dashed #cbd5e1;
          margin: 2rem 0;
          position: relative;
          height: 1px;
          display: block;
        }
        .page-break::after {
          content: 'فاصل صفحات';
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: #f1f5f9;
          padding: 0 10px;
          color: #64748b;
          font-size: 12px;
        }
      `}</style>

      {/* Navbar / Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-3 text-indigo-700">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FileType size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">PDF to Word AI</h1>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <Sparkles size={16} className="text-amber-500" />
          <span>مدعوم بنموذج Gemini 2.5</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-3xl flex-1 flex flex-col items-center">
        
        {/* Hero Section */}
        {status.step === 'idle' && (
          <div className="text-center mb-10 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 leading-tight">
              حول ملفات PDF إلى <span className="text-blue-600">Word</span> <br/>
              بسهولة ودقة عالية
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              استخدم قوة الذكاء الاصطناعي لاستخراج النصوص والجداول والتنسيقات من ملفات PDF العربية والإنجليزية وتحويلها إلى مستندات قابلة للتعديل.
            </p>
          </div>
        )}

        {/* Upload Area */}
        {status.step === 'idle' && (
          <div className="w-full animate-fade-in-up delay-100">
            <FileUpload onFileSelect={handleFileSelect} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <FeatureCard icon={<Sparkles className="text-amber-500"/>} title="دقة عالية" description="يحافظ على الجداول والتنسيق بفضل نماذج AI المتقدمة" />
                <FeatureCard icon={<FileText className="text-blue-500"/>} title="يدعم العربية" description="دعم كامل للنصوص العربية واتجاه اليمين لليسار" />
                <FeatureCard icon={<Loader2 className="text-green-500"/>} title="سريع وآمن" description="معالجة فورية للملفات دون تخزينها" />
            </div>
          </div>
        )}

        {/* Loading State */}
        {(status.step === 'uploading' || status.step === 'processing') && (
          <div className="w-full bg-white rounded-2xl shadow-xl p-12 text-center animate-fade-in">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-white p-4 rounded-full border-4 border-blue-50">
                <Loader2 size={48} className="text-blue-600 animate-spin" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {status.message}
            </h3>
            <p className="text-gray-500">قد يستغرق هذا بضع ثوانٍ حسب حجم الملف</p>
          </div>
        )}

        {/* Success / Preview State */}
        {status.step === 'completed' && resultHtml && (
          <div className="w-full space-y-6">
            <Preview 
              htmlContent={resultHtml} 
              onDownload={handleDownload}
              fileName={fileName}
            />
            <button 
              onClick={reset}
              className="mx-auto block text-gray-500 hover:text-gray-800 underline underline-offset-4 transition-colors"
            >
              تحويل ملف آخر
            </button>
          </div>
        )}

        {/* Error State */}
        {status.step === 'error' && (
          <div className="w-full bg-red-50 border border-red-200 rounded-xl p-8 text-center animate-fade-in">
             <div className="inline-flex bg-red-100 p-3 rounded-full mb-4 text-red-600">
                <FileType size={32} />
             </div>
             <h3 className="text-xl font-bold text-red-800 mb-2">عفواً، حدث خطأ</h3>
             <p className="text-red-600 mb-6">{status.message}</p>
             <button 
               onClick={reset}
               className="bg-white border border-red-200 text-red-700 px-6 py-2 rounded-lg hover:bg-red-50 transition-colors font-semibold"
             >
               المحاولة مرة أخرى
             </button>
          </div>
        )}

      </main>
      
      <Footer />
    </div>
  );
};

// Simple Feature Card Component
const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({icon, title, description}) => (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-3">{icon}</div>
        <h4 className="font-bold text-gray-800 mb-1">{title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
)

export default App;