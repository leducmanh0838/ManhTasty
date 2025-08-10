const slugify = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")                   // Bỏ dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, "")   // Bỏ ký tự Unicode dư
    .replace(/[^a-z0-9\s-]/g, "")      // Bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, "-");             // Thay khoảng trắng bằng dấu gạch ngang
};

export default slugify;