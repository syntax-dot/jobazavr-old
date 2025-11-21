export default function nameValidation({ value, t, selectedLanguage }) {
  if (
    value
      ?.trim()
      ?.split("")
      ?.map((i) => parseInt(i))
      ?.some((i) => i.toString() !== "NaN")
  )
    return t({
      key: "name_numeric_error",
      defaultValue: "В имени не должно быть цифр",
      language: selectedLanguage,
    });
  if (
    !/^[^0-9]* [^0-9]*$/.test(value?.trim()?.toLowerCase()) ||
    value?.trim()?.toLowerCase()
      ? value
          .trim()
          .toLowerCase()
          .split(" ")
          .some(
            (i) =>
              i.includes(".") ||
              i.includes("/") ||
              i.includes("\\") ||
              i.includes("]") ||
              i.includes("[") ||
              i.includes("|") ||
              i.includes("{") ||
              i.includes("}")
          )
      : false
  )
    return t({
      key: "name_surname_correct_error",
      defaultValue: "Введите ваше корректное имя и фамилию",
      language: selectedLanguage,
    });
  if (
    value
      ?.trim()
      ?.replace(" ", "")
      ?.split("")
      ?.reduce((acc, item) => (item === "-" ? acc + 1 : acc), 0) ===
    value?.trim()?.replace(" ", "")?.length
  )
    return t({
      key: "name_surname_correct_error",
      defaultValue: "Введите ваше корректное имя и фамилию",
      language: selectedLanguage,
    });
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
    return t({
      key: "name_surname_correct_error",
      defaultValue: "Введите ваше корректное имя и фамилию",
      language: selectedLanguage,
    });
  if (
    value?.trim()?.split(" ")?.at(0)?.split("")?.at(0) === "-" ||
    value?.trim()?.split(" ")?.at(0)?.split("")?.at(-1) === "-" ||
    value?.trim()?.split(" ")?.at(1)?.split("")?.at(0) === "-" ||
    value?.trim()?.split(" ")?.at(1)?.split("")?.at(-1) === "-"
  )
    return t({
      key: "name_surname_correct_error",
      defaultValue: "Введите ваше корректное имя и фамилию",
      language: selectedLanguage,
    });
  return null;
}
