import { useEffect, useState } from "react";
import Parser from "./molecules/Parser";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";
import Panel from "./atoms/Panel";

class DataQuery {
    url: URL | null;

    constructor() {
        if (typeof window === "undefined") {
            this.url = null;
            return;
        }
        this.url = new URL(window.location.href);
    }

    get data() {
        return this.url?.searchParams.get("data") || "";
    }

    set data(data: string | null) {
        if (!this.url) {
            return;
        }
        if (data) {
            this.url.searchParams.set("data", data);
        } else {
            this.url.searchParams.delete("data");
        }
        window.history.replaceState({}, "", this.url.toString());
    }
}

const query = new DataQuery();

function MainView() {
    // Defines the components text state.
    const [text, setText] = useState("");
    const { toast } = useToast();

    // Handle the component mounting and the window hash.
    useEffect(() => {
        if (query.data) {
            // Decode the hash.
            let decoded = "";
            try {
                decoded = atob(query.data);
            } catch {}

            // Set the text.
            setText(decoded);
        }
    }, []);

    // Return the textbox and the parsing result.
    return (
        <div
            className={`flex ${
                !text ? "items-center justify-center min-h-screen" : ""
            }`}
        >
            <div
                className={`${
                    !text ? "max-w-md" : "max-w-7xl"
                } relative mx-auto flex w-full flex-col space-y-6 justify-center`}
            >
                {text && (
                    <Button
                        className="absolute top-[196px] right-0"
                        variant="default"
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast({
                                description: "Link copied to clipboard!",
                            });
                        }}
                    >
                        Share Report
                    </Button>
                )}

                {!text ? (
                    <>
                        <div className="flex flex-col gap-2 text-center">
                            <h1 className="text-4xl font-extrabold font-title tracking-tight">
                                PG Version Report
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Plug in your Postgres version to see what you're
                                missing out on.
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-4 font-mono text-lg">
                            <span className="opacity-50">postgres =&gt;</span>
                            <div className="inline-block border border-zinc-400/25 bg-zinc-300/25 px-8 py-2 rounded-xl">
                                SELECT version();
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col gap-2 text-left">
                        <span className="text-2xl text-muted-foreground font-extrabold font-title tracking-tight">
                            PG Version Report
                        </span>
                    </div>
                )}
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <div className="flex items-center gap-2">
                                <Label
                                    htmlFor="name"
                                    className={`${text && "text-muted-foreground"}`}
                                >
                                    Postgres Version String
                                </Label>
                                <Popover>
                                    <PopoverTrigger>
                                        <div className="hover:bg-zinc-500/10 p-0.5 rounded">
                                            <Info
                                                size={16}
                                                className="opacity-50"
                                            />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <p className="text-sm">
                                            Run <code>SELECT version();</code>{" "}
                                            in your PostgreSQL database to get
                                            the version string.
                                        </p>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <Input
                                className={`${text && "text-muted-foreground"} max-w-3xl`}
                                value={text}
                                onChange={(e) => {
                                    setText(e.target.value);
                                    query.data = btoa(e.target.value);
                                }}
                                id="name"
                                placeholder="PostgreSQL 99.9 on x86_64-pc-linux-gnu, compiled by gcc (GCC) 13.3.1 20240522 (Red Hat 13.3.1-1), 64-bit"
                            />
                        </div>
                        {!text && (
                            <div className="flex items-center gap-2 text-sm justify-center">
                                <span className="opacity-50">Examples:</span>
                                <Button
                                    variant="outline"
                                    size="badge"
                                    onClick={() => {
                                        const version =
                                            "PostgreSQL 16.1 on aarch64-unknown-linux-gnu, compiled by aarch64-unknown-linux-gnu-gcc (GCC) 9.5.0, 64-bit";
                                        setText(version);
                                    }}
                                >
                                    PG16 on RDS
                                </Button>
                                <Button
                                    size="badge"
                                    variant="outline"
                                    onClick={() => {
                                        const version =
                                            "PostgreSQL 16.1 on aarch64-unknown-linux-gnu, compiled by aarch64-unknown-linux-gnu-gcc (GCC) 9.5.0, 64-bit";
                                        setText(version);
                                    }}
                                >
                                    RDS Aurora PG16
                                </Button>
                                <Button
                                    size="badge"
                                    variant="outline"
                                    onClick={() => {
                                        const version =
                                            "PostgreSQL 16.4 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit";
                                        setText(version);
                                    }}
                                >
                                    PG16 on Neon
                                </Button>
                            </div>
                        )}
                    </div>
                </form>
                <Parser text={text} />
                <Panel
                    title={`How to Upgrade`}
                    description={`Resources for upgrading your PostgreSQL version.`}
                    size="secondary"
                >
                    <div className="prose" id="how-to-upgrade">
                        <p>To upgrade your version of Postgres...</p>
                    </div>
                </Panel>
                <hr />
                <p className="text-center text-sm text-muted-foreground pb-12">
                    Made with ❤️ by <a href="https://neon.tech">Neon</a>
                </p>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <div className="container">
            <MainView />
            <Toaster />
        </div>
    );
}
