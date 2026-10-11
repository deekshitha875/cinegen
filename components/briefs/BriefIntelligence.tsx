"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, Lightbulb, X, Shield, Zap } from "lucide-react";

type FormData = {
  campaignTitle: string;
  objective: string;
  contentType: string;
  style: string;
  aspectRatios: string[];
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  toolsPreferred: string[];
  commercialUse: {
    licenseTier: string;
    modelIndemnityRequired: boolean;
    workflowHandoffRequired: boolean;
    usageRegions: string[];
    exclusivity: boolean;
  };
  negativeKeywords: string[];
  quantity: number;
};

type Issue = {
  type: "error" | "warning" | "suggestion";
  field: string;
  message: string;
  fix?: string;
};

function analyzeBrief(form: FormData): Issue[] {
  const issues: Issue[] = [];

  // Hard errors
  if (!form.campaignTitle?.trim())
    issues.push({ type: "error", field: "Title", message: "Campaign title is missing", fix: "Add a descriptive title so creators understand the project" });
  if (!form.objective?.trim())
    issues.push({ type: "error", field: "Objective", message: "No campaign objective defined", fix: "Describe what you want this content to achieve" });
  if (!form.style?.trim())
    issues.push({ type: "error", field: "Visual Style", message: "Visual style is not specified", fix: "Add keywords like 'cinematic', 'neon', 'minimal', 'luxury'" });
  if (form.budgetMin === 0 || form.budgetMax === 0)
    issues.push({ type: "error", field: "Budget", message: "Budget range is missing", fix: "Set a realistic budget so creators can decide if it's a fit" });
  if (form.budgetMin > form.budgetMax && form.budgetMax > 0)
    issues.push({ type: "error", field: "Budget", message: "Min budget is higher than max budget", fix: "Flip the values — min should be lower than max" });

  // Warnings
  if (form.aspectRatios.length === 0)
    issues.push({ type: "warning", field: "Aspect Ratio", message: "No aspect ratio selected", fix: "Pick at least one — 16:9 for YouTube, 9:16 for Reels/TikTok" });
  if (!form.commercialUse?.licenseTier)
    issues.push({ type: "warning", field: "License", message: "No license tier selected", fix: "Add a license tier to avoid disputes after delivery" });
  if (form.commercialUse?.usageRegions?.length === 0)
    issues.push({ type: "warning", field: "Usage Regions", message: "Usage regions not specified", fix: "Add regions where content will be used (e.g. India, Worldwide)" });
  if (form.toolsPreferred.length === 0)
    issues.push({ type: "warning", field: "AI Tools", message: "No preferred AI tools specified", fix: "Adding tools like Runway or Midjourney helps match the right creator" });
  if (!form.deadline)
    issues.push({ type: "warning", field: "Deadline", message: "No deadline set", fix: "Set a deadline to attract creators who are available" });

  // Suggestions
  if (form.budgetMax > 0 && form.budgetMax < 500)
    issues.push({ type: "suggestion", field: "Budget", message: "Budget seems low for AI production", fix: "Typical AI brand films start at $500–$1,000. Consider increasing." });
  if (!form.commercialUse?.modelIndemnityRequired)
    issues.push({ type: "suggestion", field: "Model Indemnity", message: "Model indemnity not required", fix: "For commercial campaigns, requiring model indemnity protects your brand" });
  if (form.negativeKeywords.length === 0)
    issues.push({ type: "suggestion", field: "Negative Keywords", message: "No negative keywords added", fix: "Add words like 'violence', 'political' to prevent unwanted content" });
  if (form.quantity === 1)
    issues.push({ type: "suggestion", field: "Deliverables", message: "Only 1 deliverable requested", fix: "Consider requesting multiple formats (16:9 + 9:16) for more value" });

  return issues;
}

function getScore(issues: Issue[]): number {
  const errors = issues.filter((i) => i.type === "error").length;
  const warnings = issues.filter((i) => i.type === "warning").length;
  const suggestions = issues.filter((i) => i.type === "suggestion").length;
  const score = Math.max(0, 100 - errors * 20 - warnings * 8 - suggestions * 3);
  return score;
}

export function BriefIntelligence({ form }: { form: FormData }) {
  const issues = analyzeBrief(form);
  const score = getScore(issues);
  const errors = issues.filter((i) => i.type === "error");
  const warnings = issues.filter((i) => i.type === "warning");
  const suggestions = issues.filter((i) => i.type === "suggestion");

  const scoreColor = score >= 80 ? "text-green-400" : score >= 50 ? "text-amber-400" : "text-red-400";
  const scoreGradient = score >= 80 ? "from-green-500 to-emerald-500" : score >= 50 ? "from-amber-500 to-orange-500" : "from-red-500 to-red-600";
  const scoreLabel = score >= 80 ? "Strong Brief" : score >= 50 ? "Needs Work" : "Incomplete";

  return (
    <div className="glass rounded-2xl border border-white/10 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Brief Intelligence</h3>
            <p className="text-xs text-muted-foreground">AI-powered brief audit</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-display font-bold ${scoreColor}`}>{score}</div>
          <div className={`text-xs font-medium ${scoreColor}`}>{scoreLabel}</div>
        </div>
      </div>

      {/* Score bar */}
      <div className="w-full bg-white/5 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full bg-gradient-to-r ${scoreGradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Summary pills */}
      <div className="flex gap-2">
        {errors.length > 0 && (
          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full">
            <X className="w-3 h-3" /> {errors.length} error{errors.length > 1 ? "s" : ""}
          </span>
        )}
        {warnings.length > 0 && (
          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full">
            <AlertTriangle className="w-3 h-3" /> {warnings.length} warning{warnings.length > 1 ? "s" : ""}
          </span>
        )}
        {suggestions.length > 0 && (
          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full">
            <Lightbulb className="w-3 h-3" /> {suggestions.length} tip{suggestions.length > 1 ? "s" : ""}
          </span>
        )}
        {issues.length === 0 && (
          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full">
            <CheckCircle className="w-3 h-3" /> All good!
          </span>
        )}
      </div>

      {/* Issues list */}
      {issues.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {[...errors, ...warnings, ...suggestions].map((issue, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-3 rounded-xl border text-xs space-y-1 ${
                issue.type === "error"
                  ? "bg-red-500/5 border-red-500/20"
                  : issue.type === "warning"
                  ? "bg-amber-500/5 border-amber-500/20"
                  : "bg-blue-500/5 border-blue-500/20"
              }`}
            >
              <div className="flex items-center gap-1.5">
                {issue.type === "error" ? (
                  <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                ) : issue.type === "warning" ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                ) : (
                  <Lightbulb className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                )}
                <span className={`font-semibold ${
                  issue.type === "error" ? "text-red-300" : issue.type === "warning" ? "text-amber-300" : "text-blue-300"
                }`}>{issue.field}</span>
                <span className="text-muted-foreground">— {issue.message}</span>
              </div>
              {issue.fix && (
                <p className="text-muted-foreground pl-5 leading-relaxed">💡 {issue.fix}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {score === 100 && (
        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-xs text-green-300 font-medium">Perfect brief! Ready to attract top creators.</span>
        </div>
      )}
    </div>
  );
}
