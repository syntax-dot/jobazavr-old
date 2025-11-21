import {
  Icon24Cards2Outline,
  Icon24CrossShieldOutline,
  Icon24EducationOutline,
  Icon24HelpOutline,
  Icon24HomeOutline,
  Icon24LocationMapOutline,
  Icon24NotebookCheckOutline,
  Icon24StarShieldOutline,
  Icon24UserCircleOutline,
  Icon24UserOutline,
} from "@vkontakte/icons";
import { tagListPage } from "../../modules/tagManager";

export default [
  {
    id: "map",
    title: "Карта",
    description: "Поиск вакансий",
    icon: <Icon24LocationMapOutline />,
    clickEvent: null,
  },
  {
    id: "list",
    title: "Подборка",
    description: "Список вакансий",
    icon: <Icon24NotebookCheckOutline />,
    clickEvent: () => {
      tagListPage();
    },
  },
  {
    id: "profile",
    title: "Профиль",
    description: "Ваши данные",
    icon: <Icon24UserOutline />,
    clickEvent: null,
  },
  {
    id: "admin",
    title: "Админ-Панель",
    description: "Администрирование приложением",
    icon: <Icon24StarShieldOutline />,
    clickEvent: null,
  },
  {
    id: "Jclub",
    title: "Club",
    description: "Бесплатная юридическая помощь",
    icon: <Icon24Cards2Outline />,
    clickEvent: null,
  },
  {
    id: "help",
    title: "Юр. помощь",
    description: "Задайте вопрос",
    icon: <Icon24EducationOutline />,
    clickEvent: null,
  },
];
