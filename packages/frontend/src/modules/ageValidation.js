export default function ageValidation(value) {
  if (parseInt(value) < 18) return "Необходим возраст от 18 лет и старше.";
  if (parseInt(value) > 99) return "Необходим возраст младше 100 лет.";
  if (!/^\d\d$/.test(String(value))) return "Необходимо указать свой возраст.";
  if (value.toString().includes(",")) return "Необходимо указать свой возраст.";
  return null;
}
