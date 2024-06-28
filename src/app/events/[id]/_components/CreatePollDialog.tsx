import { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAtomValue } from "jotai";
import { userAtom } from "@/components/UserProfile";
import { createPoll } from "../../actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { PlusCircle, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";

interface CreatePollDialogProps {
  event_id: string;
  dialogState: boolean;
  setDialogState: () => void;
}

const pollChoiceSchema = z.object({
  poll_choice_content: z.string().min(1, "Option content is required"),
});

const formSchema = z.object({
  poll_title: z.string(),
  poll_choices: z
    .array(pollChoiceSchema)
    .min(2, "At least two choices are required"),
});

const CreatePollDialog: React.FC<CreatePollDialogProps> = ({
  event_id,
  dialogState,
  setDialogState,
}) => {
  const user = useAtomValue(userAtom);
  const [isPending, setTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      poll_title: "",
      poll_choices: [
        { poll_choice_content: "Yes" },
        { poll_choice_content: "No" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "poll_choices",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setTransition(async () => {
      try {
        await createPoll({ user_id: user?.id!, event_id, ...values });
        toast.success("Poll has been created");
      } catch (error) {
        toast.error("Something went wrong. Please try again later");
      }
    });
  }

  return (
    <Dialog open={dialogState} onOpenChange={setDialogState}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Poll</DialogTitle>
          {/* <DialogDescription>List of users</DialogDescription> */}
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="poll_title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="flex flex-wrap gap-2">
              {fields.map((item, index) => (
                <div key={item.id} className="relative group flex-grow">
                  <FormField
                    control={form.control}
                    name={`poll_choices.${index}.poll_choice_content`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={`Choice ${index + 1}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <X
                    className="h-4 w-4 absolute top-2.5 right-1.5 z-10 cursor-pointer text-muted-foreground hidden group-hover:block"
                    onClick={() => remove(index)}
                  />
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={() => append({ poll_choice_content: "" })}
              variant="outline"
              className="flex gap-4 items-center text-muted-foreground"
            >
              <p>Add Choice</p>
              <PlusCircle className="h-4 2-4" />
            </Button>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <div className="flex items-center gap-3">
                    <p>In progress</p>
                    <Spinner />
                  </div>
                ) : (
                  <p>Create</p>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePollDialog;
