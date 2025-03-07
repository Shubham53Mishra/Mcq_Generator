"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// Mock questions data
const mockQuestions = [
  {
    id: "q1",
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    topic: "Geography",
    difficulty: "Easy",
  },
  {
    id: "q2",
    question: "Which of the following is a JavaScript framework?",
    options: ["Java", "Python", "React", "SQL"],
    correctAnswer: "React",
    topic: "Programming",
    difficulty: "Medium",
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
    topic: "Web Development",
    difficulty: "Easy",
  },
  {
    id: "q4",
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctAnswer: "Mars",
    topic: "Astronomy",
    difficulty: "Easy",
  },
  {
    id: "q5",
    question: "What is the time complexity of binary search?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: "O(log n)",
    topic: "Algorithms",
    difficulty: "Hard",
  },
]

// Mock students data
const mockStudents = [
  { id: "s1", name: "Alice Johnson", email: "alice@example.com" },
  { id: "s2", name: "Bob Smith", email: "bob@example.com" },
  { id: "s3", name: "Charlie Brown", email: "charlie@example.com" },
  { id: "s4", name: "Diana Miller", email: "diana@example.com" },
  { id: "s5", name: "Edward Wilson", email: "edward@example.com" },
]

export default function CreateTestPage() {
  const { toast } = useToast()
  const [testName, setTestName] = useState("")
  const [testDescription, setTestDescription] = useState("")
  const [duration, setDuration] = useState("30")
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [filterTopic, setFilterTopic] = useState("all")
  const [filterDifficulty, setFilterDifficulty] = useState("all")

  const filteredQuestions = mockQuestions.filter(
    (q) =>
      (filterTopic === "all" || q.topic === filterTopic) &&
      (filterDifficulty === "all" || q.difficulty === filterDifficulty),
  )

  const handleQuestionToggle = (questionId: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
    )
  }

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const handleSelectAllQuestions = () => {
    if (selectedQuestions.length === filteredQuestions.length) {
      setSelectedQuestions([])
    } else {
      setSelectedQuestions(filteredQuestions.map((q) => q.id))
    }
  }

  const handleSelectAllStudents = () => {
    if (selectedStudents.length === mockStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(mockStudents.map((s) => s.id))
    }
  }

  const handleCreateTest = () => {
    if (!testName) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide a test name.",
      })
      return
    }

    if (selectedQuestions.length === 0) {
      toast({
        variant: "destructive",
        title: "No questions selected",
        description: "Please select at least one question for the test.",
      })
      return
    }

    if (selectedStudents.length === 0) {
      toast({
        variant: "destructive",
        title: "No students selected",
        description: "Please select at least one student to assign the test to.",
      })
      return
    }

    // Here you would normally send the data to your API
    toast({
      title: "Test created successfully",
      description: `Created "${testName}" with ${selectedQuestions.length} questions for ${selectedStudents.length} students.`,
    })

    // Reset form
    setTestName("")
    setTestDescription("")
    setDuration("30")
    setSelectedQuestions([])
    setSelectedStudents([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Test</h1>
        <p className="text-muted-foreground">Create a new MCQ test and assign it to students.</p>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Test Details</TabsTrigger>
          <TabsTrigger value="questions">Select Questions</TabsTrigger>
          <TabsTrigger value="students">Assign Students</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Information</CardTitle>
              <CardDescription>Provide basic information about the test.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="test-name">Test Name</Label>
                <Input
                  id="test-name"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="Midterm Exam"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="test-description">Description (Optional)</Label>
                <Textarea
                  id="test-description"
                  value={testDescription}
                  onChange={(e) => setTestDescription(e.target.value)}
                  placeholder="This test covers chapters 1-5..."
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="test-duration">Duration (minutes)</Label>
                <Input
                  id="test-duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="5"
                  max="180"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Questions</CardTitle>
              <CardDescription>Choose questions to include in this test.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="filter-topic">Filter by Topic</Label>
                  <Select value={filterTopic} onValueChange={setFilterTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Topics</SelectItem>
                      <SelectItem value="Geography">Geography</SelectItem>
                      <SelectItem value="Programming">Programming</SelectItem>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Astronomy">Astronomy</SelectItem>
                      <SelectItem value="Algorithms">Algorithms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="filter-difficulty">Filter by Difficulty</Label>
                  <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all-questions"
                  checked={filteredQuestions.length > 0 && selectedQuestions.length === filteredQuestions.length}
                  onCheckedChange={handleSelectAllQuestions}
                />
                <label
                  htmlFor="select-all-questions"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Select All ({filteredQuestions.length})
                </label>
              </div>
              <ScrollArea className="h-[300px] rounded-md border">
                <div className="p-4">
                  {filteredQuestions.map((question, index) => (
                    <div key={question.id} className="mb-4 last:mb-0">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id={`question-${question.id}`}
                          checked={selectedQuestions.includes(question.id)}
                          onCheckedChange={() => handleQuestionToggle(question.id)}
                          className="mt-1"
                        />
                        <div className="grid gap-1.5">
                          <label
                            htmlFor={`question-${question.id}`}
                            className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {index + 1}. {question.question}
                          </label>
                          <div className="text-sm text-muted-foreground">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mr-2">
                              {question.topic}
                            </span>
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                              {question.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      {index < filteredQuestions.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="text-sm text-muted-foreground">
                Selected {selectedQuestions.length} of {filteredQuestions.length} questions
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assign to Students</CardTitle>
              <CardDescription>Select students who will take this test.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all-students"
                  checked={mockStudents.length > 0 && selectedStudents.length === mockStudents.length}
                  onCheckedChange={handleSelectAllStudents}
                />
                <label
                  htmlFor="select-all-students"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Select All ({mockStudents.length})
                </label>
              </div>
              <ScrollArea className="h-[300px] rounded-md border">
                <div className="p-4">
                  {mockStudents.map((student, index) => (
                    <div key={student.id} className="mb-4 last:mb-0">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`student-${student.id}`}
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() => handleStudentToggle(student.id)}
                        />
                        <label
                          htmlFor={`student-${student.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {student.name} ({student.email})
                        </label>
                      </div>
                      {index < mockStudents.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="text-sm text-muted-foreground">
                Selected {selectedStudents.length} of {mockStudents.length} students
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateTest}>Create Test</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

