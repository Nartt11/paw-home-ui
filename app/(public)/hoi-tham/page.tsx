"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, HeartHandshake, Loader2, PhoneCall } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { APP_ROUTES } from "@/constants/routes";
import { useFollowupForm, useRespondFollowup } from "@/hooks/use-followup";
import { apiErrorMessage } from "@/lib/api-error";
import { FOLLOWUP_MILESTONE_LABEL } from "@/lib/followup-display";
import type { FollowupAnswers } from "@/types/followup.type";

type Answers = Record<string, string>;

/** What the adopter sees after sending, chosen from their own answers (the backend decides the alert). */
function afterwordFor(answers: Answers) {
  const urgent =
    answers.stillHasPet === "false" ||
    answers.wellbeing === "ALARMING" ||
    answers.incident === "INJURY" ||
    answers.support === "CONSIDERING_RETURN";
  const worried =
    answers.wellbeing === "WORRIED" || answers.fear === "MUCH" || answers.incident === "NO_INJURY" || answers.support === "ADVICE";
  if (urgent) {
    return {
      tone: "border-red-200 bg-red-50 text-red-900",
      title: "Trung tâm sẽ liên hệ với bạn sớm",
      text: "Cảm ơn bạn đã nói thật. Nếu bé có dấu hiệu sức khoẻ đáng lo, hãy đưa bé đi khám thú y ngay, đừng chờ.",
    };
  }
  if (worried) {
    return {
      tone: "border-amber-200 bg-amber-50 text-amber-900",
      title: "Cảm ơn bạn, trung tâm sẽ gọi để tư vấn",
      text: "Phần lớn bé cần 2–3 tuần để quen nhà mới. Cho bé một góc yên tĩnh, giữ giờ ăn cố định và đừng ép bé lại gần.",
    };
  }
  return {
    tone: "border-emerald-200 bg-emerald-50 text-emerald-900",
    title: "Thật vui khi bé ổn",
    text: "Cảm ơn bạn đã dành thời gian. Nhớ lịch tiêm phòng và tẩy giun định kỳ cho bé nhé.",
  };
}

function FollowupCheckIn() {
  const token = useSearchParams().get("token") ?? undefined;
  const formQuery = useFollowupForm(token);
  const respondMutation = useRespondFollowup();
  const [answers, setAnswers] = React.useState<Answers>({});
  const [note, setNote] = React.useState("");
  const [sent, setSent] = React.useState<Answers | null>(null);

  const questions = formQuery.data?.questions ?? [];
  const complete = questions.length > 0 && questions.every((question) => answers[question.key]);

  const submit = async () => {
    if (!token) return;
    const body: FollowupAnswers = {
      stillHasPet: answers.stillHasPet === undefined ? undefined : answers.stillHasPet === "true",
      wellbeing: answers.wellbeing as FollowupAnswers["wellbeing"],
      fear: answers.fear as FollowupAnswers["fear"],
      incident: answers.incident as FollowupAnswers["incident"],
      support: answers.support as FollowupAnswers["support"],
      note: note.trim() || undefined,
    };
    try {
      await respondMutation.mutateAsync({ token, answers: body });
      setSent(answers);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  if (!token || formQuery.isError) {
    return (
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-bold">Đường dẫn đã hết hạn hoặc đã được dùng</h1>
        <p className="text-muted-foreground">
          Bạn có thể đăng nhập và xem lịch hỏi thăm trong “Hồ sơ nhận nuôi của tôi”, hoặc nhờ trung tâm tư vấn ở đó.
        </p>
        <Button asChild>
          <Link href={APP_ROUTES.MY_ADOPTIONS}>Mở hồ sơ nhận nuôi của tôi</Link>
        </Button>
      </div>
    );
  }

  if (formQuery.isPending) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Đang mở phiếu hỏi thăm...
      </div>
    );
  }

  const form = formQuery.data;

  if (sent) {
    const afterword = afterwordFor(sent);
    return (
      <div className={`space-y-3 rounded-2xl border p-6 ${afterword.tone}`} role="status">
        <div className="flex items-center gap-2 text-lg font-semibold">
          {afterword.title.startsWith("Trung tâm") ? <PhoneCall className="h-5 w-5" aria-hidden /> : <CheckCircle2 className="h-5 w-5" aria-hidden />}
          {afterword.title}
        </div>
        <p>{afterword.text}</p>
        <Button asChild variant="outline" className="bg-white">
          <Link href={APP_ROUTES.HOME}>Về trang chủ</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <HeartHandshake className="h-4 w-4" aria-hidden /> Hỏi thăm {FOLLOWUP_MILESTONE_LABEL[form.milestone]?.toLowerCase() ?? ""}
        </div>
        <h1 className="text-2xl font-bold">{form.petName} dạo này thế nào?</h1>
        <p className="text-muted-foreground">{form.intro}</p>
      </div>

      {questions.map((question) => (
        <fieldset key={question.key} className="space-y-2">
          <legend className="font-medium">{question.text}</legend>
          <div className="flex flex-wrap gap-2">
            {question.options.map((option) => {
              const checked = answers[question.key] === option.value;
              return (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition ${
                    checked ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-accent"
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name={question.key}
                    value={option.value}
                    checked={checked}
                    onChange={() => setAnswers((prev) => ({ ...prev, [question.key]: option.value }))}
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="space-y-2">
        <Label htmlFor="followup-note">Muốn kể thêm? (không bắt buộc)</Label>
        <Textarea id="followup-note" rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={submit} disabled={!complete || respondMutation.isPending} size="lg">
          {respondMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Gửi
        </Button>
        {!complete ? <span className="text-sm text-muted-foreground">Trả lời đủ {questions.length} câu để gửi.</span> : null}
      </div>
    </div>
  );
}

export default function FollowupPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-12">
      <React.Suspense fallback={null}>
        <FollowupCheckIn />
      </React.Suspense>
    </div>
  );
}
