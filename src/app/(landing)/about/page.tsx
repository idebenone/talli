"use client";

import { IconMap } from "@/components/icon-map";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { aboutConfig, authors } from "@/config/about.config";

export default function AboutPage() {
  return (
    <div className="h-full">
      <div className="h-full flex justify-center items-center">
        <div className="flex flex-col gap-8 p-2">
          {aboutConfig.map((data) => (
            <div key={data.index} className="flex gap-2 md:gap-4 items-center">
              <p className="font-bold hidden md:block">{data.index}</p>
              <Separator className="w-2 md:w-4 hidden md:block" />
              <div>
                <p className="tracking-tight text-xl md:text-3xl font-semibold bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-transparent bg-clip-text">
                  {data.title}
                </p>
                <p className="text-xs font-medium text-muted-foreground max-w-80 md:w-80 mt-2">
                  {data.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-full flex flex-col gap-12 justify-center items-center">
        <p className="text-xl text-muted-foreground">Jokers behind this</p>
        <div className="flex flex-col md:flex-row gap-2">
          {authors.map((author, index) => (
            <div key={index} className="border border-muted p-2">
              <div className="flex gap-2 items-center">
                <img src={author.pfp} alt={author.name} className="h-10 w-10" />

                <div>
                  <p>{author.name}</p>
                  <p className="text-muted-foreground italic text-xs">
                    {author.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {Object.keys(author.socials).map(
                  (key: string, index: number) => {
                    const url =
                      author.socials[key as keyof typeof author.socials];

                    return (
                      <Button key={key} variant="outline">
                        <a href={url} target="_blank">
                          {IconMap[key as keyof typeof IconMap]}
                          <span className="sr-only">{`${key} - ${url}`}</span>
                        </a>
                      </Button>
                    );
                  }
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
