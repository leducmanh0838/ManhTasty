// import React from "react";
// import { FaTrash } from "react-icons/fa";

// const IngredientList = ({ ingredients, setIngredients }) => {
//     const handleAddIngredient = () => {
//         setIngredients([...ingredients, { name: "", quantity: "" }]);
//     };

//     const handleChange = (idx, field, value) => {
//         const newItems = [...ingredients];
//         newItems[idx][field] = value;
//         setIngredients(newItems);
//     };

//     const handleRemove = (idx) => {
//         const newItems = ingredients.filter((_, i) => i !== idx);
//         setIngredients(newItems);
//     };

//     return (
//         <div className="mb-3">
//             <h5>Nguyên liệu</h5>
//             {/* <label className="form-label">Nguyên liệu</label> */}
//             {ingredients.map((item, idx) => (
//                 <div className="d-flex align-items-center mb-2" key={idx}>
//                     <div className="row me-2" style={{ flex: 1 }}>
//                         <div className="col-md-7">
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 placeholder={`Tên nguyên liệu ${idx + 1}`}
//                                 value={item.name}
//                                 onChange={(e) => handleChange(idx, "name", e.target.value)}
//                             />
//                         </div>
//                         <div className="col-md-5">
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 placeholder="Số lượng (vd: 2 quả)"
//                                 value={item.quantity}
//                                 onChange={(e) => handleChange(idx, "quantity", e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     {/* <div className="col-md-2">
//                         <button className="btn btn-danger" onClick={() => handleRemove(idx)}>
//                             Xoá
//                         </button>
//                     </div> */}
//                     <button
//                         className="btn btn-light text-dark"
//                         onClick={() => handleRemove(idx)}
//                         title="Xoá"
//                     >
//                         <FaTrash />
//                     </button>
//                 </div>
//             ))}
//             <div>
//                 <button className="btn btn-outline-primary btn-sm" onClick={handleAddIngredient}>
//                     + Thêm nguyên liệu
//                 </button>
//             </div>
//         </div>
//     );
// }

import { useState } from "react";
import { FaTrash } from "react-icons/fa";

const IngredientList = ({ ingredients, setIngredients, errors, setErrors }) => {
    // const [errors, setErrors] = useState([]);

    const specialCharRegex = /[^a-zA-ZÀ-ỹ0-9\s]/;

    const validateField = (value) => {
        if (!value.trim()) return "Không được để trống";
        if (specialCharRegex.test(value)) return "Không được chứa ký tự đặc biệt";
        return "";
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: "", quantity: "" }]);
        setErrors([...errors, { name: "", quantity: "" }]);
    };

    const handleChange = (idx, field, value) => {
        const newItems = [...ingredients];
        newItems[idx][field] = value;
        setIngredients(newItems);

        const newErrors = [...errors];
        const errorMsg = validateField(value);
        if (!newErrors[idx]) newErrors[idx] = {};
        newErrors[idx][field] = errorMsg;
        setErrors(newErrors);
    };

    const handleRemove = (idx) => {
        const newItems = ingredients.filter((_, i) => i !== idx);
        const newErrors = errors.filter((_, i) => i !== idx);
        setIngredients(newItems);
        setErrors(newErrors);
    };

    return (
        <div className="mb-3">
            <h5>Nguyên liệu</h5>
            {ingredients.map((item, idx) => (
                <div className="d-flex align-items-start mb-3" key={idx}>
                    <div className="row me-2" style={{ flex: 1 }}>
                        <div className="col-md-7 mb-1">
                            <input
                                type="text"
                                className={`form-control ${errors[idx]?.name ? "is-invalid" : ""}`}
                                placeholder={`Tên nguyên liệu ${idx + 1}`}
                                value={item.name}
                                onChange={(e) => handleChange(idx, "name", e.target.value)}
                            />
                            {errors[idx]?.name && (
                                <div className="invalid-feedback">{errors[idx].name}</div>
                            )}
                        </div>
                        <div className="col-md-5 mb-1">
                            <input
                                type="text"
                                className={`form-control ${errors[idx]?.quantity ? "is-invalid" : ""}`}
                                placeholder="Số lượng (vd: 2 quả)"
                                value={item.quantity}
                                onChange={(e) => handleChange(idx, "quantity", e.target.value)}
                            />
                            {errors[idx]?.quantity && (
                                <div className="invalid-feedback">{errors[idx].quantity}</div>
                            )}
                        </div>
                    </div>
                    <button
                        className="btn btn-light text-dark mt-1"
                        onClick={() => handleRemove(idx)}
                        title="Xoá"
                    >
                        <FaTrash />
                    </button>
                </div>
            ))}
            <div>
                <button className="btn btn-outline-primary btn-sm" onClick={handleAddIngredient}>
                    + Thêm nguyên liệu
                </button>
            </div>
        </div>
    );
};


export default IngredientList;
