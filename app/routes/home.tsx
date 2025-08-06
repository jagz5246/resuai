import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import {resumes} from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";
import {useEffect} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuAi" },
    { name: "Description", content: "From Good to Interview-Ready – Instantly." },
  ];
}

export default function Home() {
    const {auth} = usePuterStore();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(()=> {
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated]);

  return (
    <main className="bg-[url('images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="main-section">
        <div className="page-heading py-16">
            <h1>Transform Your Resume with AI Precision</h1>
            <h2>Review your submissions and check AI-powered feedback</h2>
        </div>
      {resumes.length > 0 && (
          <div className="resumes-section">
              {resumes.map((resume) => (
                  <div key={resume.id}>
                      <ResumeCard resume={resume} />
                  </div>
              ))}
          </div>
      )}
    </section>
    </main>
  );
}
