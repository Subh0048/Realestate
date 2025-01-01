import { toast } from "react-toastify";
import { useEffect,useState } from "react";

const useAuthCheck = () => {
   const [isAuthenticated, setisAuthenticated ] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setisAuthenticated(true);
    } else {
      setisAuthenticated(false);
    }
  }, []);

  
  const validateLogin = () => {
    if (!isAuthenticated) {
      toast.error("you must be logged in", { position: "bottom-right" });
      return false;
    } else return true;
  };
  return {
    validateLogin,
  };
};

export default useAuthCheck;
