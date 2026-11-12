"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Questions come from the "Quiz Questions" collection in WordPress (built-in
// defaults: wordpress/mu-plugins/tvgf-core/schemas/collections/quiz_question.json).
export default function QuizSection({ title = "Do you know enough about glaciers?", questions = [] }) {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Shuffle questions once when quiz starts
  useEffect(() => {
    // The answer must match one of the options — match loosely (case and
    // surrounding spaces) since editors type it by hand, and skip questions
    // where it still doesn't, rather than showing an unwinnable question.
    const playable = questions
      .map((q) => {
        const options = q.options || [];
        const answer = options.find((o) => o.trim().toLowerCase() === (q.answer || "").trim().toLowerCase());
        return { question: q.title, options, answer };
      })
      .filter((q) => q.answer !== undefined);
    setShuffledQuestions([...playable].sort(() => Math.random() - 0.5));
  }, [questions]);

  const question = shuffledQuestions[current];

  const handleOptionClick = (option) => setSelected(option);

  const handleSubmit = () => {
    if (selected === null) return;
    if (!showAnswer) {
      if (selected === question.answer) setScore(score + 1);
      setShowAnswer(true);
    } else {
      if (current + 1 < shuffledQuestions.length) {
        setCurrent(current + 1);
        setSelected(null);
        setShowAnswer(false);
      } else {
        setIsCompleted(true);
      }
    }
  };

  if (shuffledQuestions.length === 0) return null;

  return (
    <section className="w-full min-h-screen bg-glacier-light px-4 py-12 flex flex-col items-center justify-center">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-nohemi text-glacier-dark mb-6 sm:mb-10 text-center"
      >
        {title}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-3xl bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-glacier-soft"
      >
        {!isCompleted ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Removed "Question X of Y" heading */}
            <p className="text-sm sm:text-base md:text-lg font-cabin text-glacier-primary">
              {question.question}
            </p>
            <div className="space-y-2">
              {question.options.map((opt, index) => {
                const isCorrect = showAnswer && opt === question.answer;
                const isWrong =
                  showAnswer && selected === opt && opt !== question.answer;
                return (
                  <button
                    key={index}
                    className={`w-full text-left p-3 rounded-md font-cabin border transition duration-200 text-sm sm:text-base
                      ${selected === opt ? "border-glacier-accent" : "border-glacier-soft"}
                      ${isCorrect ? "bg-green-100 border-green-500" : ""}
                      ${isWrong ? "bg-red-100 border-red-500" : ""}`}
                    onClick={() => handleOptionClick(opt)}
                    disabled={showAnswer}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleSubmit}
              className="bg-glacier-primary hover:bg-glacier-dark text-white px-4 py-2 rounded-md font-cabin text-sm sm:text-base"
            >
              {showAnswer
                ? current + 1 < shuffledQuestions.length
                  ? "Next"
                  : "Finish"
                : "Submit"}
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-nohemi text-glacier-dark">
              Quiz Completed
            </h2>
            <p className="text-sm sm:text-lg md:text-xl font-cabin text-glacier-primary">
              Your score: {score} / {shuffledQuestions.length}
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
