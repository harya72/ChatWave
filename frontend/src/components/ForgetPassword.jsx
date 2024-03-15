import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link,Navigate } from "react-router-dom";
import { Bars } from "react-loader-spinner";


function ForgetPassword() {
  const [email, setEmail] = useState("");
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      await axios.post("http://127.0.0.1:8000/api/auth/users/reset_password/", {
        email,
      });
      setLoading(false)
      alert("Password reset email sent successfully, Check your email");
    } catch (err) {
      alert("Failed to reset password");
    }
  };

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <div className="w-full bg-[#FF731D]  md:justify-center sm:justify-center h-screen flex">
      {loading ? (
        <>
          <Bars
            height="100"
            width="100"
            wrapperStyle={{ alignSelf: "center" }}
            color="#FFFF"
            ariaLabel="bars-loading"
            visible={true}
          />
        </>
      ) : (
        <>
          <div
            className="w-full lg:w-[50%] md:w-[70%] sm:w-[80%]  h-full     bg-center bg-contain bg-no-repeat items-center flex justify-center"
            style={{
              backgroundImage: "url('../assets/background1.jpg')",
            }}
          >
            <div className="w-[70%] h-[90%] flex justify-center items-center   rounded-[40px] bg-white bg-opacity-10 backdrop-blur-sm shadow-xl">
              <div className=" w-[80%] h-[90%] mt-20  ">
                <div className="">
                  <h1 className="text-3xl mb-5 text-white font-bold ">
                    Forget Password
                  </h1>
                </div>

                <div className="">
                  <form
                    onSubmit={handleForgetPassword}
                    className="flex flex-col gap-6"
                  >
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        className="rounded-md p-2 border-none focus:border-transparent focus:outline-none focus:ring-0 block px-2.5 pb-2.5 pt-4 w-full text-md text-gray-900  r border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500  focus:border-blue-600 peer"
                        placeholder=" "
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <label
                        htmlFor="email"
                        className="absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                      >
                        Email
                      </label>
                    </div>

                    <button
                      disabled={loading}
                      className="bg-[#FF731D] text-white rounded border border-white border-solid hover:bg-orange-700 p-2 mb-3 text-center"
                    >
                      Reset Password
                    </button>
                  </form>
                  <div className="  flex flex-col gap-4 ">
                    <span className="self-center text-white truncate">
                      <Link className="hover:text-gray-600" to="/">
                        Back to Login
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className=" hidden md:block w-1/2 h-full bg-center bg-contain bg-no-repeat"
            style={{ backgroundImage: "url('../assets/background1.jpg')" }}
          ></div>
        </>
      )}
    </div>
  );
}

export default ForgetPassword;
