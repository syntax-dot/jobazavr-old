export default function nameValidation(value) {
  if (
    value
      ?.trim()
      ?.split("")
      ?.map((i) => parseInt(i))
      ?.some((i) => i.toString() !== "NaN")
  )
    return "В имени не должно быть цифр";
  if (!/^[а-яё-]*[a-z]* [а-яё-]*[a-z]*$/.test(value?.trim()?.toLowerCase()))
    return "Введите ваше корректное имя и фамилию.";
  if (
    value
      ?.trim()
      ?.replace(" ", "")
      ?.split("")
      ?.reduce((acc, item) => (item === "-" ? acc + 1 : acc), 0) ===
    value?.trim()?.replace(" ", "")?.length
  )
    return "Введите ваше корректное имя и фамилию.";
  if (
    value
      ?.trim()
      ?.split(" ")
      ?.at(0)
      ?.split("")
      ?.some((i, ind, arr) => (i === "-" ? arr[ind + 1] === "-" : false)) ||
    value
      ?.trim()
      ?.split(" ")
      ?.at(1)
      ?.split("")
      ?.some((i, ind, arr) => (i === "-" ? arr[ind + 1] === "-" : false))
  )
    return "Введите ваше корректное имя и фамилию.";
  if (
    value?.trim()?.split(" ")?.at(0)?.split("")?.at(0) === "-" ||
    value?.trim()?.split(" ")?.at(0)?.split("")?.at(-1) === "-" ||
    value?.trim()?.split(" ")?.at(1)?.split("")?.at(0) === "-" ||
    value?.trim()?.split(" ")?.at(1)?.split("")?.at(-1) === "-"
  )
    return "Введите ваше корректное имя и фамилию.";
  return null;
}
