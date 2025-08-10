// export function validateTitle(title) {
//     const trimmed = title.trim();
//     if (trimmed.length < 3 || trimmed.length > 100) return false;

//     // Chỉ cho phép chữ, số, dấu cách và các ký tự -, _ , . , , , ! , ?
//     const regex = /^[\w\s\-_\.,!?\(\)]+$/;
//     return regex.test(trimmed);
// }

export function validateString(str, minLength, maxLength, regex) {
  if (typeof str !== 'string') return false;

  const trimmed = str.trim();
  if (trimmed.length < minLength || trimmed.length > maxLength) return false;

  return regex.test(trimmed);
}