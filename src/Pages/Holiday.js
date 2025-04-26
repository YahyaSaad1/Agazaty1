import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BtnLink from "../components/BtnLink";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Holidays(){
    const [holidays, setHolidays] = useState([])

    console.log(holidays)

    useEffect(()=>{
        fetch(`http://agazatyapi.runasp.net/api/Holiday/GetAllHolidays`)
        .then((res)=> res.json())
        .then((data)=> setHolidays(data))
    }, [])

    const handleDelete = (id) => {
        Swal.fire({
            title: "هل أنت متأكد؟",
            text: "لن تتمكن من استعادة بيانات هذا الاجازة!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "نعم، احذفها!",
            cancelButtonText: "إلغاء",
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://agazatyapi.runasp.net/api/Holiday/DeleteHoliday/${id}`, {
                    method: "DELETE",
                }).then(() => {
                    setHolidays(holidays.filter((holiday) => holiday.id !== id));
                    Swal.fire({
                        title: "تم الحذف!",
                        text: "تم حذف الاجازة بنجاح.",
                        icon: "success",
                        confirmButtonText: "موافق",
                    });
                }).catch((error) => {
                    Swal.fire({
                        title: "خطأ!",
                        text: "حدث خطأ أثناء حذف الاجازة.",
                        icon: "error",
                        confirmButtonText: "حسناً",
                    });
                });
            }
        });
    };

    return(
        <div>
            <div className="d-flex mb-4 justify-content-between">
                <div className="zzz d-inline-block p-3 ps-5">
                    <h2 className="m-0">الاجازات الرسمية</h2>
                </div>
                <div className="p-3">
                    <BtnLink name='إضافة اجازة رسمية' link='/add-holiday' class="btn btn-primary m-0 me-2"/>
                </div>            
            </div>
            <div className="row">
                <div>
                    <table className="m-0 table table-striped">
                        <thead>
                            <tr>
                                <th scope="col" style={{backgroundColor:'#F5F9FF'}}>المرجع</th>
                                <th scope="col" style={{backgroundColor:'#F5F9FF'}}>الاسم</th>
                                <th scope="col" style={{backgroundColor:'#F5F9FF'}}>التاريخ</th>
                                <th scope="col" style={{backgroundColor:'#F5F9FF'}}>المزيد</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holidays.length > 0 ? (
                                holidays.map((holiday ,index)=>(
                                    <tr key={index}>
                                    <th style={{height:'50px'}}>#{holiday.id}</th>
                                    <th style={{height:'50px'}}>{holiday.name}</th>
                                    <th style={{height:'50px'}}>{holiday.date?.slice(0, 10)}</th>
                                    <th style={{height:'50px'}}>
                                        <Link to={`/holiday/edit/${holiday.id}`}>
                                            <FontAwesomeIcon icon={faPenToSquare} color="blue" className="fontt" />
                                        </Link>
                                        <FontAwesomeIcon 
                                            icon={faTrash} 
                                            color="red" 
                                            className="fontt" 
                                            style={{ cursor: "pointer", marginLeft: "10px" }} 
                                            onClick={() => handleDelete(holiday.id)} 
                                        />
                                    </th>
                                </tr>  
                                )
                            ))
                            :   <tr>
                                    <td colSpan="5" className="text-center text-danger p-3">لا يوجد اجازات رسمية حتى الآن</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Holidays;