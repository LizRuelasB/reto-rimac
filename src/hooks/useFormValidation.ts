import { useState, useCallback, useMemo } from 'react';
import { DocumentType } from '../types';

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateDocument = useCallback((documentType: DocumentType, documentNumber: string) => {
    const newErrors: Record<string, string> = {};

    if (!documentNumber.trim()) {
      newErrors.documentNumber = 'El número de documento es requerido';
      return newErrors;
    }

    switch (documentType) {
      case 'DNI':
        if (!/^\d{8}$/.test(documentNumber)) {
          newErrors.documentNumber = 'El DNI debe tener 8 dígitos';
        }
        break;
      case 'CE':
        if (!/^\d{9}$/.test(documentNumber)) {
          newErrors.documentNumber = 'El CE debe tener 9 dígitos';
        }
        break;
      case 'Pasaporte':
        if (!/^[A-Z0-9]{6,12}$/.test(documentNumber)) {
          newErrors.documentNumber = 'El pasaporte debe tener entre 6 y 12 caracteres alfanuméricos';
        }
        break;
    }

    return newErrors;
  }, []);

  const validatePhone = useCallback((phone: string) => {
    const newErrors: Record<string, string> = {};

    if (!phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^9\d{8}$/.test(phone)) {
      newErrors.phone = 'El teléfono debe empezar con 9 y tener 9 dígitos';
    }

    return newErrors;
  }, []);

  const validateLoginForm = useCallback((data: {
    documentType: DocumentType;
    documentNumber: string;
    phone: string;
  }) => {
    const documentErrors = validateDocument(data.documentType, data.documentNumber);
    const phoneErrors = validatePhone(data.phone);

    const allErrors = { ...documentErrors, ...phoneErrors };
    setErrors(allErrors);

    return Object.keys(allErrors).length === 0;
  }, [validateDocument, validatePhone]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  return {
    errors,
    validateLoginForm,
    validateDocument,
    validatePhone,
    clearErrors,
    hasErrors,
  };
};
