import React, { useEffect, useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Bars } from "react-loader-spinner";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const [loading, setLoading] = useState(false);
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
        alert("Failed to send token to the server:", error.error_description)
        setLoading(false)
      }
    },
    onError: (error) => console.log("Login Failed:", error.error_description),
  });

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
              <div className=" w-[80%]  ">
                <div className="">
                  <h1 className="text-3xl mb-5 text-white font-bold ">Login</h1>
                </div>

                <div className="">
                  <form action="" className="flex flex-col gap-6">
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        className="rounded-md p-2 border-none focus:border-transparent focus:outline-none focus:ring-0 block px-2.5 pb-2.5 pt-4 w-full text-md text-gray-900  r border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500  focus:border-blue-600 peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="email"
                        className="absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                      >
                        Email
                      </label>
                    </div>
                    <div className="relative">
                      <input
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

                    <span className="mt-8">
                      <a href="#" className="hover:text-gray-600 text-white">
                        Forget password?
                      </a>
                    </span>
                    <Link
                      to="/dashboard"
                      className="bg-[#FF731D] text-white rounded border border-white border-solid hover:bg-orange-700 p-2 mb-3 text-center"
                    >
                      <button>Sign in</button>
                    </Link>
                  </form>
                  <div className="  flex flex-col gap-4 ">
                    <div className="text-center text-white">
                      or continue with
                    </div>
                    <div className="flex justify-evenly">
                      <button>
                        <div className="rounded-full bg-white w-8 h-8 flex justify-center ">
                          <img
                            onClick={signin}
                            src="../assets/google.svg"
                            alt="google"
                          />
                        </div>
                      </button>
                      <button>
                        <div className="rounded-full bg-white w-8 h-8  flex justify-center">
                          <img src="../assets/github.svg" alt="github" />
                        </div>
                      </button>
                      <button>
                        <div className="rounded-full bg-white w-8 h-8 flex justify-center">
                          <img src="../assets/meta.svg" alt="meta" />
                        </div>
                      </button>
                    </div>
                    <span className="self-center text-white truncate">
                      Don't have an account?{" "}
                      <Link className="hover:text-gray-600" to="/signup">
                        Register here
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

export default Login;
