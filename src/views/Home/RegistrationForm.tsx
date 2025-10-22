import React, { ChangeEvent, useState } from 'react';
import { DocumentType, UserData } from '../../types';
import { getUserData } from '../../api';
import { useRegistration } from '../../context/RegistrationContext';
import { CustomFilledInput } from '../../components/ui/CustomFilledInput';
import './RegistrationForm.scss'

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

interface FormData {
  documentType: DocumentType;
  documentNumber: string;
  phone: string;
  acceptPrivacy: boolean;
  acceptTerms: boolean;
}

interface RegistrationFormProps {
  onNext: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onNext }) => {
  const { setUserDataAndInitialForm } = useRegistration();
  const [formData, setFormData] = useState<FormData>({
    documentType: 'DNI',
    documentNumber: '',
    phone: '',
    acceptPrivacy: false,
    acceptTerms: false,
  });
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    const isCheckbox = type === 'checkbox';
    const newValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.documentNumber || !formData.phone) {
      setValidationError('Los campos de documento y celular son obligatorios.');
      return;
    }
    if (!formData.acceptPrivacy || !formData.acceptTerms) {
      setValidationError('Debe aceptar las Políticas para continuar.');
      return;
    }

    setIsLoading(true);

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

      console.log(completeUserData)

      onNext();

    } catch (error: any) {
      setValidationError(error.message || 'Ocurrió un error al obtener los datos del usuario.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  const tipoDocumentoOptions = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'Carnet Extranjería' },
  ];


  return (
    <form onSubmit={handleSubmit}>
      <div style={{
        display: 'flex',
        marginBottom: '16px'
      }}>
        <div style={{
          width: '140px'
        }}>
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

        />
      </div>

      <CustomFilledInput
        label="Celular"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
      />

      <div style={{
        margin: '24px 0px'
      }}>
        <div className="registration-form__checkbox">
          <input
            id="acceptPrivacy"
            type="checkbox"
            name="acceptPrivacy"
            checked={formData.acceptPrivacy}
            onChange={handleChange}
            className="registration-form__checkbox__input"
          />
          <label
            htmlFor="acceptPrivacy"
            className="registration-form__checkbox__label"
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
            className="registration-form__checkbox__input"
          />
          <label
            htmlFor="acceptTerms"
            className="registration-form__checkbox__label"
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
      >
        {isLoading ? 'Cargando...' : 'Cotiza aquí'}
      </button>

      {validationError && (
        <div className="registration-form__error-message" role="alert">
          {validationError}
        </div>
      )}

    </form>
  );
};

export default RegistrationForm;