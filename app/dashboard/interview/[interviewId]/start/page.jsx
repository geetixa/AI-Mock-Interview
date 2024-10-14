"use client"
import { db } from "@utils/db";
import { MockInterview } from "@utils/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection'; // Adjust the path if necessary


function StartInterview({params}) {

    const [interviewData,setInterviewData]=useState();
    const [mockInterviewQuestion,setMockInterviewQuestion]=useState();
    const [activeQuestionIndex,setActiveQuestionIndex]=useState(0);
    useEffect(()=>{
        GetInterviewDetails();
    },[]);

    const GetInterviewDetails = async () => {
        try {
            const result = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewId));

            const jsonMockResp=JSON.parse(result[0].jsonMockResp)
            console.log(jsonMockResp)
            setMockInterviewQuestion(jsonMockResp);
            setInterviewData(result[0]);
        
        } catch (error) {
            console.error("Error fetching interview details:", error);
        }
        };
    return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* {Questions} */}
            <QuestionsSection
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            />

            {/* {Video/Audio Recording} */}
            <RecordAnswerSection/>
        </div>
    </div>
    )
}

export default StartInterview