import { BiCalendar, BiCookie, BiHelpCircle } from "react-icons/bi";
import { BsApple, BsCupHot, BsGlobe2, BsHeartPulse } from "react-icons/bs";
import { FaUtensils } from "react-icons/fa";

export const TagCategory = Object.freeze({
  OTHER: { value: 0, label: "Khác", icon: <BiHelpCircle/> },
  TYPE: { value: 1, label: "Loại món", icon: <FaUtensils/> },
  OCCASION: { value: 2, label: "Dịp", icon: <BiCalendar/> },
  INGREDIENT: { value: 3, label: "Nguyên liệu chính", icon: <BsApple/> },
  DIET: { value: 4, label: "Chế độ ăn", icon: <BsHeartPulse/> },
  METHOD: { value: 5, label: "Cách chế biến", icon: <BiCookie/> },
  REGION: { value: 6, label: "Vùng miền", icon: <BsGlobe2/> },
  FLAVOR: { value: 7, label: "Hương vị", icon: <BsCupHot/> },
});

// Nếu muốn mảng để dễ .map() khi render
export const TagCategoryList = Object.values(TagCategory);