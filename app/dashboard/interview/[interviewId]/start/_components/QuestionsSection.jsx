import { Lightbulb } from "lucide-react";

function QuestionsSection({ mockInterviewQuestion,activeQuestionIndex }) {
    return mockInterviewQuestion&&(
    <div className='p-5 border rounded-lg my-10'>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockInterviewQuestion&&mockInterviewQuestion.map((question, index) => (
            <h2 className={`p-2 bg-secondary rounded-full
            text-xs md:text-sm text-center cursor-pointer *
            ${activeQuestionIndex==index&&'bg-blue-700 text-white'}`} >Question #{index + 1}</h2>
        ))}
        </div>
        <h2 className="my-5 text-md md:text-lg">{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>

        <div className="borer rounded-lg p-5 bg-blue-100 mt-20">
            <h2 className="flex gap-2 items-center text-primary">
                <Lightbulb/>
                <strong>NOTE:</strong>
            </h2>
            <h2 className="text-sm text-primary my-2">{process.env.NEXT_PUBLIC_Question_Note}</h2>
        </div>
    </div>
    )
}

export default QuestionsSection;
