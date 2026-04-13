"use client";

import { useEffect, useRef, useState } from "react";
import { PanelLeft } from "lucide-react";

import { PageLoader } from "@/components/ui/manual/page-loader";
import { colors as C } from "@/features/diary/constants/tokens";
import { useDiary } from "@/features/diary/hooks/useDiary";
import { useBraveChoice } from "@/features/diary/hooks/useBraveChoice";
import { DiaryNavbar } from "@/features/diary/components/DiaryNavbar";
import { DiaryLeftPage } from "@/features/diary/components/DiaryLeftPage";
import { BookSpine } from "@/features/diary/components/BookSpine";
import { DiaryRightPage } from "@/features/diary/components/DiaryRightPage";
import { BraveChoiceModal } from "@/features/diary/components/BraveChoiceModal";
import { DiaryBookIntro } from "@/features/diary/components/DiaryBookIntro";

type DiaryPageClientProps = {
  entryId: string;
  initialUserMeta: {
    id: string;
    name: string;
    plan: "free" | "premium";
    streakDays: number;
    parentEmail?: string;
  };
};

export function DiaryPageClient({
  entryId,
  initialUserMeta,
}: DiaryPageClientProps) {
  const diary = useDiary(entryId, initialUserMeta);
  const quiz = useBraveChoice(diary.user);

  const [showBookIntro, setShowBookIntro] = useState(false);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const [desktopHistoryOpen, setDesktopHistoryOpen] = useState(true);

  const hasPlayedIntroRef = useRef(false);

  useEffect(() => {
    if (diary.isLoading || !diary.user) return;

    if (!hasPlayedIntroRef.current) {
      hasPlayedIntroRef.current = true;
      setShowBookIntro(true);
    }
  }, [diary.isLoading, diary.user]);

  if (diary.isLoading || !diary.user) {
    return <PageLoader message="Memuat diary..." />;
  }

  const isPremium = diary.user.plan === "premium";
  const canLoadNext = isPremium || quiz.quizRemaining > 1;

  return (
    <div
      style={{
        fontFamily: "var(--font-plus-jakarta), 'Plus Jakarta Sans', sans-serif",
        background: `linear-gradient(180deg, ${C.inkS} 0%, ${C.bg} 52%, ${C.paperL} 100%)`,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DiaryBookIntro
        show={showBookIntro}
        onFinish={() => setShowBookIntro(false)}
      />

      <DiaryNavbar
        user={diary.user}
        planCfg={diary.planCfg}
        diaryRemaining={
          diary.diaryRemaining === Infinity ? 999 : diary.diaryRemaining
        }
      />

      <div className="hidden md:block" style={{ flex: 1 }}>
        <div
          style={{
            width: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "18px 16px 32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              borderRadius: 24,
              overflow: "hidden",
              background: C.spine,
              boxShadow: "0 28px 70px rgba(16, 45, 53, 0.16)",
              minHeight: 720,
            }}
          >
            <DiaryLeftPage
              mode="desktop"
              isOpen={desktopHistoryOpen}
              onClose={() => setDesktopHistoryOpen(false)}
              onOpen={() => setDesktopHistoryOpen(true)}
              user={diary.user}
              entries={diary.entries}
              selectedEntry={diary.selectedEntry}
              activeMonth={diary.activeMonth}
              selectedDate={diary.selectedDate}
              planCfg={diary.planCfg}
              quizRemaining={
                quiz.quizRemaining === Infinity ? 999 : quiz.quizRemaining
              }
              canDoQuiz={quiz.canDoQuiz}
              onSelectEntry={diary.setSelectedEntry}
              onGoToToday={diary.goToToday}
              onOpenQuiz={quiz.loadQuiz}
              onPrevMonth={diary.goToPrevMonth}
              onNextMonth={diary.goToNextMonth}
              onSelectDate={diary.selectCalendarDate}
            />

            {desktopHistoryOpen ? (
              <div className="hidden md:block">
                <BookSpine />
              </div>
            ) : null}

            {diary.selectedEntry ? (
              <div style={{ flex: 1, minWidth: 0, display: "flex" }}>
                <DiaryRightPage
                  entry={diary.selectedEntry}
                  messages={diary.messages}
                  inputValue={diary.inputValue}
                  isAiTyping={diary.isAiTyping}
                  isReadOnly={diary.isReadOnly}
                  canWriteDiary={diary.canWriteDiary}
                  isPremium={isPremium}
                  diaryPerMonth={
                    diary.planCfg.diaryPerMonth === Infinity
                      ? 999
                      : diary.planCfg.diaryPerMonth
                  }
                  chatScrollRef={diary.chatScrollRef}
                  textareaRef={diary.textareaRef}
                  onPrevEntry={diary.goToPrevEntry}
                  onNextEntry={diary.goToNextEntry}
                  onInputChange={diary.setInputValue}
                  onSend={diary.handleSendMessage}
                  onKeyDown={diary.handleKeyDown}
                  isMobile={false}
                />
              </div>
            ) : (
              <EmptyDiaryState activeMonth={diary.activeMonth} />
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden" style={{ flex: 1 }}>
        <div
          style={{
            width: "100%",
            maxWidth: 760,
            margin: "0 auto",
            padding: "14px 14px 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <button
              type="button"
              onClick={() => setMobileHistoryOpen(true)}
              style={{
                height: 38,
                padding: "0 14px",
                borderRadius: 999,
                border: `1px solid ${C.bd}`,
                background: C.white,
                color: C.inkD,
                fontSize: 12,
                fontWeight: 800,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 6px 16px rgba(13,70,70,0.08)",
              }}
            >
              <PanelLeft size={15} />
              Riwayat Diary
            </button>
          </div>

          <div
            style={{
              borderRadius: 22,
              overflow: "hidden",
              background: C.paper,
              boxShadow: "0 18px 44px rgba(16,45,53,0.10)",
              border: `1px solid ${C.bdL}`,
            }}
          >
            {diary.selectedEntry ? (
              <DiaryRightPage
                entry={diary.selectedEntry}
                messages={diary.messages}
                inputValue={diary.inputValue}
                isAiTyping={diary.isAiTyping}
                isReadOnly={diary.isReadOnly}
                canWriteDiary={diary.canWriteDiary}
                isPremium={isPremium}
                diaryPerMonth={
                  diary.planCfg.diaryPerMonth === Infinity
                    ? 999
                    : diary.planCfg.diaryPerMonth
                }
                chatScrollRef={diary.chatScrollRef}
                textareaRef={diary.textareaRef}
                onPrevEntry={diary.goToPrevEntry}
                onNextEntry={diary.goToNextEntry}
                onInputChange={diary.setInputValue}
                onSend={diary.handleSendMessage}
                onKeyDown={diary.handleKeyDown}
                isMobile
              />
            ) : (
              <EmptyDiaryState activeMonth={diary.activeMonth} />
            )}
          </div>
        </div>

        <DiaryLeftPage
          mode="mobile"
          isOpen={mobileHistoryOpen}
          onClose={() => setMobileHistoryOpen(false)}
          onOpen={() => setMobileHistoryOpen(true)}
          user={diary.user}
          entries={diary.entries}
          selectedEntry={diary.selectedEntry}
          activeMonth={diary.activeMonth}
          selectedDate={diary.selectedDate}
          planCfg={diary.planCfg}
          quizRemaining={
            quiz.quizRemaining === Infinity ? 999 : quiz.quizRemaining
          }
          canDoQuiz={quiz.canDoQuiz}
          onSelectEntry={(entry) => {
            diary.setSelectedEntry(entry);
            setMobileHistoryOpen(false);
          }}
          onGoToToday={() => {
            diary.goToToday();
            setMobileHistoryOpen(false);
          }}
          onOpenQuiz={() => {
            quiz.loadQuiz();
            setMobileHistoryOpen(false);
          }}
          onPrevMonth={diary.goToPrevMonth}
          onNextMonth={diary.goToNextMonth}
          onSelectDate={(date) => {
            diary.selectCalendarDate(date);
            setMobileHistoryOpen(false);
          }}
        />
      </div>

      <BraveChoiceModal
        isOpen={quiz.showModal}
        onClose={quiz.closeModal}
        quiz={quiz.currentQuiz}
        isLoading={quiz.isLoading}
        quizRemaining={
          quiz.quizRemaining === Infinity ? 999 : quiz.quizRemaining
        }
        quizPerDay={
          diary.planCfg.quizPerDay === Infinity ? 999 : diary.planCfg.quizPerDay
        }
        plan={diary.user.plan}
        canLoadNext={canLoadNext}
        onNextQuiz={quiz.loadNextQuiz}
        onAnswerSubmit={quiz.handleAnswerSubmit}
      />
    </div>
  );
}

function EmptyDiaryState({ activeMonth }: { activeMonth: string }) {
  return (
    <div
      style={{
        flex: 1,
        background: C.paper,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        minHeight: 320,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          borderRadius: 18,
          background: C.white,
          border: `1px solid ${C.bdL}`,
          padding: "28px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: C.inkD,
            margin: "0 0 8px",
          }}
        >
          Belum ada diary di hari pada bulan {activeMonth}
        </p>

        <p
          style={{
            fontSize: 13,
            color: C.sub,
            lineHeight: 1.7,
            margin: 0,
            fontStyle: "italic",
          }}
        >
          Coba pilih tanggal lain dari kalender atau pindah bulan dari riwayat
          diary.
        </p>
      </div>
    </div>
  );
}
