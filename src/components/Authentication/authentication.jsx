import { CircularProgress, Box } from "@mui/material";
import { useState, createContext, useContext, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { UserFetch } from "~/REST_API_Client";
import { AuthenFetch } from "~/REST_API_Client";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // console.log("loading: ", loading)
    console.log("re-renderauth:")
    useEffect(() => {
        if (user === null) {
            setLoading(true);
            AuthenFetch.checkToken()
                .then(data => {
                    // console.log(data);
                    const userId = data.data.id;
                    UserFetch.getById(userId)
                        .then(userInfo => {
                            // console.log(userInfo.data)
                            setUser(userInfo.data)
                            setLoading(false)
                        });
                })
                .catch(err => {
                    console.log("Loi authen component: ", err)
                    setUser(null);
                    setLoading(false);
                    toast.warning("Bạn cần đăng nhập để tiếp tục")
                    // navigate("/dang-nhap")
                })
               
        }
    }, [])
    const authenUser = user => {
        setUser(user)
    }
    const clearAuthenUser = () => {
        setUser(null)
    }
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
                <ToastContainer/>
            </Box>
        )
    }
    return (
        <AuthContext.Provider value={{ user, authenUser, clearAuthenUser }}>
           {children}
        </AuthContext.Provider>
    )


}

export const useAuth = () => {
    return useContext(AuthContext)
}