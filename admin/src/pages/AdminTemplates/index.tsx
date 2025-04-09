import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Header from "./_Component/Header";
import Sidebar from "./_Component/Sidebar";

export default function AdminPage() {
  const { data } = useSelector((state: RootState) => state.authReducer);
  if (!data) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />
        <div className="flex-1 overflow-auto p-6 bg-gray-100">
          <div className="h-full overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
