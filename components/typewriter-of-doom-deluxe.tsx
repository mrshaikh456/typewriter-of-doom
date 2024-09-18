"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Ghost, Zap, Skull, Coffee } from "lucide-react";

const scrambleText = (text: string) => {
  return text
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

const randomWords = [
  "potato",
  "elephant",
  "sunshine",
  "catastrophe",
  "whimsical",
  "serendipity",
  "shenanigans",
  "kerfuffle",
  "flabbergasted",
  "discombobulated",
  "pandemonium",
  "gobbledygook",
  "bamboozle",
  "skedaddle",
  "lollygag",
  "tomfoolery",
  "nincompoop",
  "hullabaloo",
  "mumbo-jumbo",
  "hootenanny"
];


const funnyReplacements = {
  the: "da",
  and: "n",
  to: "2",
  you: "u",
  for: "4",
  is: "iz",
  are: "r",
  hello: "yo",
  goodbye: "cya",
  thanks: "thx",
  please: "plz",
  awesome: "awesomesauce",
  great: "gr8",
  really: "rly",
  later: "l8r",
  because: "cuz",
  cool: "kewl",
  before: "b4",
  night: "nite",
  laugh: "lol",
  love: "luv",
  easy: "ez",
  everyone: "every1",
  sorry: "sry",
  see: "c",
  friend: "frnd",
  people: "ppl"
};


export function TypewriterOfDoomDeluxeComponent() {
  const [text, setText] = useState("");
  const [isScrambled, setIsScrambled] = useState(false);
  const [chaosFactor, setChaosFactor] = useState(50);
  const [ghostPosition, setGhostPosition] = useState({ x: 0, y: 0 });
  const [coffeeSpills, setCoffeeSpills] = useState<{ x: number; y: number }[]>(
    []
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const annoySomeone = useCallback(() => {
    if (Math.random() * 100 > chaosFactor) return;

    const actions = [
      () => setText((prev) => prev.slice(0, -1)), // Delete last character
      () => setText((prev) => prev.slice(1)), // Delete first character
      () => setIsScrambled(true), // Scramble text
      () =>
        setText(
          (prev) =>
            prev + randomWords[Math.floor(Math.random() * randomWords.length)]
        ), // Add random word
      () =>
        setText((prev) =>
          prev
            .split(" ")
            .map(
              (word) =>
                funnyReplacements[
                  word.toLowerCase() as keyof typeof funnyReplacements
                ] || word
            )
            .join(" ")
        ), // Replace with funny words
      () => setText((prev) => prev.split("").reverse().join("")), // Reverse text
      () => setText((prev) => prev.toUpperCase()), // ALL CAPS
      () => setText((prev) => prev.toLowerCase()), // all lowercase
      () => setText((prev) => `🎉${prev}🎉`), // Add party emojis
    ];

    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    randomAction();

    setTimeout(() => setIsScrambled(false), 1000); // Unscramble after 1 second
  }, [chaosFactor]);

  useEffect(() => {
    const interval = setInterval(annoySomeone, 2000); // Annoy every 2 seconds
    return () => clearInterval(interval);
  }, [annoySomeone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleReset = () => {
    setText("");
    setCoffeeSpills([]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setGhostPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleCoffeeSpill = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newSpill = {
        x: Math.random() * (rect.width - 32), // Subtract spill width to keep within bounds
        y: Math.random() * (rect.height - 32), // Subtract spill height to keep within bounds
      };
      setCoffeeSpills((prev) => [...prev, newSpill]);
    }
  };

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center p-4"
        onMouseMove={handleMouseMove}
        ref={containerRef}
      >
        <Card className="w-full max-w-md p-6 space-y-4 relative overflow-hidden">
          <h1 className="text-2xl font-bold text-center">
            Typewriter of Doom Deluxe
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Try to type something... if you dare! 😈
          </p>
          <Input
            type="text"
            value={isScrambled ? scrambleText(text) : text}
            onChange={handleChange}
            placeholder="Start typing here..."
            className="w-full"
            aria-label="Typewriter input"
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Characters: {text.length}</p>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Chaos Factor: {chaosFactor}%</p>
            <Slider
              value={[chaosFactor]}
              onValueChange={(value) => setChaosFactor(value[0])}
              max={100}
              step={1}
            />
          </div>
          <Button
            onClick={handleCoffeeSpill}
            variant="outline"
            className="w-full"
          >
            <Coffee className="mr-2 h-4 w-4" /> Spill Coffee
          </Button>
          <p className="text-xs text-gray-400 text-center">
            Warning: Your text will be randomly modified every 2 seconds!
          </p>
          <Ghost
            className="absolute text-white opacity-50 transition-all duration-300 pointer-events-none"
            style={{
              left: `${ghostPosition.x}px`,
              top: `${ghostPosition.y}px`,
            }}
          />
          {coffeeSpills.map((spill, index) => (
            <div
              key={index}
              className="absolute w-8 h-8 bg-amber-800 rounded-full opacity-50"
              style={{ left: `${spill.x}px`, top: `${spill.y}px` }}
            />
          ))}
          <Zap className="absolute top-2 right-2 text-yellow-400 animate-pulse" />
          <Skull className="absolute bottom-2 left-2 text-gray-600 animate-bounce" />
        </Card>
      </div>
    </>
  );
}
