import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
    useCompleteCourseMutation,
    useGetCourseProgressQuery,
    useInCompleteCourseMutation,
    useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import jsPDF from 'jspdf'
import img from '../../assets/certificate-background.png'
import { useLoadUserQuery } from "@/features/api/authApi";

const CourseProgress = () => {
    const params = useParams();
    const courseId = params.courseId;
    const { data: userData } = useLoadUserQuery();

    const { data, isLoading, isError, refetch } =
        useGetCourseProgressQuery(courseId);

    const [updateLectureProgress] = useUpdateLectureProgressMutation();

    const [completeCourse, { data: markCompleteData, isSuccess: completedSuccess },] = useCompleteCourseMutation();
    const [inCompleteCourse, { data: markInCompleteData, isSuccess: inCompletedSuccess },] = useInCompleteCourseMutation();

    useEffect(() => {
        if (completedSuccess) {
            refetch();
            toast.success(markCompleteData.message || "Course Completed");
        }
        if (inCompletedSuccess) {
            refetch();
            toast.success(markInCompleteData.message);
        }
    }, [completedSuccess, inCompletedSuccess]);

    const [currentLecture, setCurrentLecture] = useState(null);

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Failed to load course details</p>;

    const { courseDetails, progress, completed } = data.data;
    const { courseTitle } = courseDetails;

    // initialze the first lecture is not exist
    const initialLecture =
        currentLecture || (courseDetails.lectures && courseDetails.lectures[0]);

    const isLectureCompleted = (lectureId) => {
        return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
    };

    const handleLectureProgress = async (lectureId) => {
        await updateLectureProgress({ courseId, lectureId });
        refetch();
    };
    // Handle select a specific lecture to watch
    const handleSelectLecture = (lecture) => {
        setCurrentLecture(lecture);
        handleLectureProgress(lecture._id);
    };


    const handleCompleteCourse = async () => {
        await completeCourse(courseId);
    };
    const handleInCompleteCourse = async () => {
        await inCompleteCourse(courseId);
    };

    const generateCertificate = (name, course) => {
        // Create a new jsPDF instance
        const doc = new jsPDF();

        // Add background image
        doc.addImage(img, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

        // Add recipient name
        doc.setFontSize(36);
        doc.setFont('helvetica'); // Change the font family and style
        doc.text(name, 105, 160, { align: 'center' }); // put the nick name 

        // Add course name
        doc.setFontSize(20);
        doc.text(course, 105, 195, { align: 'center' }); // put the course name

        // Save the PDF
        doc.save(`${name}-${course}.pdf`);
    };


    return (
        <div className="max-w-7xl mx-auto p-4 mt-20">
            {/* Display course name  */}
            <div className="flex justify-between mb-4 flex-col sm:flex-row">
                <h1 className="text-2xl font-bold mb-2 sm:mb-0">{courseTitle}</h1>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Button
                        disabled={!completed}
                        className="w-full sm:w-auto"
                        onClick={() => generateCertificate(userData?.user.name, courseTitle)}>
                        {completed ? (
                            <div className="flex items-center">
                                <span>Download Certificate</span>
                            </div>
                        ) : "Download Certificate"}
                    </Button>

                    <Button
                        onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
                        variant={completed ? "outline" : "default"}
                        className="w-full sm:w-auto"
                    >
                        {completed ? (
                            <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2" /> <span>Completed</span>
                            </div>
                        ) : (
                            "Mark as completed"
                        )}
                    </Button>
                </div>
            </div>


            <div className="flex flex-col md:flex-row gap-6">
                {/* Video section  */}
                <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
                    <div>
                        <video
                            src={currentLecture?.videoUrl || initialLecture.videoUrl}
                            controls
                            className="w-full h-auto md:rounded-lg"
                            onPlay={() =>
                                handleLectureProgress(currentLecture?._id || initialLecture._id)
                            }
                        />
                    </div>
                    {/* Display current watching lecture title */}
                    <div className="mt-2 ">
                        <h3 className="font-medium text-lg">
                            {`Lecture ${courseDetails.lectures.findIndex(
                                (lec) =>
                                    lec._id === (currentLecture?._id || initialLecture._id)
                            ) + 1
                                } : ${currentLecture?.lectureTitle || initialLecture.lectureTitle
                                }`}
                        </h3>
                    </div>
                </div>
                {/* Lecture Sidebar  */}
                <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
                    <h2 className="font-semibold text-xl mb-4">Course Lecture</h2>
                    <div className="flex-1 overflow-y-auto">
                        {courseDetails?.lectures.map((lecture) => (
                            <Card
                                key={lecture._id}
                                className={`mb-3 hover:cursor-pointer transition transform ${lecture._id === currentLecture?._id
                                    ? "bg-gray-200 dark:dark:bg-gray-800"
                                    : ""
                                    } `}
                                onClick={() => handleSelectLecture(lecture)}
                            >
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center">
                                        {isLectureCompleted(lecture._id) ? (
                                            <CheckCircle2 size={24} className="text-green-500 mr-2" />
                                        ) : (
                                            <CirclePlay size={24} className="text-gray-500 mr-2" />
                                        )}
                                        <div>
                                            <CardTitle className="text-lg font-medium">
                                                {lecture.lectureTitle}
                                            </CardTitle>
                                        </div>
                                    </div>
                                    {isLectureCompleted(lecture._id) && (
                                        <Badge
                                            variant={"outline"}
                                            className="bg-green-200 text-green-600"
                                        >
                                            Completed
                                        </Badge>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseProgress
