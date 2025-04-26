import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../Data" ;

function NormalLeave() {
    const userID = localStorage.getItem("userID");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [notesFromEmployee, setNotesFromEmployee] = useState("");
    const [coworkerID, setCoworkerID] = useState("");
    const [coworkers, setCoworkers] = useState([]);

    useEffect(() => {
        fetch(`http://agazatyapi.runasp.net/api/Account/GetAllAvailabelCoworkers/${userID}`)
            .then((res) => res.json())
            .then((data) => {
                if (data && data.length > 0) {
                    setCoworkers(data);
                } else {
                    setCoworkers([]);
                }
            })
            .catch((error) => {
                console.error("حدث خطأ أثناء جلب البيانات:", error);
            });
    }, [userID]);


    const handleData = async (e) => {
        e.preventDefault();
        if (!startDate || !endDate || !userID || !coworkerID) {
            Swal.fire("خطأ!", "يرجى ملء جميع الحقول المطلوبة", "error");
            return;
        }

        // إضافة نافذة التأكيد قبل إرسال البيانات
        const result = await Swal.fire({
            title: 'هل أنت متأكد من إرسال الطلب؟',
            text: "لا يمكن التراجع عن هذا الإجراء!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'نعم، إرسال',
            cancelButtonText: 'إلغاء',
        });
    
        if (!result.isConfirmed) {
            return; // لو المستخدم ضغط "إلغاء" مش هيتم إرسال البيانات
        }
    
        const leaveData = {
            startDate: startDate.toString(),
            endDate: endDate.toString(),
            notesFromEmployee: notesFromEmployee || "",
            userID: userID.toString(),
            coworker_ID: coworkerID.toString(),
        };
    
        console.log("Sending data:", leaveData);
    
        try {
            const response = await fetch(
                "http://agazatyapi.runasp.net/api/NormalLeave/CreateNormalLeave",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify(leaveData),
                }
            );
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error:", errorData);

                Swal.fire("خطأ!", `فشل إرسال الطلب: ${errorData.messages || "يرجى المحاولة لاحقًا"}`, "error");
                return;
            } else {
                const successData = await response.json();
                Swal.fire("نجحت!", `تم إرسال الطلب: ${successData.messages || "يرجى انتظار الموافقة"}`, "success");
            }
        } catch (error) {
            Swal.fire("خطأ!", "حدث خطأ أثناء إرسال الطلب", "error");
            console.error("Error:", error);
        }
    };
    
    return (

        <div>
            <div className="zzz d-inline-block p-3 ps-5">
                <h2 className="m-0">طلب اجازة اعتيادية</h2>
            </div>

            <form onSubmit={handleData}>
                <div className="row">
                    <div className="col-sm-12 col-md-6 mt-3">
                        <label htmlFor="startDate" className="form-label">
                            تاريخ بداية الإجازة
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="form-control"
                            id="startDate"
                            required
                        />
                    </div>

                    <div className="col-sm-12 col-md-6 mt-3">
                        <label htmlFor="endDate" className="form-label">
                            تاريخ نهاية الإجازة
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="form-control"
                            id="endDate"
                            required
                        />
                    </div>

                    <div className="col-sm-12 col-md-6 mt-3">
                        <label htmlFor="coworker" className="form-label">القائم بالعمل</label>
                        <input
                            list="coworker-list"
                            className="form-control"
                            id="coworker"
                            placeholder="مثال: يحيى سعد عبدالموجود"
                            onChange={(e) => {
                            const selectedName = e.target.value;
                            const selectedCoworker = coworkers.find(coworker =>
                                `${coworker.fullName} (${coworker.departmentName})` === selectedName
                            );
                            setCoworkerID(selectedCoworker ? selectedCoworker.id : "");
                            }}
                            required
                        />
                        <datalist id="coworker-list" style={{ textAlign: 'right' }}>
                            {coworkers.map((coworker, index) => (
                            <option
                                key={index}
                                value={`${coworker.fullName} (${coworker.departmentName})`}
                            />
                            ))}
                        </datalist>
                    </div>



                    <div className="col-sm-12 col-md-6 mt-3">
                        <label htmlFor="notes" className="form-label">
                            الملاحظات
                        </label>
                        <textarea
                            className="form-control"
                            value={notesFromEmployee}
                            onChange={(e) => setNotesFromEmployee(e.target.value)}
                            id="notes"
                            rows="1"
                            placeholder="اكتب ملاحظاتك"
                        ></textarea>
                    </div>

                    <div className="mt-5">
                        {startDate !== '' && 
                            <div className="mb-2">
                                <label className="flex items-start gap-2">
                                <input type="checkbox" className="mt-1 ms-2" checked disabled />
                                <span>
                                    أقر بأنني أديت أعمالي المصلحية حتى يوم{' '}
                                    <span className="text-danger">{new Date(startDate).toLocaleDateString('ar-EG')} </span>
                                    وهو أخر أيام العمل الرسمية السابقة لابتداء الاجازة الأعتيادية المرخص لي بها وبيانها بعاليه.</span>
                                </label>
                            </div>
                        }
                        { endDate !== '' && 
                            <div>
                                <label className="flex items-start gap-2">
                                <input type="checkbox" className="mt-1 ms-2" checked disabled />
                                <span>
                                    أقر بأنني استأنفت أعمالي المصلحية حتى يوم{' '}
                                    <span className="text-danger">{new Date(endDate).toLocaleDateString('ar-EG')} </span>
                                    وهو اليوم الأول من أيام العمل الرسمية بعد انتهاء الاجازة الأعتيادية المرخص لي بها وبيانها بعاليه.
                                </span>
                                </label>
                            </div>
                        }
                    </div>
                </div>




                <div className="d-flex justify-content-center mt-4">
                    <button type="submit" className="btn btn-primary w-50">
                        إرسال الطلب
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NormalLeave;
