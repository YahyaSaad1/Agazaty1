import React, { useState } from 'react';
import axios from 'axios';
import BtnLink from '../components/BtnLink';
import Import from '../Images/import.png';
import Export from '../Images/export.png';
import Equal from '../Images/equal.png';

const UploadUsersExcel = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [selectedOption, setSelectedOption] = useState('new');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
        setMessage("من فضلك اختر ملف Excel أولاً.");
        return;
        }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/Account/upload-users-excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setMessage("تم رفع الملف بنجاح ✅");
      console.log(response.data);
    } catch (error) {
        setMessage("حدث خطأ أثناء رفع الملف ❌");
        console.error(error);
        }
    };

    return (
        <div>
            <div className="d-flex mb-4 justify-content-between">
                <div className="zzz d-inline-block p-3 ps-5">
                    <h2 className="m-0">رفع موظف</h2>
                </div>
                <div className="d-flex">
                    <BtnLink name='إضافة موظف يدويا' link='/add-employee' class="m-3 btn btn-primary m-0"/>
                </div>
            </div>

            <div className='p-3'>
                <div className='row d-flex p-3 parent box'>
                    <section className='col-sm-12 col-md p-5 box'>
                        <div className='d-flex'>
                            <div>
                                <h2>الخطوة 1</h2>
                                <p>تنزيل ملف Excel</p>
                            </div>
                            <img src={Import} className="img-responsive" alt="profilePicture" />
                        </div>
                        <h4>تعليمات</h4>
                        <ul>
                            <li>قم بتنزيل ملف التنسيق واملأه بالبيانات الصحيحة.</li>
                            <li>يمكنك تنزيل ملف المثال لفهم كيفية تعبئة البيانات.</li>
                            <li>يجب رفع ملف Excel.</li>
                        </ul>
                    </section>

                    <section className='col-sm-12 col-md p-5 box'>
                        <div className='d-flex'>
                            <div>
                                <h2>الخطوة 2</h2>
                                <p>مطابقة بيانات جدول البيانات وفقًا للتعليمات</p>
                            </div>
                            <img src={Equal} className="img-responsive" alt="profilePicture" />
                        </div>
                        <h4>تعليمات</h4>
                        <ul>
                            <li>املأ البيانات وفقًا للتنسيق والتحقق.</li>
                            <li>يمكنك الحصول على معرّف المتجر ومعرّف الوحدة من قائمتهم، يرجى إدخال المعرفات الصحيحة.</li>
                            <li></li>
                        </ul>
                    </section>

                    <section className='col-sm-12 col-md p-5 box'>
                        <div className='d-flex'>
                            <div>
                                <h2>الخطوة 3</h2>
                                <p>تحقق من البيانات وأكمل الاستيراد</p>
                            </div>
                            <img src={Export} className="img-responsive" alt="profilePicture" />
                        </div>
                        <h4>تعليمات</h4>
                        <ul>
                            <li>في قسم تحميل ملف Excel، اختر أولاً خيار التحميل.</li>
                            <li>قم بتحميل ملفك بتنسيق .xls أو .xlsx.</li>
                            <li>أخيرًا اضغط على زر التحميل.</li>
                            <li>يمكنك تحميل صور منتجاتك في مجلد المنتج من المعرض ونسخ مسار الصورة.</li>
                            <li></li>
                        </ul>
                    </section>
                </div>

                <div className='row d-flex p-3 parent box mt-4'>
                    <section className='col-sm-12 col-md box2'>
                        <label>اختر نوع تحميل البيانات</label>
                        <div className='box'>
                            111111
                        </div>
                    </section>
                    <section className='col-sm-12 col-md box2'>
                        <label id='title2'>استيراد ملف العناصر</label>
                        <input onChange={handleFileChange} accept=".xlsx, .xls" type='file' htmlFor='title2' />
                    </section>
                </div>

                <div className="max-w-md mx-auto mt-6">
                    <div className="border rounded-md overflow-hidden">
                        {/* تحميل بيانات جديدة */}
                        <label className={`flex items-center justify-between p-4 cursor-pointer transition ${selectedOption === 'new' ? 'bg-blue-50' : ''}`}>
                        <span className="text-right flex-1 text-gray-800 font-semibold">تحميل بيانات جديدة</span>
                        <input type="radio" name="uploadOption" value="new" checked={selectedOption === 'new'} onChange={() => setSelectedOption('new')} className="form-radio text-blue-600 focus:ring-blue-500"/>
                        </label>

                        {/* تحديث البيانات الحالية */}
                        <label className={`flex items-center justify-between p-4 cursor-pointer transition ${selectedOption === 'update' ? 'bg-blue-50' : ''}`}>
                        <span className="text-right flex-1 text-gray-800">تحديث البيانات الحالية</span>
                        <input type="radio" name="uploadOption" value="update" checked={selectedOption === 'update'} onChange={() => setSelectedOption('update')} className="form-radio text-blue-600 focus:ring-blue-500"/>
                        </label>
                    </div>
                </div>

                <button >رفع الملف</button>
                {message && <p className="mt-3">{message}</p>}
            </div>
        </div>
    );
};

export default UploadUsersExcel;
