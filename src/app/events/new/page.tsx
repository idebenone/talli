"use client";

import React, { useTransition } from "react";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useAtomValue } from "jotai";

import { createEvent } from "../actions";
import { CreateEvent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { THEMES } from "@/utils/themes";
import { userAtom } from "@/utils/atoms";

import { ArrowLeft, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
  event_name: z
    .string()
    .min(1, "Let's give a nice title to your event.")
    .max(50),
  event_description: z.string().max(100),
  event_location: z.string(),
  event_target: z.date().optional(),
  event_theme: z.string(),
});

export default function CreateEventPage() {
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const [isPending, setTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_name: "",
      event_description: "",
      event_location: "",
      event_target: undefined,
      event_theme: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setTransition(async () => {
      try {
        const { event_target, ...restValues } = values;
        const processedValues: CreateEvent = {
          ...restValues,
          event_owner: user?.id!,
          event_target:
            event_target instanceof Date
              ? event_target.toISOString()
              : undefined,
        };
        await createEvent(processedValues);
        toast.success("Event has been created!");
        router.push("/events");
      } catch (error) {
        toast.error("Something went wrong. Please try again later!");
      }
    });
  }

  return (
    <div className="h-full flex justify-center">
      <div className="p-2 w-full lg:w-4/5 xl:w-1/2">
        <div className="py-6 md:py-12 flex gap-4 items-center">
          <Link href="/events">
            <ArrowLeft className="h-4 w-4 cursor-pointer" />
          </Link>
          <p className="text-xl font-semibold">New Event</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="event_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="event_location"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_theme"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>
                    Select a theme for your event
                  </FormDescription>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {THEMES.map((theme, _) => (
                        <SelectItem value={theme.value} key={theme.code}>
                          {theme.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_target"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormDescription>Wanna run a countdown?</FormDescription>
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <div className="flex items-center gap-3">
                    <p>In progress</p>
                    <Spinner color="" />
                  </div>
                ) : (
                  <p>Create</p>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
