import { useDispatch } from "react-redux";
import { logoutUser } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { clearAccessToken } from "../slices/auth.slice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      dispatch(clearAccessToken());
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <div>Dashboard</div>

      <button onClick={handleLogout}>Logout</button>
    </>
  );
};

export default Dashboard;
