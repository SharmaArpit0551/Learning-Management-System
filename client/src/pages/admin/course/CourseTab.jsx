import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams } from 'react-router-dom';
import RichTextEditor from '@/components/RichTextEditor.jsx';
import { Loader2 } from 'lucide-react';
import { useGetCourseByIdQuery, usePublishCourseMutation, useUpdateCourseMutation } from '@/features/api/courseApi';
import { toast } from 'sonner';

const CourseTab = () => {

    const params = useParams();
    const courseId = params.courseId;

    const navigate = useNavigate();
    const [publishCourse, { data: publishCourseData }] = usePublishCourseMutation()

    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: "",
    });

    const [previewThumbnail, setPreviewThumbnail] = useState("");
    const [updateCourse, data, isLoading, isSuccess, error] = useUpdateCourseMutation();
    const { data: courseByIdData, isLoading: courseByIdLoading } = useGetCourseByIdQuery(courseId)

    //Publish Course Handler
    const publishCourseHanlder = async (e) => {
        try {
            const response = await publishCourse({ courseId, query: e })
            if (response.data) {
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Fail to Change the Status of Course");
        }
    }

    //Fetching Course Information By Id
    useEffect(() => {
        if (courseByIdData?.course) {
            const course = courseByIdData.course;
            setInput({
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseThumbnail: course.courseThumbnail,
            });
            toast.success("Course Details Fetched")
            setPreviewThumbnail(course.courseThumbnail);
        }
    }, [courseByIdData])

    //On change handler
    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    //Capturing selected courseCategory
    const selectCategory = (value) => {
        setInput({ ...input, category: value });
    };

    //Capturing selected courseLevel
    const selectCourseLevel = (value) => {
        setInput({ ...input, courseLevel: value });
    };

    //Capturing thumbnail
    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, courseThumbnail: file });
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    }

    //Handling Update request
    const updateCourseHandler = async () => {
        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle);
        formData.append("subTitle", input.subTitle);
        formData.append("description", input.description);
        formData.append("category", input.category);
        formData.append("courseLevel", input.courseLevel);
        formData.append("coursePrice", input.coursePrice);
        formData.append("courseThumbnail", input.courseThumbnail);

        await updateCourse({ formData, courseId })
    }

    //Update Handler Toast
    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "Course update.");
        }
        if (error) {
            toast.error(error.data.message || "Failed to update course");
        }
    }, [isSuccess, error]);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>
                        Make changes to your courses here. Click save when you're done.
                    </CardDescription>
                </div>

                <div className="space-x-2">
                    <Button disabled={courseByIdData?.course.lectures.length === 0} variant="outline" onClick={() => { publishCourseHanlder(courseByIdData?.course.isPublished ? "false" : "true") }}>
                        {courseByIdData?.course.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    <Button>Remove Course</Button>
                </div>

            </CardHeader>
            <CardContent>
                <div className="space-y-4 mt-5">
                    <div>
                        <Label>Title</Label>
                        <Input
                            type="text"
                            name="courseTitle"
                            value={input.courseTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Fullstack developer"
                        />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input
                            type="text"
                            name="subTitle"
                            value={input.subTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Become a Fullstack developer from zero to hero in 2 months"
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>
                    <div className="flex items-center gap-5">
                        <div>
                            <Label>Category</Label>
                            <Select
                                value={input.category}
                                onValueChange={selectCategory}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        <SelectItem value="Next JS">Next JS</SelectItem>
                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                        <SelectItem value="Frontend Development">
                                            Frontend Development
                                        </SelectItem>
                                        <SelectItem value="Fullstack Development">
                                            Fullstack Development
                                        </SelectItem>
                                        <SelectItem value="MERN Stack Development">
                                            MERN Stack Development
                                        </SelectItem>
                                        <SelectItem value="Javascript">Javascript</SelectItem>
                                        <SelectItem value="Python">Python</SelectItem>
                                        <SelectItem value="Docker">Docker</SelectItem>
                                        <SelectItem value="MongoDB">MongoDB</SelectItem>
                                        <SelectItem value="HTML">HTML</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Course Level</Label>
                            <Select
                                value={input.courseLevel}
                                onValueChange={selectCourseLevel}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a course level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Course Level</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Advance">Advance</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Price in (INR)</Label>
                            <Input
                                type="text"
                                name="coursePrice"
                                value={input.coursePrice}
                                onChange={changeEventHandler}
                                placeholder="199"
                                className="w-fit"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Course Thumbnail</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            className="w-fit"
                            onChange={selectThumbnail}
                        />
                        {
                            previewThumbnail && (
                                <img src={previewThumbnail} className='w-64 my-2' alt='courseThumbnail' />
                            )
                        }
                    </div>
                    <div>
                        <Button onClick={() => navigate("/admin/course")} variant="outline">
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={updateCourseHandler} >
                            {isLoading ? (<>
                                <Loader2 className='animate-spin mr-2 h-4 w-4'>Please Wait</Loader2></>) : "Save"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CourseTab;
