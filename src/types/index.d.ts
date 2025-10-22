export type DocumentType = 'DNI' | 'CE' | 'Pasaporte';

export interface UserAPIData {
  name: string;
  lastName: string;
  birthDay: string;
}

export interface UserData extends UserAPIData {
  documentType: DocumentType;
  documentNumber: string;
  phone: string;
  age: number;
}

export interface Plan {
  name: string;
  price: number;
  description: string[];
  age: number;
}

export interface SelectedPlanData extends Plan {
  finalPrice: number;
  isForSomeoneElse: boolean;
}