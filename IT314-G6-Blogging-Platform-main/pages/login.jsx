import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { auth } from "../firebase/firebase";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import Image from "next/image";
import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/router";
import Loader from "./Components/loader";
require('dotenv').config();

const provider = new GoogleAuthProvider();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  // State for error message
  const { authUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push("/");
    }
  }, [authUser, isLoading]);

  const loginHandler = async () => {
    setError("");  // Reset error before trying to log in
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
    } catch (error) {
      setError("Invalid email or password. Please try again.");  // Set error message on failure
      console.error("An error occurred", error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const user = await signInWithPopup(auth, provider);
      console.log(user);
    } catch (error) {
      setError("An error occurred while signing in with Google.");
      console.error("An error occurred", error);
    }
  };

  return isLoading || (!isLoading && authUser) ? <Loader /> : (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-black to-black">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden flex max-w-4xl w-full">
        {/* Left side - image section */}
        <div className="hidden md:flex w-1/2 bg-black items-center justify-center relative">
          <Image
            src="/img.png"
            alt="Blogging site welcome image"
            layout="fill"
            objectFit="cover"
            className="opacity-60"
          />
          <div className="text-white p-8 absolute z-10">
            <h1 className="text-4xl font"><strong>Welcome to</strong> <br /> blogging site</h1>
            <p className="mt-4">Start sharing your thoughts with the world!</p>
          </div>
        </div>

        {/* Right side - form section */}
        <div className="flex-1 p-8">
          <h2 className="text-3xl font-semibold text-gray-700">Login</h2>

          <form onSubmit={(e) => e.preventDefault()} className="mt-6">
            <div className="mt-4">
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 p-2 border rounded-lg text-black bg-white"
                placeholder="Enter your Email"
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 p-2 border rounded-lg text-black bg-white"
                placeholder="Enter your password"
              />
            </div>

            {/* Display error message if exists */}
            {error && (
              <div className="mt-4 text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-6 w-full p-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-lg"
              onClick={loginHandler}
            >
              Log in
            </button>
          </form>

          <div className="flex items-center justify-between mt-6">
            <hr className="w-full border-gray-300" />
            <span className="mx-2 text-gray-500">Or</span>
            <hr className="w-full border-gray-300" />
          </div>

          <div
            className="bg-black/[0.05] text-white w-full py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90 flex justify-center items-center gap-4 cursor-pointer group"
            onClick={signInWithGoogle}>
            <FcGoogle size={18} />
            <span className="font-medium text-black group-hover:text-white">
              Login in with Google
            </span>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
