import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourse } from "./slice";
import { AppDispatch, RootState } from "../../../store";
import CourseCard from "./course";

export default function HomePage() {
  const dispatch: AppDispatch = useDispatch();
  const { data, isLoading, error } = useSelector(
    (state: RootState) => state.courseReducer
  );

  useEffect(() => {
    dispatch(fetchCourse()); // ✅ Đúng, phải gọi hàm
  }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <div>Error</div>;
  if (!data || data.length === 0) return <div>No data</div>;

  return (
    <div className="container mx-auto">
      <h1>List Course</h1>
      <div className="grid grid-cols-4 gap-4">
        {data.map((course) => (
          <CourseCard course={course} key={course.maKhoaHoc} />
        ))}
      </div>
    </div>
  );
}
