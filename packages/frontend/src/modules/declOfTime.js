// time: number

export default function declOfTime(time) {
  if (time >= 0 && time < 4) return "Доброй ночи, ";
  if (time >= 4 && time < 12) return "Доброе утро, ";
  if (time >= 12 && time < 16) return "Добрый день, ";
  if (time >= 16 && time < 24) return "Добрый вечер, ";
}
