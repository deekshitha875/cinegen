import CineGenDirector from "@/components/voice/CineGenDirector";

export const metadata = {
  title: "Voice Director | CineGen",
  description: "Create video campaign briefs using voice commands — powered by Gemini AI",
};

export default function VoicePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <CineGenDirector />
    </main>
  );
}
