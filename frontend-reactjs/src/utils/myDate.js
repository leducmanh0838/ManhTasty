export function getDaysLeft(updatedAt, limit = 30) {
  const updatedDate = new Date(updatedAt);
  const expireDate = new Date(updatedDate.getTime() + limit * 24 * 60 * 60 * 1000);
  const now = new Date();

  let daysLeft = Math.ceil((expireDate - now) / (1000 * 60 * 60 * 24));
  return daysLeft > 0 ? daysLeft : 0; // Nếu hết hạn thì trả về 0
}