import { useEffect, useState } from "react";
import Parser from "./molecules/Parser";
import { ToastContainer, toast } from "react-toastify";

function MainView() {
    // Defines the components text state.
    const [text, setText] = useState("");

    // Handle the component mounting and the window hash.
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            // Decode the hash.
            let decoded = "";
            try {
                decoded = atob(hash.slice(1));
            } catch {}

            // Set the text.
            setText(decoded);
        }
    }, []);

    // Return the textbox and the parsing result.
    return (
        <>
            <textarea
                className="border-2 border-gray-4 placeholder:text-black dark:placeholder:text-inherit dark:border-gray-2 p-2 w-full mt-2 dark:bg-black dark:text-white"
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                    window.location.hash = btoa(e.target.value);
                }}
                placeholder='Run "SELECT version()" on your database and paste the result here...'
            />
            <ToastContainer />
            {
                text && (
                    <button
                        className="font-title mb-2 text-code-blue-1 dark:text-code-blue-2 hover:underline"
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast("Link copied to clipboard!", {
                                type: "success",
                                theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
                            });
                        }}
                    >
                        Share Result
                    </button>
                )
            }
            <Parser text={text} />
        </>
    );
}

export default function App() {
    return (
        <div className="m-20">
            <h1 className="text-3xl font-bold font-title">
                Postgres Version Checker
            </h1>
            <h2 className="text-lg my-2 font-title">
                Check any security issues or missing features in your Postgres instance.{" "}
                <a href="https://neon.tech" className="hover:underline">Neon</a> allows you to easily be on the latest version of Postgres.
            </h2>
            <MainView />
        </div>
    );
}
