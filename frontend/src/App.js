//imports

import React from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { TransactionsProvider } from "./components/Context/Context";
import { Menu } from "antd";
import "antd/dist/reset.css";
import {
  DashboardOutlined,
  UnorderedListOutlined,
  BankOutlined,
  CalculatorTwoTone,
  
} from "@ant-design/icons/lib/icons";
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from '../src/components/Charts/BarChart';
import Signup from "./components/Singup";
import Login from "./components/Login";
import Income from "../src/components/Income/Income";
import Expense from "../src/components/Expense/Expense";
import Budget from "./components/Budget/Budget";
import Currency from "./components/Currency/Currency";


function ProtectedLayout({element}) {
	return (

	  <div style={{ display: "flex", flexDirection: "column", flex: 1, height:'100vh' }}>
		<Header />
		<div style={{ display: "flex", flexDirection: "row", flex: 1 }}>
		  <SideMenu />
		  <div style={{ flex: 1 }}>
			  {element}
		  </div>
		</div>
		<Footer />
	  </div>
	);
  }
  

function Header() {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();   
	};

  return (
    <div
        style={{
            height: 60,
            backgroundColor: "#2C3E50",
            color: "white",
            display: "flex",
            justifyContent: "space-between", // changed 'right' to 'flex-end'
            alignItems: "center", // to vertically center the button card
            padding: 40,
            
        }}
    >
         <h2>FINANCE WALLET</h2>
            <button className="btn btn-dark" onClick={handleLogout}>
                Logout
            </button>
        </div>

);
}

function Footer() {
  return (
    <div
      style={{
        height: 60,
        backgroundColor: "#2C3E50",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      
    </div>
  );
}

function SideMenu() {
  const navigate = useNavigate();
  return (
    <div>
      {/* So the sidebar appears horizontally at left, and the content appears beside it.*/}
      <Menu
        onClick={({ key }) => {
          if (key === "signout") {
          } else {
            navigate(key); // key will have navigate path
          }
        }}
        defaultSelectedKeys={[window.location.pathname]}
        items={[
        
          {
            label: "DASHBOARD",
            key: "/dashboard",
            icon: <DashboardOutlined />,
          },
          {
            label: "TRANSACTION",
            key: "/income",
            icon: <UnorderedListOutlined />,
          },
          {
            label: "BUDGET",
            key: "/budget",
            icon: <BankOutlined />,
            
          },
          {
            label: "CONVERTER",
            key: "/Currency",
            icon: <CalculatorTwoTone />,
          }, 
        ]}
      ></Menu>
    </div>
  );
}


function App() {
    const token = localStorage.getItem('token');

    return (
      <TransactionsProvider>
        <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            {token ? (
                <>
                    <Route path="/" element={<ProtectedLayout element={<Dashboard />} />} />
                    <Route path="/dashboard" element={<ProtectedLayout element={<Dashboard />} />} />
					<Route path="/income" element={<ProtectedLayout element={<Income />} />} />
			  {/*	<Route path="/expense" element={<ProtectedLayout element={<Expense />} />} /> */}
          <Route path="/budget" element={<ProtectedLayout element={<Budget />} />} />
          <Route path="/Currency" element={<ProtectedLayout element={<Currency />} />} />

           
                </>
            ) : (
                <Route path="/*" element={<Navigate to="/login" />} />
            )}
        </Routes>
        </TransactionsProvider>
    );
}


  

export default App;
