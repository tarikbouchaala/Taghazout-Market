import React, { useState } from "react";
import { TiTick } from "react-icons/ti";
import "./Stepper.css";

const Stepper = () => {
  const steps = ["Customer Info", "Shipping Info", "Payment"];
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  return (
    <>
        <div className=" flex flex-col gap-10 h-10 items-center justify-center">

      <div className="flex justify-between">
        {steps?.map((step, i) => (
          <div
            key={i}
            className={`step-item ${currentStep === i + 1 && "active"} ${
              (i + 1 < currentStep || complete) && "complete"
            } `}
          >
            <div className="step">
              {i + 1 < currentStep || complete ? <TiTick size={24} /> : i + 1}
            </div>
            <p className="text-gray-500 text-sm">{step}</p>
          </div>
        ))}
      </div>
      {!complete && (
        <button
          className="btn bg-orange-500"
          onClick={() => {
            currentStep === steps.length
              ? setComplete(true)
              : setCurrentStep((prev) => prev + 1);
          }}
        >
          {currentStep === steps.length ? "Finish" : "Next"}
        </button>
      )}
      </div>
    </>
  );
};

export default Stepper;
