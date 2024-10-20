"use client"
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { db } from "@utils/db";
import { chatSession } from "@utils/GeminiAIModel";
import { UserAnswer } from "@utils/schema";
import { Mic, WebcamIcon } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import useSpeechToText from 'react-hook-speech-to-text';
import Webcam from 'react-webcam';
import { toast } from "sonner";


    function RecordAnswerSection({mockInterviewQuestion,activeQuestionIndex,interviewData}) {
        const [userAnswer,setUserAnswer]=useState('');
        const {user}=useUser();
        const [loading,setLoading]=useState(false);
        const {
            error,
            interimResult,
            isRecording,
            results,
            startSpeechToText,
            stopSpeechToText,
            setResults
        } = useSpeechToText({
            continuous: true,
            useLegacyResults: false
        });

        useEffect(()=>{
            results.map((result)=>(
                setUserAnswer(prevAns=>prevAns+result.transcript)
            ))
        },[results])

        useEffect(()=>{
            if(!isRecording&&userAnswer.length>10){
                UpdateUserAnswer();
            }
        },[userAnswer])
        
        const   StartStopRecoding=async ()=>{
            if(isRecording){
                stopSpeechToText()
                    
            }
            else{
                startSpeechToText();
            }
        }

        const UpdateUserAnswer=async ()=>{

            console.log(userAnswer);
            setLoading(true);
            const feedbackPrompt="Question:"+mockInterviewQuestion[activeQuestionIndex]?.question+
            ", User Answer:"+userAnswer+"Depends on question and user answer to give interview question"+
            "please give us rating for answer and feedback as area of improvement if any"+
            "in just 3-5lines to improve it in JSON format with rating field and feedback field.";
            
            const result=await chatSession.sendMessage(feedbackPrompt);
                    const mockJsonResp=(result.response.text()
                    .replace(/```json/g, '')  // Remove ```json if it exists
                    .replace(/```/g, '')       // Remove trailing ```
                    .trim())
                    console.log(mockJsonResp);
                    const JsonFeedbackResp=JSON.parse(mockJsonResp);

                    const resp=await db.insert(UserAnswer)
                    .values({
                        mockIdRef:interviewData?.mockId,
                        question:mockInterviewQuestion[activeQuestionIndex]?.question,
                        correctAns:[activeQuestionIndex]?.answer,
                        userAns:userAnswer,
                        feedback:JsonFeedbackResp?.feedback,
                        rating:JsonFeedbackResp?.rating,
                        userEmail:user?.primaryEmailAddress?.emailAddress,
                        createdAt: moment().format('DD-MM-yyyy')
                    })
                    if(resp)
                    {
                        toast('User Answer Recorded Successfully')
                        setUserAnswer('');
                        setResults([]);
                    }
                    setResults([]);
                    setLoading(false);
        }


        // console.log("Results:", results);
        // console.log("Interim Result:", interimResult);
        // console.log("Error:", error);
            if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

    return (
        <div className="flex items-center justify-center flex-col">
            <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg border">
                <WebcamIcon className="h-60 w-72 my-7 bg-secondary absolute" />

                <Webcam
                mirrored={true}
                style={{
                    height:300,
                    width:'100%',
                    zIndex:10,
                }}/>
            </div>
            <Button
            disabled={loading}
            variant="outline" className="my-10"
            onClick={StartStopRecoding }>
                {isRecording?
                <h2 className="text-red-600 flex gap-2">
                    <Mic/> " Stop Recording"
                </h2>
                :
                
                "Record Answer "}</Button>
        </div>
        
    )
    }

    export default RecordAnswerSection