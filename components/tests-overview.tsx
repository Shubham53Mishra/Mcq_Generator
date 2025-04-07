import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

// Mock data for test analytics
const testData = [
  {
    name: "Quiz 1",
    avgScore: 78,
    passRate: 85,
  },
  {
    name: "Quiz 2",
    avgScore: 82,
    passRate: 90,
  },
  {
    name: "Midterm",
    avgScore: 76,
    passRate: 80,
  },
  {
    name: "Quiz 3",
    avgScore: 85,
    passRate: 95,
  },
]

export function TestsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tests Overview</CardTitle>
        <CardDescription>Performance metrics for your recent tests.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={testData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgScore" name="Average Score (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="passRate" name="Pass Rate (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

