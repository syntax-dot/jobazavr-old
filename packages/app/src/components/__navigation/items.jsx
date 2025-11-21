import {
  Icon24BlockOutline,
  Icon24Cards2Outline,
  Icon24CrossShieldOutline,
  Icon24EducationOutline, Icon24GearOutline,
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
  // {
  //   id: "home",
  //   title: "Регистрация",
  //   description: "Заполните анкету для поиска работы",
  //   icon: <Icon24HomeOutline />,
  // },
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
    id: "Jclub",
    title: "Club",
    description: "Бесплатная юридическая помощь",
    icon: <Icon24Cards2Outline />,
    clickEvent: null,
  },
  {
    id: "admin",
    title: "Админ",
    description: "Управление приложением",
    icon: <Icon24GearOutline />,
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
