import React, { useState, useMemo } from 'react';
import { Search, Users } from 'lucide-react';
import FileUploader from './components/FileUploader';
import MemberCard from './components/MemberCard';
import { CsvRow, Member } from './types';

function App() {
  const [rawMembers, setRawMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);

  // Transform CSV raw data into our internal Member interface
  const handleDataLoaded = (data: CsvRow[]) => {
    const transformed: Member[] = data.map((row, index) => ({
      id: `member-${index}`,
      fullName: row['الاسم الرباعي'] || 'Unknown Name',
      nationalId: row['رقم لهوية'] || 'N/A',
      birthDate: row['تاريخ الميلاد'] || '',
      phoneNumber: row['رقم الجوال'] || '',
      photoUrl: row['ارفق صورة شخصية'] || '', // In real usage, this might be empty based on the sample provided
      region: row['الإقليم'] || '',
      university: row['الجامعة'] || '',
      role: row['صفة المشاركة'] || 'مشارك'
    })).filter(m => m.fullName !== 'Unknown Name'); // Simple filter to remove empty rows

    setRawMembers(transformed);
    setHasLoaded(true);
  };

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const lowerQuery = searchQuery.toLowerCase();
    return rawMembers.filter(member => 
      member.fullName.toLowerCase().includes(lowerQuery) ||
      member.nationalId.includes(lowerQuery)
    );
  }, [rawMembers, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
               <Users className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight hidden sm:block">
              دليل الأعضاء
            </h1>
          </div>
          
          {hasLoaded && (
            <div className="flex-1 max-w-md mr-4">
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm"
                  placeholder="ابحث بالاسم أو رقم الهوية..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {!hasLoaded ? (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in-up">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">تحميل بيانات الأعضاء</h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    قم برفع ملف CSV يحتوي على بيانات الأعضاء للبدء في عملية البحث والاستعراض.
                </p>
            </div>
            <FileUploader onDataLoaded={handleDataLoaded} />
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Search Status */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-700">
                    نتائج البحث
                    {searchQuery && (
                        <span className="text-sm font-normal text-gray-500 mr-2">
                            ({filteredMembers.length} نتيجة)
                        </span>
                    )}
                </h2>
                {searchQuery === '' && (
                    <span className="text-sm text-gray-400">ابدأ بالكتابة للبحث...</span>
                )}
            </div>

            {/* Results Grid */}
            {filteredMembers.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                 {searchQuery ? (
                     <>
                        <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">لا توجد نتائج</h3>
                        <p className="text-gray-500 mt-1">لم نعثر على أي عضو يطابق بحثك "{searchQuery}"</p>
                     </>
                 ) : (
                    <>
                        <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                             <Search className="h-6 w-6 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">بانتظار البحث</h3>
                        <p className="text-gray-500 mt-1">اكتب اسم العضو أو رقم الهوية في الخانة أعلاه</p>
                    </>
                 )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;