import { FaTrash } from "react-icons/fa";
import UploadServerMediaInput from "../../medias/components/UploadServerMediaInput";
import { memo, useEffect, useState } from "react";
import { handleAddDraftItem, handleDraftItemListChange, handleItemListChange, handleRemoveDraftItem, handleRemoveItem } from "../../recipes/utils/draft-utils";

// export default StepLayout;
const EditStepItem = memo(({ step, index, steps, setSteps, recipeId, setSaving, isDraft = true }) => {
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
                        onBlur={(e) => {
                            isDraft ? handleDraftItemListChange(steps, setSteps, "steps", index, "description", e.target.value, recipeId, setSaving) :
                                // handleItemListChange(items, setItems, index, subField, value)
                                handleItemListChange(steps, setSteps, index, "description", e.target.value)
                        }}
                        // value={step.description}
                        // onChange={(e) => handleStepChange(index, "description", e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button
                        className="btn btn-light text-dark"
                        // handleRemoveDraftItem(setItems, field, index, subField, value, recipeId)
                        onClick={() => {
                            isDraft ? handleRemoveDraftItem(setSteps, "steps", index, "description", step.description, recipeId, setSaving) :
                                handleRemoveItem(index, setSteps)
                        }}
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
                    setImage={img => {
                        // handleDraftItemListChange(steps, setSteps, "steps", index, "image", img, recipeId, setSaving)
                        isDraft ? handleDraftItemListChange(steps, setSteps, "steps", index, "image", img, recipeId, setSaving) :
                            handleItemListChange(steps, setSteps, index, "image", img)
                    }}
                    inputKey={index} parentType={"step"} />

            </div>
        </div>
    )
});


const EditStepSection = ({ steps, setSteps, recipeId, setSaving, isDraft = true }) => {
    console.info("render EditStepSection: ", Math.random())

    const handleAddStep = () => {
        // setSteps(prevSteps => [...prevSteps, { description: "", image: null }]);
        isDraft ? handleAddDraftItem(setSteps, "steps", { description: "", image: null }, recipeId, setSaving) :
            setSteps(prev => [...prev, { description: "", image: null }])
    };

    return (
        <div className="mb-3">
            {steps.map((step, index) => (
                <EditStepItem {...{ step, steps, setSteps, index, recipeId, setSaving, isDraft }} />
            ))}
            <button className="btn btn-outline-primary btn-sm" onClick={handleAddStep}>
                + Thêm bước
            </button>
        </div>
    );
};

export default memo(EditStepSection);