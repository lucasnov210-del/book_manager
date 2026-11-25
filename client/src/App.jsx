import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Loans from "./pages/Loans";
import Books from "./pages/Books";
import Home from "./pages/Home";
import Dashboard from "./pages/AdminDashboard";
import BookDetails from "./pages/BookDetails";
import MyLoans from "./pages/MyLoans";
import { useState } from "react";

function App() {

  const [user, setUser] =useState(() => {
    return JSON.parse(localStorage.getItem("user") || "null");
  });
  
  const getDashboardPath = (role) => {
    switch(role){
      case "admin":
        return "/admin";

      case "librarian":
        return "/librarian";

      default:
        return "/login";
    }
  };

  return(
    <BrowserRouter>
      <Routes>
        <Route 
          path="/"
          element={<Home/>}
        />

        <Route  
          path="/login"
          element = {
            user 
              ?(
                <Navigate to={getDashboardPath(user.role)} replace />
              )
              :(
                <Login onLogin={(userData) => {
                  localStorage.setItem("user", JSON.stringify(userData));
                  setUser(userData)}} 
                />
              )
          }
        />

        <Route 
          path="/register"
          element={<Register />}
        />
        
          <Route
            path="/admin"
            element= {
              user?.role === "admin" ?
                <Dashboard />
                : <Navigate to="/login" replace />
            }
          />
        <Route
          path="/books"
          element= {
            user ? 
                  <Books/>
              : <Navigate to="/login" replace />
          } 
        />

        <Route 
          path="/books/:id"
          element= {
            user ? 
                <BookDetails/>
            : <Navigate to="/login" replace/>
            
          }
        />

        <Route 
          path="/loans"
          element= {
            user ?
                    <Loans/>
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/my-loans"
          element= {
          user ? (
                <MyLoans/>
          ):(
            <Navigate to="/login" replace/>
          )
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
