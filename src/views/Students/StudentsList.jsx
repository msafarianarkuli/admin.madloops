import { useEffect, useState } from "react";
import {
  Book,
  Edit,
  Minus,
  Plus,
  Search,
  Trash,
  UserCheck,
  UserX,
  Layers,
} from "react-feather";
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
} from "reactstrap";
import Avatar from "@components/avatar";
import { GetAllStudents } from "../../services/api/GetAllStudents.api";
import toast from "react-hot-toast";
import { ActiveStudent } from "../../services/api/ActiveStudent";
import { DeactiveStudent } from "../../services/api/deactiveStudent";
import { DeleteStudentById } from "../../services/api/DeleteStudentById";
import StudentEdit from "./StudentEdit";
import { RemoveStudentFromCourse } from "./../../services/api/RemoveStudentFromCourse.api";
import { AddStudentToCourse } from "./../../services/api/AddStudentToCourse.api";
import { getAllCourses } from "./../../services/api/GetAllCourses.api";
import AddStudent from "./AddStudent";
import Breadcrumbs from "@components/breadcrumbs";
import { DeleteCourse } from "./../../services/api/DeleteCourse.api";

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [editStudentOpen, setEditStudentOpen] = useState(false);
  const [studentsId, setStudentsId] = useState();
  const [courses, setCourses] = useState([]);
  const [show, setShow] = useState(false);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [RefreshStudentInfo, setRefreshStudentInfo] = useState(false);
  const [refStudentModal, setRefStudentModal] = useState(false);
  const [studentName, setStudentName] = useState(null);
  const [studentModal, setStudentModal] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const getAll = async () => {
      try {
        const students = await GetAllStudents();
        setStudents(students?.result);
      } catch (error) {}
    };
    getAll();
  }, [RefreshStudentInfo]);

  useEffect(() => {
    const getAllCourse = async () => {
      try {
        const courses = await getAllCourses();
        setCourses(courses?.data.result);
        setStudentModal(courses?.data.result);
      } catch (error) {}
    };
    getAllCourse();
  }, [refStudentModal]);

  const handleDelete = async (studentId) => {
    const res = await DeleteStudentById(studentId);
    if (res.success === true) {
      setStudents((old) => {
        let newData = [...old];
        let newStudentData = newData;
        newStudentData = newStudentData.filter(
          (item) => item._id !== studentId
        );
        newData = newStudentData;
        return newData;
      });
      toast.success(`دانشجو با موفقیت حذف شد`);
    } else {
      toast.error("خطایی رخ داده لطفا مجددا امتحان فرمایید");
    }
  };

  const handleActive = async (studentId) => {
    try {
      await ActiveStudent(studentId);
      toast.success(`وضعیت دانشجو به فعال تغییر کرد`);
      setRefreshStudentInfo((old) => !old);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("خطایی رخ داده");
      }
    }
  };

  const handleDeactive = async (studentId) => {
    try {
      await DeactiveStudent(studentId);
      toast.success(`وضعیت دانشجو به غیر فعال تغییر کرد`);
      setRefreshStudentInfo((old) => !old);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("خطایی رخ داده");
      }
    }
  };

  const handleShowCourses = (studentId) => {
    setShow(!show);
    setStudentsId(studentId);
  };

  const handleAddStudentToCourse = async (courseId) => {
    setShow(!show);
    try {
      await AddStudentToCourse(courseId, studentsId);
      setRefStudentModal((old) => !old);
      toast.success("دانشجو با موفقیت به دوره اضافه شد");
    } catch (error) {
      toast.error("افزودن دانشجو با مشکل مواجه شد");
    }
  };

  const handleRemoveStudentFromCourse = async (courseId) => {
    setShow(!show);
    try {
      await RemoveStudentFromCourse(courseId, studentsId);
      setRefStudentModal((old) => !old);
      toast.success("دانشجو با موفقیت از دوره حذف شد");
    } catch (error) {
      toast.error("حذف دانشجو با مشکل مواجه شد");
    }
  };
  const toggleAddSidebar = () => setAddStudentOpen(!addStudentOpen);
  const toggleEditSidebar = () => setEditStudentOpen(!editStudentOpen);

  const handleEdit = (studentId) => {
    toggleEditSidebar();
    setStudentsId(studentId);
  };

  const handleShowStudentCourse = (studentId, studentTitle) => {
    setModal(true);
    setStudentName(studentTitle);
    setStudentsId(studentId);
  };

  const handleDeleteStudentCourse = async (courseId, courseName) => {
    const res = await DeleteCourse(courseId);
    if (res.success === true) {
      setStudentModal((old) => {
        let newData = [...old];
        let newTeachersData = newData;
        newTeachersData = newTeachersData.filter(
          (item) => item._id !== studentsId
        );
        newData = newTeachersData;
        return newData;
      });
      setRefreshStudentInfo((old) => !old);
      toast.success(`دوره ${courseName} با موفقیت از دانشجو حذف شد`);
    } else {
      toast.error("خطایی رخ داده لطفا مجددا امتحان فرمایید");
    }
  };
  console.log(studentModal);
  return students ? (
    <>
      <Breadcrumbs
        title="مدیریت دانشجویان"
        data={[{ title: "مدیریت دانشجویان" }]}
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
            افزودن دانشجو
          </Button.Ripple>
        </CardHeader>
        <CardBody>
          <Table responsive>
            <thead>
              <tr>
                <th>نام دانشجو</th>
                <th>کد ملی</th>
                <th>شماره تماس</th>
                <th>تاریخ تولد</th>
                <th>وضعیت</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.map((course) => (
                <tr key={course._id}>
                  <td>
                    <img
                      className="me-75 rounded-circle"
                      src={course.profile}
                      alt="angular"
                      height="40"
                      width="40"
                    />
                    <span className="align-middle fw-bold">
                      {course.fullName}
                    </span>
                  </td>
                  <td>{course.nationalId}</td>
                  <td>{course.phoneNumber}</td>
                  <td>{course.birthDate}</td>
                  <td>
                    {course.isActive ? (
                      <Badge className="px-1" pill color="light-success">
                        فعال
                      </Badge>
                    ) : (
                      <Badge className="px-2" color="light-danger">
                        غیرفعال
                      </Badge>
                    )}
                  </td>
                  <td>
                    <div className="d-inline-block me-1">
                      <Button.Ripple
                        color="success"
                        size="sm"
                        onClick={() => handleShowCourses(course._id)}
                      >
                        <Book size={16} />
                      </Button.Ripple>
                    </div>
                    <div className="d-inline-block me-1">
                      <Button.Ripple
                        color="warning"
                        size="sm"
                        onClick={() =>
                          handleShowStudentCourse(course._id, course.fullName)
                        }
                      >
                        <Layers size={16} />
                      </Button.Ripple>
                    </div>
                    <div className="d-inline-block me-1">
                      <Button.Ripple
                        color="primary"
                        size="sm"
                        onClick={() => handleEdit(course?._id)}
                      >
                        <Edit size={16} />
                      </Button.Ripple>
                    </div>
                    <div className="d-inline-block me-1">
                      {course.isActive === true ? (
                        <Button.Ripple
                          color="danger"
                          size="sm"
                          onClick={() => handleDeactive(course._id)}
                        >
                          <UserX size={16} />
                        </Button.Ripple>
                      ) : (
                        <Button.Ripple
                          color="success"
                          size="sm"
                          onClick={() => handleActive(course._id)}
                        >
                          <UserCheck size={16} />
                        </Button.Ripple>
                      )}
                    </div>
                    <div className="d-inline-block me-1">
                      <Button.Ripple color="danger" size="sm">
                        <Trash
                          size={16}
                          onClick={() => handleDelete(course._id)}
                        />
                      </Button.Ripple>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <AddStudent
        open={addStudentOpen}
        toggleSidebar={toggleAddSidebar}
        setRefreshStudentInfo={setRefreshStudentInfo}
      />
      <StudentEdit
        open={editStudentOpen}
        toggleSidebar={toggleEditSidebar}
        studentId={studentsId}
        setRefreshStudentInfo={setRefreshStudentInfo}
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
          {courses?.map((course) => (
            <div
              key={course._id}
              className="employee-task d-flex justify-content-between align-items-center mb-2"
            >
              <div className="d-flex">
                <Avatar
                  imgClassName="rounded"
                  className="me-75"
                  img={course.lesson.image}
                  imgHeight="42"
                  imgWidth="42"
                />
                <div className="my-auto">
                  <h6 className="mb-0">{course.title}</h6>
                  <small className="text-muted">{course.cost} تومان</small>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <Button.Ripple
                  color="warning"
                  className="me-1"
                  size="sm"
                  disabled={
                    !course.students.find(
                      (student) => student._id === studentsId
                    )
                  }
                  onClick={() => handleRemoveStudentFromCourse(course._id)}
                >
                  <Minus size={16} />
                </Button.Ripple>
                <Button.Ripple
                  color="success"
                  size="sm"
                  disabled={course.students.find(
                    (student) => student._id === studentsId
                  )}
                  onClick={() => handleAddStudentToCourse(course._id)}
                >
                  <Plus size={16} />
                </Button.Ripple>
              </div>
            </div>
          ))}
        </ModalBody>
      </Modal>
      <Modal
        isOpen={modal}
        toggle={() => setShow(!modal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setModal(!modal)}>
          درس های دانشجو :
          {students.map((name) => name.fullName).find((m) => m === studentName)}
        </ModalHeader>
        <ModalBody>
          <Table responsive>
            <thead>
              <tr>
                <th>نام دوره</th>
                <th>ظرفیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {studentModal
                .filter((te) => te.students._id === studentsId)
                .map((course) => (
                  <tr key={course._id}>
                    <td>
                      <span className="align-middle fw-bold">
                        {course.title}
                      </span>
                    </td>
                    <td>{course.capacity}</td>
                    <td>
                      <div className="d-inline-block me-1 mb-1">
                        <Button.Ripple
                          color="danger"
                          size="sm"
                          onClick={() =>
                            handleDeleteStudentCourse(course._id, course.title)
                          }
                        >
                          <Trash size={16} />
                        </Button.Ripple>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </ModalBody>
      </Modal>
    </>
  ) : (
    <p>Loading...</p>
  );
};

export default StudentsList;
