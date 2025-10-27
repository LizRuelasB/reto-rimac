import React from 'react';
import './Steps.scss';
import back from '../../../assets/icons/icon-back-gray.svg';
import { StepsProps } from './types';
export type { Step } from './types';

const Steps: React.FC<StepsProps> = ({ steps, currentStep, onGoBack }) => {

  const totalSteps = steps.length;
  const currentStepNumber = currentStep;
  const progressPercentage = (currentStepNumber / totalSteps) * 100;

  return (
    <div className="steps-container">
      
      <div className="steps-mobile flex gap-4 lg:hidden">
        {onGoBack && (
          <button className="steps-mobile__back-button" onClick={onGoBack} aria-label="Retroceder">
            <img src={back} alt="back" />
          </button>
        )}
        
        <div className="steps-mobile__content">
          <span className="steps-mobile__label">
            PASO {currentStepNumber} DE {totalSteps}
          </span>
          <div className="steps-mobile__progress-bar">
            <div 
              className="steps-mobile__progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="steps-desktop hidden lg:flex">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div 
              className={`steps__item ${
                step.number === currentStep 
                  ? 'steps__item--active' 
                  : step.number < currentStep 
                  ? 'steps__item--completed' 
                  : ''
              }`}
            >
              <div className="steps__number">
                {step.number}
              </div>
              <span className="steps__label">{step.label}</span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={`steps__separator ${
                  step.number < currentStep ? 'steps__separator--completed' : ''
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Steps;