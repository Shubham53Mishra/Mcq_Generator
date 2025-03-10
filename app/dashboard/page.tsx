 "use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, BookOpen, BarChart } from "lucide-react";
import { RecentUploads } from "@/components/recent-uploads";
import { TestsOverview } from "@/components/tests-overview";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
// import Cookies from "js-cookie";

export default function DashboardPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    onDrop: (acceptedFiles) => setSelectedFile(acceptedFiles[0]),
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (res.ok) {
      alert("File uploaded successfully!");
      extractText(selectedFile.name);
    } else {
      alert("Upload failed: " + data.error);
    }
  };

  const extractText = async (fileName: string) => {
    const res = await fetch(`/api/extract?id=${encodeURIComponent(fileName)}`);
    const data = await res.json();

    if (res.ok) {
      setText(data.text);
    } else {
      alert("Error extracting text: " + data.error);
    }
  };

  // useEffect(() => {
  //   const token = Cookies.get("token"); // Check if token exists
  //   if (!token) {
  //     router.push("/login"); // Redirect to login if no token found
  //   }
  // }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your faculty dashboard. Manage your MCQ tests and monitor student performance.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 created this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+5 new students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <p className="text-xs text-muted-foreground">+2% from last test</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="uploads">Recent Uploads</TabsTrigger>
          <TabsTrigger value="tests">Active Tests</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <TestsOverview />
        </TabsContent>
        <TabsContent value="uploads" className="space-y-4">
          <RecentUploads />
        </TabsContent>
        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Tests</CardTitle>
              <CardDescription>View and manage your currently active tests.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>No active tests found. Create a new test to get started.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="p-5">
        <h1 className="text-xl font-bold">Upload & Extract Text using Google Gemini</h1>
        <div {...getRootProps()} className="border-2 border-dashed p-5 cursor-pointer my-4">
          <input {...getInputProps()} />
          <p>Drag & drop a PDF file here, or click to select</p>
        </div>
        {selectedFile && (
          <div>
            <p>Selected File: {selectedFile.name}</p>
            <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 mt-3">
              Upload & Extract Text
            </button>
          </div>
        )}
        {text && (
          <div className="mt-5">
            <h2 className="text-lg font-bold">Extracted Text:</h2>
            <pre className="p-3 border">{text}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
