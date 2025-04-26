import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileCom from "../components/ProfileCom";
import ProfileDescription from "../components/ProfileDescription";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import { faTable } from "@fortawesome/free-solid-svg-icons";

function ProfileForHR(){
    const {userID} = useParams();
    const [user, setUser] = useState([]);

    useEffect(()=>{
        fetch(`http://agazatyapi.runasp.net/api/Account/GetUserById/${userID}`)
        .then((res)=> res.json())
        .then((data)=> setUser(data))
    }, [userID])

    const handleLeaveUpdate = async () => {
        const { value: decision } = await Swal.fire({
            title: 'هل تريد إضافة أم خصم أيام الإجازة؟',
            input: 'radio',
            inputOptions: {
                true: 'إضافة أيام',
                false: 'خصم أيام'
            },
            inputValidator: (value) => {
                if (!value) {
                return 'يجب اختيار أحد الخيارين';
                }
            },
            showCancelButton: true,
            confirmButtonText: 'التالي',
            cancelButtonText: 'إلغاء'
            });
        
            if (decision === undefined) return;
        
            const { value: days } = await Swal.fire({
            title: decision === 'true' ? 'كم عدد الأيام التي تريد إضافتها؟' : 'كم عدد الأيام التي تريد خصمها؟',
            input: 'number',
            inputLabel: 'عدد الأيام',
            inputPlaceholder: 'مثال: 3',
            showCancelButton: true,
            confirmButtonText: 'تنفيذ',
            cancelButtonText: 'إلغاء',
            inputValidator: (value) => {
                if (!value || isNaN(value) || parseInt(value) <= 0) {
                return 'يرجى إدخال رقم أكبر من صفر';
                }
            }
            });
        
            if (days === undefined) return;
        
            try {
            const response = await fetch(`http://agazatyapi.runasp.net/api/NormalLeave/MinusOrAddNormalLeavesToUser/${userID}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                days: parseInt(days),
                decision: decision === 'true'
                })
            });
        
            if (response.ok) {
                Swal.fire('تم!', 'تم تعديل عدد أيام الإجازات بنجاح', 'success');
            } else {
                Swal.fire('خطأ!', 'حدث خطأ أثناء التعديل', 'error');
            }
            } catch (error) {
            Swal.fire('خطأ!', 'تعذر الاتصال بالخادم', 'error');
            }
        };


        const handleDownload = async () => {
            try {
                const response = await fetch(`http://agazatyapi.runasp.net/api/Account/export-user-excel/${user.nationalID}`, {
                    method: 'GET',
                });
            
                if (!response.ok) {
                    throw new Error('Download failed');
                }
            
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'user.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                } catch (error) {
                console.error('Error downloading the Excel file:', error);
                }
            };

    return(
        <div>
            <div className="d-flex mb-4 justify-content-between">
                <div className="zzz d-inline-block p-3 ps-5">
                    <h2 className="m-0">الملف الشخصي</h2>
                </div>
                <div className="d-flex">
                    <button onClick={handleDownload} className="m-3 btn btn-success d-flex justify-content-center align-items-center">
                        <FontAwesomeIcon icon={faTable} style={{ fontSize: "1.4rem" }} color="#fff" className="ms-2" />
                        <span>تنزيل بيانات الموظف</span>
                    </button>

                    <button className="m-3 btn btn-primary" onClick={handleLeaveUpdate}>
                        تعديل عدد أيام الإجازات
                    </button>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12 col-md-6 col-lg-5 col-xl-4 col-xxl-3 mt-4">
                    <ProfileCom user={user} />
                </div>
                <div className="col-sm-12 col-md-6 col-lg-7 col-xl-8 col-xxl-9 mt-4">
                    <ProfileDescription user={user} />
                </div>
            </div>
        </div>
    )
}

export default ProfileForHR;