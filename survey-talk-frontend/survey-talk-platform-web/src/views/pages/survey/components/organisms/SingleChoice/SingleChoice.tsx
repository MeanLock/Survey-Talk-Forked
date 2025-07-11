import { useEffect } from "react";
import type {
  OptionType,
  QuestionType,
  SurveyType,
} from "@/core/types/tools"
import ButtonAddAnswer from "../../molecules/buttons/ButtonAddAnswer";
import "./styles.scss";
import { answerDefault } from "../../../constants/questions";
import Answer from "../../molecules/answer/Answer";

type Props = {
  formData: SurveyType;
  question: QuestionType;
  handleUpdateQuestion: (
    key: keyof QuestionType,
    value:
      | string
      | number
      | boolean
      | OptionType[]
      | Record<string, string | number>
  ) => void;
};
const SingleChoice = ({ question, handleUpdateQuestion, formData }: Props) => {
  const handleUpdateOption = (updatedOption: OptionType) => {
    const updatedOptions = question.Options.map((option) =>
      option.Order === updatedOption.Order ? updatedOption : option
    );
    handleUpdateQuestion("Options", updatedOptions);
  };

  const handleDeleteOption = (orderToDelete: number) => {
    const updatedOptions = question.Options.filter(
      (option: any) => option.Order !== orderToDelete
    );
    handleUpdateQuestion("Options", updatedOptions);
  };

  const handleAddAnswer = () => {
    const newOrder =
      question.Options.length > 0
        ? Math.max(...question.Options.map((o: any) => o.Order)) + 1
        : 1;
    const newOption = { ...answerDefault, Order: newOrder };
    const updatedOptions = [...question.Options, newOption];
    handleUpdateQuestion("Options", updatedOptions);
  };

  useEffect(() => {
    if (!question?.Options?.length) {
      handleUpdateQuestion("Options", [{ ...answerDefault, Order: 1 }]);
    }
  }, [question]);

  return (
    <div className="single-choice flex flex-col gap-2">
      {question?.Options?.length
        ? question.Options.map((item: any, index: number) => {
            return (
              <Answer
                isDisableClose={index === 0 && question?.Options?.length === 1}
                formData={formData}
                data={item}
                key={item.Order}
                handleUpdateOption={handleUpdateOption}
                handleDeleteOption={handleDeleteOption}
              />
            );
          })
        : null}
      <ButtonAddAnswer onClick={handleAddAnswer} />
    </div>
  );
};

export default SingleChoice;
