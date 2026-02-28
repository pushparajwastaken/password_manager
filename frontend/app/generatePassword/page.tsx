"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import axios from "axios";
export default function App() {
  const [length, setLength] = useState(8);
  const [numberallowed, setNumberallowed] = useState(false);
  const [characters, setCharacters] = useState(false);
  const [password, setPassword] = useState();
  const passowordgenerator = useCallback(() => {
    let pass: any = "";
    let str = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    if (numberallowed) {
      str += "1234567890";
    }
    if (characters) {
      str += "!@#$%^&*()--{}[]:;<,>.?/";
    }
    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }
    setPassword(pass);
  }, [length, numberallowed, characters, setPassword]);
  useEffect(() => {
    passowordgenerator();
  }, [length, numberallowed, characters, , passowordgenerator]);
  const passwordref = useRef<HTMLInputElement>(null);
  const copypassword = () => {
    passwordref.current?.select();
    passwordref.current?.setSelectionRange(0, 15);
    window.navigator.clipboard.writeText(password!);
  };

  return (
    <div className="w-full max-w-md mx-auto shadow-lg px-4 py-3 my-8 text-black font-mono rounded-lg">
      <h1 className=" text-center my-2">Password Generator</h1>
      <div className="flex-shadow rounded-lg overflow-hidden mb-4 ">
        <Input
          type="text"
          value={password}
          className="outline-none w-full py-1 px-3"
          placeholder="Password"
          readOnly
          ref={passwordref}
        />
        <Button onClick={copypassword} className="w-full mt-4">
          Copy
        </Button>
      </div>
      <div className="flex text-sm gap-x-2">
        <div className="flex items-center gap-x-2">
          <Input
            type="range"
            min={6}
            max={20}
            value={length}
            className="cursor-pointer"
            onChange={(e) => {
              setLength(Number(e.target.value));
            }}
          />
          <label className=" ">Length:{length}</label>
        </div>
        <div className="flex items-center gap-x-1">
          <Input
            type="checkbox"
            defaultChecked={numberallowed}
            id="numberInput"
            onChange={() => {
              setNumberallowed((prev) => !prev);
            }}
          />
          <label className=" ">Numbers </label>
        </div>
        <div className="flex items-center gap-x-1">
          <Input
            type="checkbox"
            defaultChecked={characters}
            id="characInput"
            onChange={() => {
              setCharacters((prev) => !prev);
            }}
          />
          <label className=" ">Characters </label>
        </div>
      </div>
    </div>
  );
}
