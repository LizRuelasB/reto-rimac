import { DocumentType } from '../../../../../types';

export interface FormData {
  documentType: DocumentType;
  documentNumber: string;
  phone: string;
  acceptPrivacy: boolean;
  acceptTerms: boolean;
}

export interface FormErrors {
  documentNumber: string;
  phone: string;
  acceptPrivacy: boolean;
  acceptTerms: boolean;
  apiError: string;
}

export interface RegistrationFormProps {
  onNext: () => void;
}
