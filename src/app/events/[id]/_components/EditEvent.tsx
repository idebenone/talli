"use client";

import React, { useEffect, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useAtomValue } from "jotai";

import { updateEvent } from "../../actions";

import { cn } from "@/lib/utils";
import { Event } from "@/lib/types";
import { THEMES } from "@/utils/themes";
import { userAtom } from "@/utils/atoms";

import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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
  event_name: z.string().max(50),
  event_description: z.string().max(100),
  event_location: z.string(),
  event_target: z.date(),
  event_theme: z.string(),
});

interface EditEventProps {
  event: Event;
  setEditEvent: () => void;
}

const EditEvent: React.FC<EditEventProps> = ({ event, setEditEvent }) => {
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
        await updateEvent({
          event_id: event.event_id,
          event_owner: user?.id!,
          ...values,
          event_target: values.event_target.toISOString(),
          created_at: event.created_at,
          modified_at: new Date().toISOString(),
        });

        toast.success("Event has been updated!");
        setEditEvent();
      } catch (error) {
        toast.error("Something went wrong. Please try again later!");
      }
    });
  }

  useEffect(() => {
    if (event) {
      form.setValue("event_name", event.event_name);
      form.setValue("event_description", event.event_description);
      form.setValue("event_location", event.event_location);
      form.setValue("event_target", new Date(event.event_target));
      form.setValue("event_theme", event.event_theme);
    }
  }, [event]);

  return (
    <div className="md:px-4 xl:px-8">
      <p className="mb-4">Edit</p>
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
            name="event_target"
            render={({ field }) => (
              <FormItem className="flex flex-col">
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

          <FormField
            control={form.control}
            name="event_theme"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={event.event_theme}
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

          <div className="flex gap-2 justify-end">
            <Button
              type="submit"
              variant="outline"
              onClick={setEditEvent}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <div className="flex items-center gap-3">
                  <p>In progress</p>
                  <Spinner />
                </div>
              ) : (
                <p>Update</p>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditEvent;
