"use client"
import { Button } from "@/components/ui/button";
import { WebcamIcon } from "lucide-react";
import useSpeechToText from 'react-hook-speech-to-text';
import Webcam from 'react-webcam';



    function RecordAnswerSection() {
        const {
            error,
            interimResult,
            isRecording,
            results,
            startSpeechToText,
            stopSpeechToText,
        } = useSpeechToText({
            continuous: true,
            useLegacyResults: false
        });

        console.log("Results:", results);
        console.log("Interim Result:", interimResult);
        console.log("Error:", error);
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
            <Button variant="outline" className="my-10"> Record Answer </Button>
        <h1>Recording: {isRecording.toString()}</h1>
        <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <ul>
        {results.map((result) => (
        <li key={result.timestamp}>{result.transcript}</li>
        ))}
        {interimResult && <li>{interimResult}</li>}
        </ul>
        </div>
        
    )
    }

    export default RecordAnswerSection