import React, { useState } from "react";
import {
  Button,
  FormItem,
  FormLayout,
  Text,
  Div,
  Textarea,
  Title,
} from "@vkontakte/vkui";
import { AnimatePresence, motion } from "framer-motion";
import { Icon56CheckCircleOutline, Icon56HelpOutline } from "@vkontakte/icons";
import api from "../../modules/apiRequest";
import { toast } from "react-hot-toast";
import { useRecoilValue } from "recoil";
import { getSelectedLanguage } from "../../storage/selectors/main";
import { useTranslate } from "@tolgee/react";

const LegalAidModal = ({ close }) => {
  const { t } = useTranslate();
  const selectedLanguage = useRecoilValue(getSelectedLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [text, setText] = useState("");
  const handleClick = async () => {
    setIsLoading(true);
    const { data: responseData } = await api("legal-aid", "POST", {
      text: text.trim(),
    });
    if (responseData) {
      setIsLoading(false);
      setIsSent(true);
    } else {
      toast.error("Произошла ошибка. Попробуйте позже");
    }
  };
  return (
    <>
      <AnimatePresence exitBeforeEnter={true}>
        {isSent ? (
          <motion.div
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            key={"framer-motion-is-sent"}
          >
            <div className={"flex jcc"}>
              <Icon56CheckCircleOutline />
            </div>
            <Title className={"centered mt10"} level={"2"}>
              {t({
                key: "thanks_for_att",
                defaultValue: "Спасибо за обращение!",
                language: selectedLanguage,
              })}
            </Title>
            <Text
              style={{ marginBottom: 15 }}
              className={"centered mt10"}
              weight={"2"}
            >
              {t({
                key: "mail_soon",
                defaultValue: "Мы получили Ваш запрос и скоро свяжемся с Вами",
                language: selectedLanguage,
              })}
            </Text>
            <Div className={"DivFix"}>
              <Button
                onClick={() => close()}
                loading={isLoading}
                size={"m"}
                className={""}
                stretched
              >
                {t({
                  key: "close",
                  defaultValue: "Закрыть",
                  language: selectedLanguage,
                })}
              </Button>
            </Div>
          </motion.div>
        ) : (
          <motion.div exit={{ scale: 0 }} key={"framer-motion-is-not-sent"}>
            <div className={"flex jcc"}>
              <Icon56HelpOutline />
            </div>
            <Title className={"centered mt10"} level={"2"}>
              {t({
                key: "ask_a_q",
                defaultValue: "Задайте нам Ваш вопрос",
                language: selectedLanguage,
              })}
            </Title>
            <FormLayout>
              <FormItem>
                <Textarea
                  value={text}
                  onChange={({ target }) => setText(target.value)}
                  placeholder={t({
                    key: "qq_epta",
                    defaultValue: "Здравствуйте...",
                    language: selectedLanguage,
                  })}
                />
              </FormItem>
            </FormLayout>
            <Div className={"DivFix"}>
              <Button
                onClick={() => (text.trim().length > 0 ? handleClick() : null)}
                loading={isLoading}
                size={"m"}
                disabled={text.trim().length === 0}
                className={""}
                stretched
              >
                {t({
                  key: "send",
                  defaultValue: "Отправить",
                  language: selectedLanguage,
                })}
              </Button>
            </Div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LegalAidModal;
