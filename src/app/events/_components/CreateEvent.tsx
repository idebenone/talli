"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAtomValue } from "jotai";
import { userAtom } from "@/components/UserProfile";
import { createEvent } from "../actions";

interface CreateEventProps {
  setCreateEventState: (state: boolean) => void;
}

const formSchema = z.object({
  event_name: z.string().max(50),
  event_description: z.string().max(100),
  event_location: z.string(),
  event_type: z.string(),
});

const CreateEvent: React.FC<CreateEventProps> = ({ setCreateEventState }) => {
  const user = useAtomValue(userAtom);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_name: "",
      event_description: "",
      event_location: "",
      event_type: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createEvent({ event_owner: user?.id, ...values });
      toast.success("Event has been created!");
      setCreateEventState(false);
    } catch (error) {
      toast.error("Something went wrong. Please try again later!");
    }
  }

  return (
    <>
      <div className="py-6 md:py-12 flex gap-4 items-center">
        <ArrowLeft
          className="h-4 w-4 cursor-pointer"
          onClick={() => setCreateEventState(false)}
        />
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
            name="event_type"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="invite">Invite only</SelectItem>
                  </SelectContent>
                </Select>
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

          <div className="flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default CreateEvent;
