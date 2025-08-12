import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
// import sampleResumes from "../../constants/index.ts";
import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {Link} from "react-router/internal/react-server-client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuAi" },
    { name: "Description", content: "From Good to Interview-Ready – Instantly." },
  ];
}

export default function Home() {
    const {auth, kv} = usePuterStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [loadingResume, setLoadingResume] = useState(false);

    useEffect(()=> {
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated]);

    useEffect(() => {
        const loadResumes = async() => {
            setLoadingResume(true);
            const resumes = (await kv.list('resume:*', true)) as KVItem[];
            const parsedResumes = resumes.map((resume) => (
                JSON.parse(resume.value) as Resume
            ))

            setResumes(parsedResumes || []);
            setLoadingResume(false);
        }
        loadResumes();
    }, []);
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="main-section">
        <div className="page-heading py-16">
            <h1>Transform Your Resume with AI Precision</h1>
            {!loadingResume && resumes?.length === 0 ? (
                <h2>Upload your resume and level up your application in seconds.</h2>
            ): (
                <h2>Review your submissions and check AI-powered feedback</h2>
            )}
        </div>
        {loadingResume && (
            <div className="flex flex-col items-center justify-center">
                <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="loading-resume"/>
            </div>
        )}
      {!loadingResume && resumes.length > 0 && (
          <div className="resumes-section">
              {resumes.map((resume) => (
                  <div key={resume.id}>
                      <ResumeCard resume={resume} />
                  </div>
              ))}
          </div>
      )}

        {!loadingResume && resumes.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-10 gap-4">
                <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                    Upload resume
                </Link>
            </div>
        )}
    </section>
    </main>
  );
}
