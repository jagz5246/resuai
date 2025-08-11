import React, {type FormEvent} from 'react';
import Navbar from "~/components/Navbar";
import {AIResponseFormat, prepareInstructions, resumes} from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {index} from "@react-router/dev/routes";

const Upload = () => {
    const {auth, fs, isLoading, ai, kv} = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [statusText, setStatusText] = React.useState("");
    const [file, setFile] = React.useState<File | null>(null);
    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }
    const handleAnalyze = async ({companyName, jobTitle, jobDescription, file}: {companyName: string, jobTitle: string, jobDescription: string, file: File}) => {
        setIsProcessing(true);
        setStatusText("Uploading file...");
        const uploadedFile = await fs.upload([file]);
        if (!uploadedFile) {
            // setIsProcessing(false);
            return setStatusText("Error: Failed to upload file");
        }
        setStatusText('Converting to image...');

        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) {
            // setIsProcessing(false);
            return setStatusText("Error: Failed to convert PDF to image");
        }
        setStatusText('Uploading the image...');

        const uploadedImage = await fs.upload([imageFile.file]);
        if (!uploadedImage) {
            // setIsProcessing(false);
            return setStatusText("Error: Failed to upload image");
        }

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: ''
        }
        await kv.set(`resume: ${uuid}`, JSON.stringify(data));

        setStatusText("Analyzing...");
        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({jobTitle, jobDescription}
            ));
        if (!feedback) {
            // setIsProcessing(false);
            return setStatusText("Error: Failed to analyze resume");
        }

        const feedbackText = typeof feedback.message.content === "string"
            ? feedback.message.content
            : feedback.message.content[0].text;
        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText("Analysis complete, redirecting...");
        console.log(data);
        navigate(`/resume/${uuid}`);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;
        if(!file) return;
        handleAnalyze({companyName, jobTitle, jobDescription, file});
        console.log({companyName, jobTitle, jobDescription, file});
    }
    return (
        <main className="bg-[url('images/bg-main.svg')] bg-cover">
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Upgrade Your Resume. Unlock Opportunities</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" id="company-name" placeholder="Company Name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job title</label>
                                <input type="text" name="job-title" id="job-title" placeholder="Job Title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" id="job-description" placeholder="Job Description" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">Analyze Resume</button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Upload;