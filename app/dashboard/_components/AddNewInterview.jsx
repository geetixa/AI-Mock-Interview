"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { db } from "@utils/db";
import { chatSession } from "@utils/GeminiAIModel";
import { MockInterview } from "@utils/schema";
import { LoaderCircle } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

function AddNewInterview() {
const [openDialog, setOpenDialog] = useState(false);
const [jobPosition, setJobPosition] = useState("");
const [jobDesc, setJobDesc] = useState("");
const [jobExperience, setJobExperience] = useState("");
const [loading,setLoading]=useState(false);
const [jsonResponse,setJsonResponse]=useState([]);
const router=useRouter();
const {user}=useUser();

const onSubmit =  async (e) => {
setLoading(true);
e.preventDefault();
console.log("Form submitted!");
console.log("Job Position:", jobPosition);
console.log("Job Description:", jobDesc);
console.log("Job Experience:", jobExperience);
// You can also close the dialog here if needed
setOpenDialog(false);

const InputPrompt="Job Position:"+jobPosition+",Job Description:"+jobDesc+", Years of Experience:"+jobExperience+"Depending on the job description and years of experience give "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+"Interview questions along with answers in JSON format, Give us question and answer field on JSON"

const result = await chatSession.sendMessage(InputPrompt);
let MockJsonResp = result.response.text()
  .replace(/```json/g, '')  // Remove ```json if it exists
  .replace(/```/g, '')       // Remove trailing ```
  .trim();                   // Remove any leading/trailing whitespace

// Remove any characters before or after the JSON structure if needed
MockJsonResp = MockJsonResp.replace(/^[^{[]*/, '').replace(/[^}\]]*$/, '');

console.log("Cleaned MockJsonResp:", MockJsonResp);
console.log(JSON.parse(MockJsonResp));

setJsonResponse(MockJsonResp);
if(MockJsonResp){
const resp= await db.insert(MockInterview)
.values({
    mockId:uuidv4(),
    jsonMockResp:MockJsonResp,
    jobPosition:jobPosition,
    jobDesc: jobDesc,
    jobExperience: jobExperience,
    createdBy: user?.primaryEmailAddress?.emailAddress,
    createdAt:moment().format('DD-MM-yyyy')
}).returning({mockId:MockInterview.mockId});

console.log("Inserted ID:",resp)
if(resp)
{
    setOpenDialog(false);
    router.push('/dashboard/interview/'+resp[0]?.mockId)
}
}
else{
    console.log("ERROR");
}
setLoading(false);

}

return (
<div>
<div
className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
onClick={() => setOpenDialog(true)}
>
<h2 className='text-lg'>+ Add New</h2>
</div>
<Dialog open={openDialog}>
<DialogContent className="max-w-2xl"
    style={{ backgroundColor: 'white', border: '2px solid blue', borderRadius: '8px' }}
>
<DialogHeader>
    <DialogTitle className="text-2xl">Tell us more about the Job you are interviewing</DialogTitle>
    <DialogDescription>
        <form onSubmit={onSubmit}>
            <div>
                <h2>Add details about job position, your skills, and years of experience:</h2>
                <div className="mt-7 my-2">
                    <label>Job Role/Job Position</label>
                    <Input
                        placeholder="Ex. Full Stack Developer" required onChange={(event) => setJobPosition(event.target.value)}
                    />
                </div>
                <div className="my-3">
                    <label>Job Description Tech Stack (In Short)</label>
                    <Textarea
                        placeholder="Ex. React, Angular, Node.js, MySql, etc."
                        required
                        onChange={(event) => setJobDesc(event.target.value)}
                    />
                </div>
                <div className="my-3">
                    <label>Years of experience (In Short)</label>
                    <Input
                        placeholder="0"
                        type="number"
                        max="50"
                        required
                        onChange={(event) => setJobExperience(event.target.value)}
                    />
                </div>
            </div>
            <div className="flex gap-5 justify-end">
                <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading?
                    <>
                    <LoaderCircle className="animate-spin"/>'Generating from AI'
                    </>:'Start Interview'
                }
                    </Button>
            </div>
        </form>
    </DialogDescription>
</DialogHeader>
</DialogContent>
</Dialog>
</div>
);
}

export default AddNewInterview;
