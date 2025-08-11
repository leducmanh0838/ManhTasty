export function validateString(str, minLength, maxLength, regex) {
  if (typeof str !== 'string') return false;

  const trimmed = str.trim();
  if (trimmed.length < minLength || trimmed.length > maxLength) return false;

  return regex.test(trimmed);
}

export function validateStringWithMessage(str, field, minLength, maxLength, regex, regexMessage) {
  if(!str)
    return `${field} bắt buộc!!!`;

  if (typeof str !== 'string')
    return `${field} không phải là chữ!!!`;

  const trimmed = str.trim();
  // if (trimmed.length < minLength || trimmed.length > maxLength) return false;
  if (trimmed.length < minLength)
    return `${field} phải ít nhất ${minLength} ký tự`;

  if (trimmed.length > maxLength)
    return `${field} không quá ${maxLength} ký tự`;

  if (regex && !regex.test(trimmed))
    return regexMessage;
  
  return null;
}