import React from "react";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import { Bars } from "react-loader-spinner";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const signin = useGoogleLogin({
    onSuccess: async (response) => {
      console.log("success: ", response.access_token);

      const userPayload = {
        grant_type: "convert_token",
        client_id: "xSHDkPC5UXtCm4L3dvonchLKrn5MOPSquJFrklss",
        client_secret:
          "6lQgJfta5iSN1dNKTh5YxCY351q7E32sYPvhE4h8nCIw0jKPWyxk1tJOZAfRE5CIgDaqiS2RQy45okGGzH449s5PL8sfn4FJ9p2ZnUVLDQfkOlx4FBnEt5DfJifbe3ih",
        backend: "google-oauth2",
        token: response.access_token,
      };

      try {
        setLoading(true);
        const { data } = await axios.post(
          "http://localhost:8000/api-auth/convert-token/",
          userPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data["access_token"]}`;
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        login();

        // Navigate to dashboard page after successful authentication
        navigate("/dashboard");
      } catch (error) {
        alert("Failed to send token to the server:", error.error_description);
        setLoading(false);
      }
    },
    onError: (error) => console.log("Login Failed:", error.error_description),
  });
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <div className="w-screen bg-[#FF731D] h-screen md:justify-center sm:justify-center  flex">
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
            className="w-full lg:w-1/2  h-full    bg-center bg-contain bg-no-repeat items-center flex justify-center"
            style={{
              backgroundImage: "url('../assets/background1.jpg')",
            }}
          >
            <div className="w-[70%] h-[95%]  flex justify-center items-center  rounded-[40px] bg-white bg-opacity-10 backdrop-blur-sm shadow-xl">
              <div className=" w-[80%] ">
                <div className="">
                  <h1 className="text-3xl mb-5 text-white font-bold ">
                    Sign Up
                  </h1>
                </div>

                <div className="">
                  <form action="" className="flex flex-col gap-6">
                    <div className="relative">
                      <input
                        type="text"
                        id="first_name"
                        className="rounded-md p-2 border-none focus:border-transparent focus:outline-none focus:ring-0 block px-2.5 pb-2.5 pt-4 w-full text-md text-gray-900  r border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500  focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label
                        htmlFor="first_name"
                        className="absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                      >
                        First Name
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        id="last_name"
                        className="rounded-md p-2 border-none focus:border-transparent focus:outline-none focus:ring-0 block px-2.5 pb-2.5 pt-4 w-full text-md text-gray-900  r border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500  focus:border-blue-600 peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="last_name"
                        className="absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                      >
                        Last Name
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        id="username"
                        className="rounded-md p-2 border-none focus:border-transparent focus:outline-none focus:ring-0 block px-2.5 pb-2.5 pt-4 w-full text-md text-gray-900  r border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500  focus:border-blue-600 peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="username"
                        className="absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                      >
                        Username
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        required
                        type="password"
                        id="password"
                        className="rounded-md p-2 border-none focus:border-transparent focus:outline-none focus:ring-0 block px-2.5 pb-2.5 pt-4 w-full text-md text-gray-900  r border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500  focus:border-blue-600 peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="password"
                        className="absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                      >
                        Password
                      </label>
                    </div>

                    <button className="bg-[#FF731D] text-white rounded border border-white border-solid hover:bg-orange-700 p-2 mb-3">
                      Sign Up
                    </button>
                  </form>
                  <div className="  flex flex-col gap-4 ">
                    <div className="text-center text-white">
                      or create account with
                    </div>
                    <div className="flex  bg-white rounded-md p-2 px-5">
                      <div className="rounded-full bg-white w-8 h-8 flex justify-center ">
                        <img src="../assets/google.svg" alt="google" />
                      </div>
                      <div className="flex-1 flex items-center justify-center text-md font-semibold ">
                        <button
                          onClick={signin}
                          // disabled={loading}
                          className="hover:text-gray-400"
                        >
                          Sign Up with Google
                        </button>
                      </div>

                      {/* <button>
                    <div className="rounded-full bg-white w-8 h-8  flex justify-center">
                      <img src="../assets/github.svg" alt="github" />
                    </div>
                  </button> */}
                      {/* <button>
                    <div className="rounded-full bg-white w-8 h-8 flex justify-center">
                      <img src="../assets/meta.svg" alt="meta" />
                    </div>
                  </button> */}
                    </div>
                    <span className="self-center text-white truncate">
                      Already have an account?{" "}
                      <Link className="hover:text-gray-600" to="/">
                        Login here
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
};

export default Signup;
