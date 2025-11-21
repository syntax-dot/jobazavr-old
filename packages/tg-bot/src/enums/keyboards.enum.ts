class keyboards {
  static readonly WEB_APP = [
    [
      {
        text: "Открыть приложение",
        web_app: {
          url: "http://app.jobazavr.ru/",
        },
      },
    ],
  ];

  static readonly SEND_PHONE_NUMBER = [
    [
      {
        text: "Отправить номер телефона",
        request_contact: true,
      },
    ],
  ];
}

export default keyboards;
