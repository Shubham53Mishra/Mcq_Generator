import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

// Mock test result data
const mockTestResult = {
  id: "test1",
  name: "Midterm Exam",
  description: "Covers chapters 1-5 of the textbook",
  completedDate: "2025-03-05T14:30:00",
  score: 4,
  totalQuestions: 5,
  timeSpent: "32:45", // MM:SS
  questions: [
    {
      id: "q1",
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris",
      userAnswer: "Paris",
      isCorrect: true,
    },
    {
      id: "q2",
      question: "Which of the following is a JavaScript framework?",
      options: ["Java", "Python", "React", "SQL"],
      correctAnswer: "React",
      userAnswer: "React",
      isCorrect: true,
    },
    {
      id: "q3",
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Hyper Transfer Markup Language",
        "Home Tool Markup Language",
      ],
      correctAnswer: "Hyper Text Markup Language",
      userAnswer: "Hyper Text Markup Language",
      isCorrect: true,
    },
    {
      id: "q4",
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctAnswer: "Mars",
      userAnswer: "Mars",
      isCorrect: true,
    },
    {
      id: "q5",
      question: "What is the time complexity of binary search?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correctAnswer: "O(log n)",
      userAnswer: "O(n)",
      isCorrect: false,
    },
  ],
}

export default function TestResultsPage({ params }: { params: { id: string } }) {
  const percentage = Math.round((mockTestResult.score / mockTestResult.totalQuestions) * 100)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test Results</h1>
          <p className="text-muted-foreground">{mockTestResult.name}</p>
        </div>
        <Link href="/student/tests">
          <Button variant="outline">Back to Tests</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>
            Completed on {new Date(mockTestResult.completedDate).toLocaleDateString()} at{" "}
            {new Date(mockTestResult.completedDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">
                {mockTestResult.score}/{mockTestResult.totalQuestions}
              </div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{percentage}%</div>
              <div className="text-sm text-muted-foreground">Percentage</div>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{mockTestResult.timeSpent}</div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Question Review</h3>
            <div className="space-y-6">
              {mockTestResult.questions.map((q, index) => (
                <div key={q.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">Question {index + 1}</div>
                    {q.isCorrect ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Correct
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Incorrect
                      </Badge>
                    )}
                  </div>
                  <p className="mb-2">{q.question}</p>
                  <div className="space-y-1 text-sm">
                    {q.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-2 rounded ${
                          option === q.correctAnswer
                            ? "bg-green-100 text-green-800"
                            : option === q.userAnswer && !q.isCorrect
                              ? "bg-red-100 text-red-800"
                              : ""
                        }`}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + optIndex)}:</span>
                        {option}
                        {option === q.correctAnswer && <span className="ml-2 text-xs">(Correct Answer)</span>}
                        {option === q.userAnswer && option !== q.correctAnswer && (
                          <span className="ml-2 text-xs">(Your Answer)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

