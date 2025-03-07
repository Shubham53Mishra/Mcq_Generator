import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"

// Mock data for recent uploads
const recentUploads = [
  {
    id: "upload1",
    filename: "midterm_questions.pdf",
    uploadDate: "2025-03-01T10:15:00",
    status: "success",
    questionsExtracted: 45,
  },
  {
    id: "upload2",
    filename: "quiz3_questions.pdf",
    uploadDate: "2025-02-28T14:30:00",
    status: "success",
    questionsExtracted: 20,
  },
  {
    id: "upload3",
    filename: "final_exam_draft.pdf",
    uploadDate: "2025-02-25T09:45:00",
    status: "processing",
    questionsExtracted: null,
  },
  {
    id: "upload4",
    filename: "invalid_format.pdf",
    uploadDate: "2025-02-20T16:20:00",
    status: "failed",
    questionsExtracted: 0,
    error: "Could not extract questions. Invalid format.",
  },
]

export function RecentUploads() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Uploads</CardTitle>
        <CardDescription>Your recently uploaded PDF files and their processing status.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentUploads.map((upload) => (
            <div key={upload.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{upload.filename}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(upload.uploadDate).toLocaleDateString()} at{" "}
                      {new Date(upload.uploadDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {upload.status === "success" && (
                  <>
                    <span className="text-sm font-medium">{upload.questionsExtracted} questions</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </>
                )}
                {upload.status === "processing" && (
                  <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                    Processing
                  </span>
                )}
                {upload.status === "failed" && (
                  <div className="flex items-center gap-1">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-500">{upload.error}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

