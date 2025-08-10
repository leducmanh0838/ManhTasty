import { useEffect } from "react";
import { FaCamera, FaTrash } from "react-icons/fa";
import UploadMediaInput from "../../../features/medias/components/UploadMediaInput";

// export default StepLayout;

const StepLayout = ({ steps, setSteps }) => {
    const handleSetStepImage = (index, newImage) => {
        console.info("newImage: ", newImage)
        setSteps(prevSteps => {
            const newSteps = [...prevSteps];
            newSteps[index] = {
                ...newSteps[index],
                image: newImage,
            };
            return newSteps;
        });
    };

    const handleAddStep = () => {
        setSteps([...steps, { description: "", image: null }]);
    };

    const handleStepChange = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    };

    const handleRemoveStep = (index) => {
        const newSteps = [...steps];
        newSteps.splice(index, 1); // Xoá phần tử ở vị trí index
        setSteps(newSteps);
    };

    return (
        <div className="mb-3">
            <h5 className="mb-3">Các bước thực hiện</h5>
            {steps.map((step, idx) => (
                <div className="d-flex">
                    <div class="d-inline-flex justify-content-center align-items-center bg-dark text-white rounded-circle m-2"
                        style={{
                            width: '30px',
                            height: '30px',
                        }}>
                        {idx + 1}
                    </div>
                    <div key={idx} className="mb-3" style={{ flex: 1 }}>
                        <div className="d-flex align-items-center mb-2">
                            <textarea
                                className="form-control me-2"
                                rows={2}
                                placeholder={`Bước ${idx + 1}`}
                                value={step.description}
                                onChange={(e) => handleStepChange(idx, "description", e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button
                                className="btn btn-light text-dark"
                                onClick={() => handleRemoveStep(idx)}
                                title="Xoá bước"
                            >
                                <FaTrash />
                            </button>
                        </div>

                        {/* <input
                        type="file"
                        accept="image/*"
                        className="form-control mb-2"
                        onChange={(e) => handleStepChange(idx, "image", e.target.files[0])}
                    /> */}
                        <UploadMediaInput image={step.image} setImage={img => handleSetStepImage(index, img)} inputKey={index}/>
                        {/* <div className="mb-2">
                            <input
                                type="file"
                                accept="image/*"
                                id={`step-image-${idx}`}
                                className="d-none"
                                onChange={(e) => handleStepChange(idx, "image", e.target.files[0])}
                            />

                            <label
                                htmlFor={`step-image-${idx}`}
                                className="upload-box"
                                style={{
                                    display: "flex",
                                    // justifyContent: "center",
                                    // alignItems: "center",
                                    backgroundColor: "#faf8f5",
                                    border: "2px dashed #ddd",
                                    borderRadius: "12px",
                                    width: "180px",
                                    height: "180px",
                                    cursor: "pointer",
                                }}
                            >
                                {step.image ? (
                                    <img
                                        src={URL.createObjectURL(step.image)}
                                        alt="Ảnh bước"
                                        style={{ height: "180px", objectFit: "contain" }}
                                    />
                                ) : (
                                    <div className="w-100 w-100 d-flex align-items-center justify-content-center">
                                        <FaCamera size={32} color="#ccc" />
                                    </div>
                                )}
                            </label>
                        </div> */}

                    </div>
                </div>
            ))}
            <button className="btn btn-outline-primary btn-sm" onClick={handleAddStep}>
                + Thêm bước
            </button>
        </div>
    );
};

export default StepLayout;
