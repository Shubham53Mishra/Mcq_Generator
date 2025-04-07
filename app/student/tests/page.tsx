import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Nav from "@/components/nav"  // Nav component import kiya

const assignedTests = [
  {
    id: "test1",
    name: "Midterm Exam",
    description: "Covers chapters 1-5 of the textbook",
    duration: 45,
    questions: 15,
    dueDate: "2025-03-15T23:59:59",
    status: "pending",
  },
  {
    id: "test2",
    name: "Quiz 3",
    description: "Short quiz on recent topics",
    duration: 20,
    questions: 10,
    dueDate: "2025-03-10T23:59:59",
    status: "pending",
  },
]

const completedTests = [
  {
    id: "test3",
    name: "Quiz 1",
    description: "Introduction to the course",
    duration: 15,
    questions: 8,
    completedDate: "2025-02-15T14:30:00",
    score: 7,
    totalQuestions: 8,
    status: "completed",
  },
  {
    id: "test4",
    name: "Quiz 2",
    description: "Basic concepts review",
    duration: 20,
    questions: 10,
    completedDate: "2025-02-28T16:45:00",
    score: 8,
    totalQuestions: 10,
    status: "completed",
  },
]

export default function StudentTestsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
    {/* Navbar ko right side me karne ke liye flex-row-reverse */}
    <div className="flex flex-row-reverse justify-between items-center">
      <Nav /> {/* Navbar Right Side */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Tests</h1>
        <p className="text-muted-foreground">View and take your assigned MCQ tests.</p>
      </div>
    </div>
  
      <Tabs defaultValue="assigned" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assigned">Assigned Tests</TabsTrigger>
          <TabsTrigger value="completed">Completed Tests</TabsTrigger>
        </TabsList>
        <TabsContent value="assigned" className="space-y-4">
          {assignedTests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {assignedTests.map((test) => (
                <Card key={test.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{test.name}</CardTitle>
                      <Badge>Pending</Badge>
                    </div>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Duration: {test.duration} minutes</span>
                      </div>
                      <div className="text-sm">Questions: {test.questions}</div>
                      <div className="text-sm">
                        Due: {new Date(test.dueDate).toLocaleDateString()} at{" "}
                        {new Date(test.dueDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/student/test/${test.id}`} className="w-full">
                      <Button className="w-full">Start Test</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p>No assigned tests found.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          {completedTests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {completedTests.map((test) => (
                <Card key={test.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{test.name}</CardTitle>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Completed
                      </Badge>
                    </div>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">
                          Score: {test.score}/{test.totalQuestions} (
                          {Math.round((test.score / test.totalQuestions) * 100)}%)
                        </span>
                      </div>
                      <div className="text-sm">
                        Completed: {new Date(test.completedDate).toLocaleDateString()} at{" "}
                        {new Date(test.completedDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/student/results/${test.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        View Results
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p>No completed tests found.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
