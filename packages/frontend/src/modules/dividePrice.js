export default function dividePrice(price) {
  price = price.toString();
  if (price === "0" || price.toLowerCase().trim() === "не указано")
    return "Не указано";
  return price + " ₽";
}
