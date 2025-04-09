import { Course } from "../../../models"
type CourseProps = {
  course?: Course;
}
export default function CourseCard(props: CourseProps) {
  const {course} = props;
  return (
    <div>
      <h3>{course?.tenKhoaHoc}</h3>
      <img src={course?.hinhAnh} width={400} height={400} style={{borderRadius:10, objectFit:'cover'}} alt="" />
      <p>{course?.mota}</p>
    </div>
  )
}
