import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Login from './pages/login.jsx'
import MainLayout from './layout/MainLayout.jsx'
import Herosection from './pages/student/Herosection.jsx'
import Courses from './pages/student/Courses.jsx'
import MyLearning from './pages/student/MyLearning.jsx'
import Profile from './pages/student/Profile.jsx'
import Sidebar from './pages/admin/Sidebar.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import CourseTable from './pages/admin/course/CourseTable.jsx'
import AddCourse from './pages/admin/course/AddCourse.jsx'
import EditCourse from './pages/admin/course/EditCourse.jsx'
import CreateLecture from './pages/admin/lecture/CreateLecture'
import EditLecture from './pages/admin/lecture/EditLecture'
import CourseDetail from './pages/student/CourseDetail'
import CourseProgress from './pages/student/CourseProgress'
import SearchPage from './pages/student/SearchPage'
import { ProtectedRoute, AuthenticatedUser, AdminRoute } from './components/ProtectedRoutes'
import { ThemeProvider } from './components/ThemeProvider'
import PurchaseCourseProtectedRoute from './components/PurchaseCourseProtectedRoute '


const appRouter = createBrowserRouter([{
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element:
        <>
          <Herosection />
          <Courses />
        </>
    },
    {
      path: "login",
      element: <Login />
    },
    {
      path: "mylearning",
      element: (
        <ProtectedRoute>
          <MyLearning />
        </ProtectedRoute>
      )
    },
    {
      path: "profile",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      )
    },
    {
      path: "course/search",
      element: <ProtectedRoute>
        <SearchPage />
      </ProtectedRoute>
    },

    {
      path: "course-detail/:courseId",
      element: (
        <ProtectedRoute>
          <CourseDetail />
        </ProtectedRoute>
      )
    },
    {
      path: "course-progress/:courseId",
      element: (<ProtectedRoute>
        <PurchaseCourseProtectedRoute>
          <CourseProgress />
        </PurchaseCourseProtectedRoute>
      </ProtectedRoute>)
    },

    {
      path: "admin",
      element: (
        <AdminRoute>
          <Sidebar />
        </AdminRoute>

      ),
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "course",
          element: <CourseTable />,
        },
        {
          path: "course/create",
          element: <AddCourse />
        },
        {
          path: "course/:courseId",
          element: <EditCourse />
        },
        {
          path: "course/:courseId/lecture",
          element: <CreateLecture />
        },
        {
          path: "course/:courseId/lecture/:lectureId",
          element: <EditLecture />
        }
      ]
    }

  ]
}])

function App() {

  return (

    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  )
}

export default App
