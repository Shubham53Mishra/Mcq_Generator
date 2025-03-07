"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { FileUp, Loader2, Upload, File, X, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export default function UploadPage() {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedQuestions, setExtractedQuestions] = useState<any[]>([])
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      handleFileSelection(selectedFile)
    }
  }

  const handleFileSelection = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF file.",
      })
      return
    }

    setFile(selectedFile)

    // Create a URL for the PDF preview
    const fileUrl = URL.createObjectURL(selectedFile)
    setPdfPreviewUrl(fileUrl)

    toast({
      title: "File selected",
      description: `${selectedFile.name} (${formatFileSize(selectedFile.size)})`,
    })
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPdfPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a PDF file to upload.",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 200)

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)
      setIsUploading(false)
      setIsProcessing(true)

      // Simulate AI processing
      setTimeout(() => {
        setIsProcessing(false)
        // Mock extracted questions
        setExtractedQuestions([
          {
            id: "q1",
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            correctAnswer: "Paris",
          },
          {
            id: "q2",
            question: "Which of the following is a JavaScript framework?",
            options: ["Java", "Python", "React", "SQL"],
            correctAnswer: "React",
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
          },
        ])

        toast({
          title: "Processing complete",
          description: "Successfully extracted 3 questions from the PDF.",
        })
      }, 3000)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Questions</h1>
        <p className="text-muted-foreground">Upload PDF files containing MCQ questions for AI extraction.</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload PDF</TabsTrigger>
          <TabsTrigger value="extracted" disabled={extractedQuestions.length === 0}>
            Extracted Questions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload PDF</CardTitle>
              <CardDescription>
                Upload a PDF file containing MCQ questions. Our AI will extract and organize them.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                  isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                  file ? "bg-muted/50" : "",
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading || isProcessing}
                />

                {!file ? (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm text-muted-foreground">PDF files only (max 10MB)</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <File className="h-8 w-8 text-primary" />
                      <div className="text-left">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFile()
                      }}
                      disabled={isUploading || isProcessing}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {pdfPreviewUrl && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted px-4 py-2 text-sm font-medium">PDF Preview</div>
                  <iframe src={pdfPreviewUrl} className="w-full h-[400px]" title="PDF Preview" />
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Uploading...</Label>
                    <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {isProcessing && (
                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <div>
                    <p className="font-medium">Processing PDF with AI</p>
                    <p className="text-sm text-muted-foreground">
                      Extracting questions and answers. This may take a moment...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleRemoveFile} disabled={!file || isUploading || isProcessing}>
                Clear
              </Button>
              <Button onClick={handleUpload} disabled={!file || isUploading || isProcessing} className="gap-2">
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : extractedQuestions.length > 0 ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Processed
                  </>
                ) : (
                  <>
                    <FileUp className="h-4 w-4" />
                    Upload & Process
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="extracted" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Extracted Questions</CardTitle>
              <CardDescription>Review and edit the questions extracted from your PDF.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {extractedQuestions.map((question, index) => (
                  <div key={question.id} className="space-y-2 border-b pb-4 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Question {index + 1}:</span>
                      <span>{question.question}</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      {question.options.map((option: string, optIndex: number) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <span
                            className={`text-sm ${option === question.correctAnswer ? "font-bold text-green-600" : ""}`}
                          >
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          <span className={option === question.correctAnswer ? "font-bold text-green-600" : ""}>
                            {option}
                          </span>
                          {option === question.correctAnswer && (
                            <span className="ml-2 text-xs text-green-600">(Correct)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Questions</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

