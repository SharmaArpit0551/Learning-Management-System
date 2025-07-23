import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useCreateLectureMutation, useGetCourseLecturesQuery } from '@/features/api/courseApi';
import { toast } from 'sonner';
import Lecture from './Lecture';


const CreateLecture = () => {
    const params = useParams();
    const courseId = params.courseId;
    const [lectureTitle, setLectureTitle] = useState();
    const [createLecture, { data, isLoading, error, isSuccess }] = useCreateLectureMutation();
    const { data: lectureData, isLoading: lectureLoading, isError: lectureError, refetch } = useGetCourseLecturesQuery(courseId);

    const createLectureHandler = async () => {
        await createLecture({ lectureTitle, courseId });
        setLectureTitle("");
    }

    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success(data?.message || "Course Created Successfully")
        }
    }, [isSuccess, error])

    const navigate = useNavigate();
    return (
        <div className="flex-1 mx-10">
            <div className="mb-4">
                <h1 className="font-bold text-xl">
                    <Link to={`/admin/course/${courseId}`}>
                        <Button size="icon" variant="outline" className="rounded-full">
                            <ArrowLeft size={16} />
                        </Button>
                    </Link>  Lets add Lectures, add some basic Lecture details for our course
                </h1>
                <p className="text-sm">
                    Dive into the world of advanced legal studies with our comprehensive LLM program, designed to enhance your expertise and open doors to specialized legal careers globally.
                </p>
            </div>
            <div className="space-y-4">
                <div>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        placeholder="Your Lecture Title     "
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => navigate(`/admin/course/${courseId}`)}>
                        Back to Course
                    </Button>
                    <Button disabled={isLoading} onClick={createLectureHandler}>{
                        isLoading ? <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please Wait</> :
                            "Create Lecture"}
                    </Button>
                </div>
            </div>
            <div className="mt-10">
                {lectureLoading ? (
                    <p>Loading lectures...</p>
                ) : lectureError ? (
                    <p>Failed to load lectures.</p>
                ) : lectureData.lectures.length === 0 ? (
                    <p>No lectures availabe</p>
                ) : (
                    lectureData.lectures.map((lecture, index) => (
                        <Lecture
                            key={lecture._id}
                            lecture={lecture}
                            courseId={courseId}
                            index={index}
                        />

                    ))
                )}
            </div>
        </div>

    )
}

export default CreateLecture
