"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import quizData from "@/data/quiz.json";

export default function QuizModal({ onClose }) {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Shuffle questions once when modal opens
  useEffect(() => {
    const shuffled = [...quizData].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, []);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-xl bg-glacier-light p-6 rounded-2xl shadow-lg"
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-glacier-accent hover:scale-110 transition"
          onClick={onClose}
        >
          <X />
        </button>

        {!isCompleted ? (
          <div className="space-y-4">
            {/* Removed "Question 1 of 22" text */}
            <p className="text-lg font-cabin text-glacier-primary">
              {question.question}
            </p>
            <div className="space-y-2">
              {question.options.map((opt, index) => {
                const isCorrect = showAnswer && opt === question.answer;
                const isWrong = showAnswer && selected === opt && opt !== question.answer;
                return (
                  <button
                    key={index}
                    className={`w-full text-left p-3 rounded-md font-cabin border transition duration-200
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
              className="bg-glacier-primary hover:bg-glacier-dark text-white px-4 py-2 rounded-md font-cabin"
            >
              {showAnswer
                ? current + 1 < shuffledQuestions.length
                  ? "Next"
                  : "Finish"
                : "Submit"}
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-nohemi text-glacier-dark">Quiz Completed</h2>
            <p className="text-xl font-cabin text-glacier-primary">
              Your score: {score} / {shuffledQuestions.length}
            </p>
            <button
              onClick={onClose}
              className="mt-4 bg-glacier-accent hover:bg-glacier-dark text-white px-6 py-2 rounded-md font-cabin"
            >
              Close
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
