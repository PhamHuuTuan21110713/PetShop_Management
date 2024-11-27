import { CircularProgress, Box } from "@mui/material";
import { useState, createContext, useContext, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { UserFetch } from "~/REST_API_Client";
import { AuthenFetch } from "~/REST_API_Client";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const page = useRef(1);
    console.log("re-renderauth:")
    useEffect(() => {
        if (user === null) {
            AuthenFetch.checkToken()
                .then(data => {
                    // console.log(data);
                    const userId = data.data.id;
                    UserFetch.getById(userId)
                        .then(userInfo => {
                            // console.log(userInfo.data)
                            setUser(userInfo.data)
                        });
                })
                .catch(err => {
                    setUser(null);
                    page.current = 2
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
    if (user === null && page.current === 1) {
        return (
            <Box sx={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                <CircularProgress />
            </Box>
        )
    }
    if(user === null && page.current === 2) {
        return(
            <Navigate to="/dang-nhap"/>
        )
    }
    if(user) {
        return (
            <AuthContext.Provider value={{ user, authenUser, clearAuthenUser }}>
                {children}
            </AuthContext.Provider>
        )
    }
   
}

export const useAuth = () => {
    return useContext(AuthContext)
}