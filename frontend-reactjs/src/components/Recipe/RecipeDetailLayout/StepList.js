const StepList = ({ steps }) => {
  return (
    <div className="d-flex flex-column gap-4">
      {steps.map((step, index) => (
        <div key={index} className="border rounded p-3 bg-light">
          <div className="fw-bold mb-2">Bước {step.order}</div>
          <div>{step.description}</div>
          {step.image && (
            <img
              src={step.image}
              alt={`Bước ${step.number}`}
              className="img-fluid rounded my-2"
              style={{ maxHeight: "200px", objectFit: "cover" }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepList;
