export const formatTextWithBoldString = (text: string, boldString: string) => {
  if (!boldString || boldString.trim() === '') return { text, hasBold: false };

  const lowerText = text.toLowerCase();
  const lowerBoldString = boldString.toLowerCase();
  const startIndex = lowerText.indexOf(lowerBoldString);

  if (startIndex === -1) return { text, hasBold: false };

  const beforeBold = text.substring(0, startIndex);
  const boldPart = text.substring(startIndex, startIndex + boldString.length);
  const afterBold = text.substring(startIndex + boldString.length);

  return {
    beforeBold,
    boldPart,
    afterBold,
    hasBold: true
  };
};


export const calculateAge = (birthDay: string): number => {
  const today = new Date();
  const birthDate = new Date(birthDay);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};


export const validateDocumentNumber = (documentNumber: string): boolean => {
  const cleanNumber = documentNumber.replace(/\D/g, '');
  return cleanNumber.length >= 8 && cleanNumber.length <= 12;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 9;
};

export const formatPrice = (price: number, currency: string = '$'): string => {
  return `${currency}${price.toLocaleString()}`;
};
