// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   const handleLogin = () => {
//     if (password === "admin123") {
//       document.cookie = "adminToken=secret123; path=/"; 
//       router.push("/admin/page");
//     } else {
//       alert("Wrong password!");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h2 className="text-2xl mb-4">Admin Login</h2>
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Enter Admin Password"
//         className="border p-2 mb-2"
//       />
//       <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2">
//         Login
//       </button>
//     </div>
//   );
// }





"use client";

import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import React from "react";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {/*
          'SignedIn' aur 'SignedOut' components se aap user ke login status ke hisab se content show kar sakte hain.
        */}
      <SignedIn>
  <div className="text-center">
    <h1 className="text-3xl font-bold mb-4">You are already signed in!</h1>
    <a
      href="/admin"
      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      Go to Dashboard
    </a>
  </div>
</SignedIn>


        <SignedOut>
          {/*
            Clerk ka built-in 'SignIn' component ek poora login UI provide karta hai.
            Yeh email/password, social logins (Google, Apple, etc.) aur forgot password features khud handle karta hai.
            Isme "or" separator aur form bhi shamil hain.
          */}
          <SignIn routing="hash" />
        </SignedOut>
        
      </div>
    </div>
  );
};

export default Login;