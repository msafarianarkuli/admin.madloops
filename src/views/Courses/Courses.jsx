import { useEffect, useState } from 'react';
import {
  Edit,
  Search,
  Trash,
  UserMinus,
  UserPlus,
  Users,
} from 'react-feather';
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Badge,
  Card,
  CardBody,
  CardHeader,
  InputGroup,
  InputGroupText,
  Input,
} from 'reactstrap';
import AvatarGroup from '@components/avatar-group';
import Avatar from '@components/avatar';

import { getAllCourses } from '../../services/api/GetAllCourses.api';
import { DeleteCourse } from '../../services/api/DeleteCourse.api';
import { GetAllStudents } from '../../services/api/GetAllStudents.api';
import { AddStudentToCourse } from '../../services/api/AddStudentToCourse.api';
import { RemoveStudentFromCourse } from '../../services/api/RemoveStudentFromCourse.api';
import toast from 'react-hot-toast';
import AddCourse from './AddCourse';
import EditCourse from './CourseEdit';
import { addComma } from '../../utility/funcs';
import Breadcrumbs from '@components/breadcrumbs';

const Courses = () => {
  const [courses, setCourses] = useState();
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [editCourseOpen, setEditCourseOpen] = useState(false);
  const [courseId, setCourseId] = useState(null);
  const [show, setShow] = useState(false);
  const [students, setStudents] = useState([]);
  const [RefreshCourses, setRefreshCourses] = useState(false);

  const toggleAddSidebar = () => setAddCourseOpen(!addCourseOpen);
  const toggleEditSidebar = () => setEditCourseOpen(!editCourseOpen);

  const getAll = async () => {
    try {
      const courses = await getAllCourses();
      setCourses(courses?.data.result);
    } catch (error) {}
  };

  const getAllStudents = async () => {
    try {
      const students = await GetAllStudents();
      const activeStudents = students?.result.filter(
        (student) => student.isActive === true
      );
      setStudents(activeStudents);
    } catch (error) {}
  };

  useEffect(() => {
    getAll();
    getAllStudents();
  }, [RefreshCourses]);

  const handleDelete = async (courseId) => {
    const originalCourses = [...courses];
    const newCourse = courses.filter((m) => m._id !== courseId);
    setCourses(newCourse);
    try {
      await DeleteCourse(courseId);
      setRefreshCourses((old) => !old);
      toast(`آیتم مورد نظر حذف شد`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('خطایی رخ داده');
      }
      setCourses(originalCourses);
    }
  };

  const handleEdit = (courseId) => {
    toggleEditSidebar();
    setCourseId(courseId);
  };

  const handleShowStudents = (courseId) => {
    setShow(!show);
    setCourseId(courseId);
  };

  const handleAddStudentToCourse = async (studentId) => {
    setShow(!show);
    try {
      await AddStudentToCourse(courseId, studentId);
      setRefreshCourses((old) => !old);
      toast.success('دانشجو با موفقیت به دوره اضافه شد');
    } catch (error) {}
  };

  const handleRemoveStudentFromCourse = async (studentId) => {
    setShow(!show);
    try {
      await RemoveStudentFromCourse(courseId, studentId);
      setRefreshCourses((old) => !old);
      toast.success('دانشجو با موفقیت از دوره حذف شد');
    } catch (error) {}
  };
  return courses ? (
    <>
      <Breadcrumbs
        title="مدیریت دوره"
        data={[{ title: 'مدیریت دوره' }]}
      />
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <InputGroup className="input-group-merge">
              <InputGroupText>
                <Search size={14} />
              </InputGroupText>
              <Input placeholder="search..." />
            </InputGroup>
          </div>
          <Button.Ripple
            color="primary"
            size="md"
            className="mb-2"
            onClick={toggleAddSidebar}
          >
            افزودن دوره
          </Button.Ripple>
        </CardHeader>
        <CardBody>
          <Table responsive>
            <thead>
              <tr>
                <th>نام دوره</th>
                <th>مدرس</th>
                <th>ظرفیت</th>
                <th>دانشجویان</th>
                <th>قیمت </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td>
                    <img
                      className="me-75 rounded-circle"
                      src={course.lesson.image}
                      alt={course.title}
                      height="40"
                      width="40"
                    />
                    <span className="align-middle fw-bold">
                      {course.title}
                    </span>
                  </td>
                  <td>{course.teacher.fullName}</td>
                  <td>{course.capacity}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Badge
                        pill
                        color="light-success"
                        className="me-1"
                      >
                        {course.students.length}
                      </Badge>
                      <AvatarGroup data={course.students} />
                    </div>
                  </td>
                  <td>{addComma(course.cost.toString())}</td>
                  <td>
                    <div className="d-inline-block me-1">
                      <Button.Ripple
                        color="primary"
                        size="sm"
                        onClick={() => handleEdit(course._id)}
                      >
                        <Edit size={16} />
                      </Button.Ripple>
                    </div>
                    <div className="d-inline-block me-1">
                      <Button.Ripple color="danger" size="sm">
                        <Trash
                          size={16}
                          onClick={() => handleDelete(course._id)}
                        />
                      </Button.Ripple>
                    </div>
                    <div className="d-inline-block me-1">
                      <Button.Ripple
                        color="success"
                        size="sm"
                        onClick={() => handleShowStudents(course._id)}
                      >
                        <Users size={16} />
                      </Button.Ripple>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <AddCourse
        open={addCourseOpen}
        toggleSidebar={toggleAddSidebar}
        setRefreshCourses={setRefreshCourses}
      />
      <EditCourse
        open={editCourseOpen}
        toggleSidebar={toggleEditSidebar}
        courseId={courseId}
        setRefreshCourses={setRefreshCourses}
      />
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShow(!show)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          {students.map((student) => (
            <div
              key={student._id}
              className="employee-task d-flex justify-content-between align-items-center mb-2"
            >
              <div className="d-flex">
                <Avatar
                  imgClassName="rounded"
                  className="me-75"
                  img={student.profile}
                  imgHeight="42"
                  imgWidth="42"
                />
                <div className="my-auto">
                  <h6 className="mb-0">{student.fullName}</h6>
                  <small className="text-muted">
                    {student.email}
                  </small>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <Button.Ripple
                  color="warning"
                  className="me-1"
                  size="sm"
                  disabled={
                    !student.courses.find(
                      (course) => course._id === courseId
                    )
                  }
                  onClick={() =>
                    handleRemoveStudentFromCourse(student._id)
                  }
                >
                  <UserMinus size={16} />
                </Button.Ripple>
                <Button.Ripple
                  color="success"
                  size="sm"
                  disabled={student.courses.find(
                    (course) => course._id === courseId
                  )}
                  onClick={() =>
                    handleAddStudentToCourse(student._id)
                  }
                >
                  <UserPlus size={16} />
                </Button.Ripple>
              </div>
            </div>
          ))}
        </ModalBody>
      </Modal>
    </>
  ) : (
    <p>Loading...</p>
  );
};

export default Courses;
