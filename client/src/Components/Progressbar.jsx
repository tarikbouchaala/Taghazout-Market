import React, { useState } from "react";
import { Stepper, Step, Typography } from "@material-tailwind/react";
import {
  CogIcon,
  UserIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

export default function Progressbar({activeStep}) {
  // const [activeStep, setActiveStep] = React.useState(3);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  // const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  // const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  return (
    <div className="w-11/12 lg:w-4/6 mx-auto mb-32">
      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        <Step >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>

          <div className="absolute -bottom-[6rem] w-max text-center">
            <Typography
              variant="h6"
              className={`font-normal ${activeStep === 0 ? "text-orange-500" : "text-gray-900"
                }`}
            // className="orange-500"
            ></Typography>
            <Typography
              className={`font-normal ${activeStep === 0 ? "text-orange-500" : "text-gray-900"
                }`}
            >
              
              <div className=" -mt-16 ">
                <img
                  className=" w-14 ms-8"
                  src="https://i.imgur.com/9nnc9Et.png"
                  alt="Order Processed"
                />
                <p  className="hidden lg:block"> Order Processed</p>
              </div>
            </Typography>
          </div>
        </Step>
        <Step >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          <div className="absolute -bottom-[6rem] w-max text-center">
            <Typography
              variant="h6"
              className={`font-normal ${activeStep === 1 ? "text-orange-500" : "text-gray-900"
                }`}
            ></Typography>
            <Typography
              className={`font-normal ${activeStep === 1 ? "text-orange-500" : "text-gray-900"
                }`}
            >
              <div className="-mt-16 ">
                <img
                  className=" w-14 ms-8"
                  src="https://i.imgur.com/u1AzR7w.png"
                  alt="Order Processed"
                />
                <p className="hidden lg:block"> Order Shipped</p>
              </div>
            </Typography>
          </div>
        </Step>
        <Step >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          <div className="absolute -bottom-[6rem] w-max text-center">
            <Typography
              variant="h6"
              className={`font-normal ${activeStep === 2 ? "text-orange-500" : "text-gray-900"
                }`}
            ></Typography>
            <Typography
              className={`font-normal ${activeStep === 2 ? "text-orange-500" : "text-gray-900"
                }`}
            >
              <div className="-mt-16 ">
                <img
                  className=" w-14 ms-8 text-red-400"
                  src="https://i.imgur.com/TkPm63y.png"
                  alt="Order Processed"
                />
                <p className="hidden lg:block"> Order En Route</p>
              </div>
            </Typography>
          </div>
        </Step>
        <Step >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          <div className="absolute -bottom-[6rem] w-max text-center">
            <Typography
              variant="h6"
              className={`font-normal ${activeStep === 3 ? "text-orange-500" : "text-gray-900"
                }`}
            ></Typography>
            <Typography
              className={`font-normal ${activeStep === 3 ? "text-orange-500" : "text-gray-900"
                }`}
            >
              <div className="-mt-16 ">
                <img
                  className=" w-14 ms-8"
                  src="https://i.imgur.com/HdsziHP.png"
                  alt="Order Processed"
                />
                <p className="hidden lg:block"> Order Arrived</p>
              </div>
            </Typography>
          </div>
        </Step>
      </Stepper>
    </div>
  );
}
