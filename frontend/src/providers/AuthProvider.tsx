import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { setAccessToken, setInitialized } from "../slices/auth.slice";

interface Props {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await api.post("/auth/refresh");
        dispatch(setAccessToken(res.data.data.accessToken));
      } catch (error) {
      } finally {
        dispatch(setInitialized());
      }
    };

    initializeAuth();
  }, []);

  return children;
};

export default AuthProvider;
