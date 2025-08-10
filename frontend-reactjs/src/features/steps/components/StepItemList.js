const StepItem = ({ step }) => {
    return (
        <div className="border rounded p-3 bg-light">
            <div className="fw-bold mb-2">Bước {step.order}</div>
            <div>{step.description}</div>
            {step.image && (
                <img
                    src={step.image}
                    alt={`Bước ${step.number}`}
                    className="img-fluid rounded my-2"
                    style={{ width: "50%", objectFit: "cover" }}
                />
            )}
        </div>
    );
};

const StepItemList = ({ steps }) => {
    return (
        <div className="d-flex flex-column gap-4">
            {steps.map((step, index) => (
                <StepItem step={step} />
            ))}
        </div>
    );
};

export default StepItemList;