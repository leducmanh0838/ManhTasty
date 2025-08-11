import { FaTrash } from "react-icons/fa";
import UploadServerMediaInput from "../../medias/components/UploadServerMediaInput";
import { memo, useEffect, useState } from "react";
import { handleAddDraftItem, handleDraftItemListChange, handleRemoveDraftItem } from "../../recipes/utils/draft-utils";

// export default StepLayout;
const EditStepItem = memo(({ step, index, steps, setSteps, recipeId, setSaving }) => {
    console.info("render EditStepItem: ", JSON.stringify(step, null, 2))
    const [tempStep, setTempStep] = useState(step)

    useEffect(() => {
        setTempStep(step);
    }, [step]);

    return (
        <div className="d-flex">
            <div class="d-inline-flex justify-content-center align-items-center bg-dark text-white rounded-circle m-2"
                style={{
                    width: '30px',
                    height: '30px',
                }}>
                {index + 1}
            </div>
            <div
                key={index}
                className="mb-3" style={{ flex: 1 }}>
                <div className="d-flex align-items-center mb-2">
                    <textarea
                        className="form-control me-2"
                        rows={2}
                        placeholder={`Bước ${index + 1}`}
                        value={tempStep.description}
                        onChange={(e) => setTempStep(prev => ({
                            ...prev,
                            description: e.target.value
                        }))}
                        // onBlur={(e) => handleTempStepChange("description", e.target.value)}
                        onBlur={(e) => handleDraftItemListChange(steps, setSteps, "steps", index, "description", e.target.value, recipeId, setSaving)}
                        // value={step.description}
                        // onChange={(e) => handleStepChange(index, "description", e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button
                        className="btn btn-light text-dark"
                        // handleRemoveDraftItem(setItems, field, index, subField, value, recipeId)
                        onClick={() => handleRemoveDraftItem(setSteps, "steps", index, "description", step.description, recipeId, setSaving)}
                        // onClick={() => handleRemoveTempStep(index, step.description)}
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
                <UploadServerMediaInput image={step.image} isCloudinary={true}
                    // setImage={img => { handleTempStepChange("image", img); }}
                    setImage={img => handleDraftItemListChange(steps, setSteps, "steps", index, "image", img, recipeId, setSaving)}
                    inputKey={index} parentType={"step"} />

            </div>
        </div>
    )
});


const EditStepSection = ({ steps, setSteps, recipeId, setSaving }) => {
    console.info("render EditStepSection: ", Math.random())

    const handleAddStep = () => {
        // setSteps(prevSteps => [...prevSteps, { description: "", image: null }]);
        handleAddDraftItem(setSteps, "steps", { description: "", image: null }, recipeId, setSaving);
    };

    return (
        <div className="mb-3">
            <h5 className="mb-3">Các bước thực hiện</h5>
            {steps.map((step, index) => (
                <EditStepItem {...{ step, steps, setSteps, index, recipeId, setSaving }} />
            ))}
            <button className="btn btn-outline-primary btn-sm" onClick={handleAddStep}>
                + Thêm bước
            </button>
        </div>
    );
};

export default memo(EditStepSection);