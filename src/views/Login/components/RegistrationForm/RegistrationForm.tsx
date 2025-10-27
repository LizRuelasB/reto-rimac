import React, { ChangeEvent, useState } from 'react';
import { UserData } from '../../../../types';
import { getUserData } from '../../../../utils/api';
import { useRegistration } from '../../../../context/RegistrationContext';
import { useFormValidation, useLoadingState, useErrorHandler } from '../../../../hooks';
import { CustomFilledInput } from '../../../../components/ui/CustomFilledInput/CustomFilledInput';
import './RegistrationForm.scss'
import { FormData, FormErrors, RegistrationFormProps } from './types';


const calculateAge = (birthDay: string): number => {
  const parts = birthDay.split('-');
  const birthDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onNext }) => {
  const { setUserDataAndInitialForm } = useRegistration();
  const { errors, validateLoginForm, clearErrors } = useFormValidation();
  const { isLoading, withLoading } = useLoadingState();
  const { error: apiError, handleError, clearError } = useErrorHandler();
  
  const [formData, setFormData] = useState<FormData>({
    documentType: 'DNI',
    documentNumber: '',
    phone: '',
    acceptPrivacy: false,
    acceptTerms: false,
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({
      documentNumber: '',
      phone: '',
      acceptPrivacy: false,
      acceptTerms: false,
      apiError: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    const isCheckbox = type === 'checkbox';
    let newValue: string | boolean = isCheckbox ? (e.target as HTMLInputElement).checked : value;

    if (name === 'documentNumber' || name === 'phone') {
        const numericValue = value.replace(/\D/g, ''); 
        if (name === 'documentNumber') {
            newValue = numericValue.slice(0, 8); 
        } else if (name === 'phone') {
            newValue = numericValue.slice(0, 9); 
        }
    }
    
    if (name === 'documentNumber' || name === 'phone') {
      clearErrors();
    }
    
    setFormErrors(prev => ({
        ...prev,
        ...(prev[name as 'documentNumber' | 'phone'] !== undefined && {[name as 'documentNumber' | 'phone']: ''}),
        ...(name === 'acceptPrivacy' && { acceptPrivacy: false }),
        ...(name === 'acceptTerms' && { acceptTerms: false }),
        apiError: '',
    }));


    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };
  

  const validateForm = (): boolean => {
      const isValidForm = validateLoginForm({
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        phone: formData.phone,
      });
      
      const newErrors: FormErrors = {
          documentNumber: errors.documentNumber || '',
          phone: errors.phone || '',
          acceptPrivacy: false,
          acceptTerms: false,
          apiError: '',
      };
      
      let isValid = isValidForm;
      
      if (!formData.acceptPrivacy) {
          newErrors.acceptPrivacy = true;
          isValid = false;
      }
      if (!formData.acceptTerms) {
          newErrors.acceptTerms = true;
          isValid = false;
      }
      
      setFormErrors(newErrors);
      return isValid;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormErrors({ 
        documentNumber: '', 
        phone: '', 
        acceptPrivacy: false, 
        acceptTerms: false, 
        apiError: '' 
    });

    if (!validateForm()) {
        return; 
    }
    
    await withLoading(async () => {
      try {
        const apiUserData = await getUserData();
        const age = calculateAge(apiUserData.birthDay);

        const completeUserData: UserData = {
          ...apiUserData,
          documentType: formData.documentType,
          documentNumber: formData.documentNumber,
          phone: formData.phone,
          age: age,
        };

        setUserDataAndInitialForm(completeUserData, {
          documentType: formData.documentType,
          documentNumber: formData.documentNumber,
          phone: formData.phone,
        });

        onNext();

      } catch (error: any) {
        const errorMessage = error.message || 'Ocurrió un error al obtener los datos del usuario.';
        handleError(errorMessage);
        setFormErrors(prev => ({
            ...prev, 
            apiError: errorMessage,
        }));
      }
    });
  };


  const tipoDocumentoOptions = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'Carnet Extranjería' },
  ];
  
  const formatErrorText = (text: string) => text ? `*${text}` : '';


  return (
    <form onSubmit={handleSubmit}>
      <div className='flex mb-4'>
        <div className='w-[140px]'>
          <CustomFilledInput
            label=""
            name="documentType"
            value={formData.documentType}
            onChange={handleChange}
            options={tipoDocumentoOptions}
            borderRadius="8px 0 0 8px"
            borderRight="none"
       
          />
        </div>

        <CustomFilledInput
          label="Nro. de documento"
          name="documentNumber"
          value={formData.documentNumber}
          onChange={handleChange}
          borderRadius="0 8px 8px 0"
          type="tel"
          helperText={formatErrorText(formErrors.documentNumber)}
          isInvalid={!!formErrors.documentNumber}
        />
      </div>

      <CustomFilledInput
        label="Celular"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        helperText={formatErrorText(formErrors.phone)}
        isInvalid={!!formErrors.phone}
      />

      <div className='my-6'>
        <div className="registration-form__checkbox">
          <input
            id="acceptPrivacy"
            type="checkbox"
            name="acceptPrivacy"
            checked={formData.acceptPrivacy}
            onChange={handleChange}
            className={`registration-form__checkbox__input ${formErrors.acceptPrivacy ? 'input--error' : ''}`}
          />
          <label
            htmlFor="acceptPrivacy"
            className="registration-form__checkbox__label"
            style={{ color: formErrors.acceptPrivacy ? '#E53E3E' : '#03050F' }}
          >
            Acepto la Política de Privacidad
          </label>
        </div>

        <div className="registration-form__checkbox">
          <input
            id="acceptTerms"
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className={`registration-form__checkbox__input ${formErrors.acceptTerms ? 'input--error' : ''}`}
          />
          <label
            htmlFor="acceptTerms"
            className="registration-form__checkbox__label"
            style={{ color: formErrors.acceptTerms ? '#E53E3E' : '#03050F' }}
          >
            Acepto la Política Comunicaciones Comerciales
          </label>
        </div>

        <div>
          <a href="#"
            className="registration-form__terms-link"
          >Aplican Términos y Condiciones.</a>
        </div>
      </div>


      <button
        type="submit"
        className="registration-form__button"
        disabled={isLoading} 
      >
        {isLoading ? 'Cargando...' : 'Cotiza aquí'}
      </button>

      {(formErrors.apiError || apiError) && (
        <div className="registration-form__error-message" role="alert">
          {formErrors.apiError || apiError}
        </div>
      )}

    </form>
  );
};

export default RegistrationForm;
