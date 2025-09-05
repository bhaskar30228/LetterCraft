import React from 'react'
import { useEffect } from 'react'
import { Children } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
const AuthContext = createContext()
export function AuthProvider({children}){
     const [open, setOpen] = useState(false);
    const token=localStorage.getItem("token")
    const [isLoggedIn, setIsLoggedIn]=useState(token? true : false);
     useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
    return(
        <AuthContext.Provider value={{token,isLoggedIn,setIsLoggedIn,open,setOpen}}>
            {children}
        </AuthContext.Provider>
    )
}
  

export default AuthContext
