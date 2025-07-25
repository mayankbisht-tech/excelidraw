import React, { useRef, useState, type RefObject } from "react";
import { useNavigate } from "react-router-dom";

interface SignupProps {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Signup({ setToken }: SignupProps) {
  const firstNameRef = useRef<HTMLInputElement>(null); 
  const lastNameRef = useRef<HTMLInputElement>(null); 
  const emailRef = useRef<HTMLInputElement>(null); 
  const passwordRef = useRef<HTMLInputElement>(null); 
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);  

  const keyHandleDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    nextRef?: RefObject<HTMLInputElement | null>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef?.current?.focus();
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(null); 
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: firstNameRef.current?.value, 
          lastname: lastNameRef.current?.value,   
          email: emailRef.current?.value,         
          password: passwordRef.current?.value,   
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        navigate("/room");
      } else {
        setErrorMessage(data.error || "Signup failed. Please try again."); 
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrorMessage("Could not connect to the server. Please check your connection.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-zinc-900 to-stone-950 font-inter">
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 right-4 bg-zinc-800 hover:bg-zinc-900 text-white text-sm px-4 py-2 rounded-md transition-colors duration-200"
      >
        Home
      </button>

      <div className="w-full max-w-md p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl">
        <div className="flex flex-col items-center space-y-6"> 
          <p className="font-bold text-3xl text-white mb-4">Sign Up</p> 

          {errorMessage && (
            <div className="w-full p-3 bg-red-900 text-red-100 rounded-md text-center text-sm">
              {errorMessage}
            </div>
          )}

          <input
            type="text"
            ref={firstNameRef} 
            placeholder="First Name"
            className="w-full px-5 py-3 rounded-lg bg-zinc-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 border border-zinc-700 transition-colors duration-200"
            onKeyDown={(e) => keyHandleDown(e, lastNameRef)} 
          />
          <input
            type="text"
            ref={lastNameRef} 
            placeholder="Last Name"
            className="w-full px-5 py-3 rounded-lg bg-zinc-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 border border-zinc-700 transition-colors duration-200"
            onKeyDown={(e) => keyHandleDown(e, emailRef)} 
          />
          <input
            type="text"
            ref={emailRef} 
            placeholder="Email"
            className="w-full px-5 py-3 rounded-lg bg-zinc-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 border border-zinc-700 transition-colors duration-200"
            onKeyDown={(e) => keyHandleDown(e, passwordRef)} 
          />
          <input
            type="password"
            ref={passwordRef} 
            placeholder="Password"
            className="w-full px-5 py-3 rounded-lg bg-zinc-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 border border-zinc-700 transition-colors duration-200"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button
            className="w-full bg-gray-800 hover:bg-black transition-all duration-300 py-3 rounded-lg font-semibold text-white shadow-lg"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
