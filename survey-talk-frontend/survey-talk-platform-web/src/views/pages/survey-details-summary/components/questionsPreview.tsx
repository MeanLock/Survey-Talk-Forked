type OptionDetails = {
  Id?: string | null;
  Content: string;
  Order: number;
  MainImageUrl: string;
  SurveyQuestionId: string;
};

type QuestionDetails = {
  Id?: string | null;
  SurveyId: string;
  MainImageUrl: string;
  QuestionTypeId: number;
  Content: string;
  Description: string;
  TimeLimit: number;
  IsVoice: boolean;
  Order: number;
  ConfigJsonString: string;
  DeletedAt: string | null;
  Options: OptionDetails[];
};

interface Props {
  questions: QuestionDetails[];
}

const RenderQuestion: React.FC<{ question: QuestionDetails }> = ({
  question,
}) => {
  const renderQuestionName = (id: number) => {
    switch (id) {
      case 1:
        return "Choices (Single Answer)"
      case 2:
        return "Choices (Multiple Answer)";
      case 3:
        return "Slider (Single Slider)";
      case 4:
        return "Slider (Range Slider)";
      case 5:
        return "Form Input";
      case 6:
        return "Rating";
      case 7:
        return "Ranking";
      default:
        return "Unknown";
    }
  };
  return (
    <div className="w-full flex flex-col items-start gap-2">
      <p className="text-gray-700 text-sm">
        {renderQuestionName(question.QuestionTypeId)}
      </p>
      <div className="w-full flex items-center justify-start">
        {/* Content sẽ được render ở đây */}
      </div>
    </div>
  );
};

export const QuestionPreview: React.FC<Props> = ({ questions }) => {
  // Filter ra các câu hỏi chưa bị xóa và sort theo Order
  const filteredAndSortedQuestions = questions
    .filter((q: QuestionDetails) => q.DeletedAt === null)
    .sort((a: QuestionDetails, b: QuestionDetails) => a.Order - b.Order);

  return (
    <div className="w-full flex flex-col items-start">
      {filteredAndSortedQuestions.map((q: QuestionDetails, index: number) => (
        <div key={index} className="w-full flex flex-col">
          <div className="bg-[#3e5dab]/50 flex items-center px-3 py-5">
            <p>Question {q.Order}</p>
          </div>
          <div className="w-full bg-white p-10 flex flex-col items-start gap-5">
            {/* Question Content */}
            <div className="w-full flex flex-col items-start gap-2">
              <p className="text-gray-700 text-sm">Question</p>
              <div className="w-full px-5 py-2 border-1 rounded-md border-gray-700 flex items-center justify-start">
                {q.Content}
              </div>
            </div>

            {/* Question Description */}
            <div className="w-full flex flex-col items-start gap-2">
              <p className="text-gray-700 text-sm">Description</p>
              <div className="w-full px-5 py-2 border-1 rounded-md border-gray-700 flex items-center justify-start">
                {q.Description ? (
                  <p>{q.Description}</p>
                ) : (
                  <p className="text-gray-400 italic">
                    Câu hỏi không có miêu tả.
                  </p>
                )}
              </div>
            </div>

            {/* Question Details Render */}
            <RenderQuestion question={q} />
          </div>
        </div>
      ))}
    </div>
  );
};
