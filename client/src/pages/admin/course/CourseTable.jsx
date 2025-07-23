import { Button } from '@/components/ui/button'
import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNavigate } from 'react-router-dom';
import { useGetCreatorCourseQuery } from '@/features/api/courseApi';
import { Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CourseTable = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetCreatorCourseQuery();

  if (isLoading) return <h1>Loading...</h1>
  return (
    <div>
      <Button onClick={() => navigate("/admin/course/create")} >Create a New Course</Button>
      <Table className="mt-5">
        <TableCaption>A list of your recent Courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead  >Price</TableHead>
            <TableHead  >Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell  >{course.courseTitle}</TableCell>
              <TableCell><Badge> {course?.isPublished ? "Published" : "Draft"}</Badge></TableCell>
              <TableCell>{course?.coursePrice || "NA"}</TableCell>
              <TableCell><Button size="sm" variant="ghost" onClick={() => navigate(`${course._id}`)}><Edit /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default CourseTable
