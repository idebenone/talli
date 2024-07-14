import { ChangeEvent, useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue } from "jotai";

import { createSplit } from "../../actions";

import { EventChannelAtom, EventUsersListAtom, userAtom } from "@/utils/atoms";
import { formatNumberToIndianSystem } from "@/lib/utils";
import { SavedUser, Split } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form, FormField, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
import { toast } from "sonner";

interface CreateSplitDialogProps {
  event_id: string;
  dialogState: boolean;
  setDialogState: () => void;
}

const splitSchema = z.object({
  split_title: z.string(),
});

const CreateSplitDialog: React.FC<CreateSplitDialogProps> = ({
  event_id,
  dialogState,
  setDialogState,
}) => {
  const user = useAtomValue(userAtom);
  const eventUsers = useAtomValue(EventUsersListAtom);
  const channel = useAtomValue(EventChannelAtom);

  const [isPending, setTransition] = useTransition();

  const [inputValue, setInputValue] = useState<number>(0);
  const [splitUsers, setSplitUsers] = useState<
    { user: SavedUser; user_amount: number; include: boolean }[]
  >([]);

  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof splitSchema>>({
    resolver: zodResolver(splitSchema),
    defaultValues: {
      split_title: "",
    },
  });

  function handleInputValue(event: ChangeEvent<HTMLInputElement>) {
    const rawValue = parseFloat(event.target.value.replace(/,/g, "") || "0");
    setInputValue(rawValue);
  }

  function updateSplitUsersAmount(
    rawValue: number,
    users: { user: SavedUser; user_amount: number; include: boolean }[]
  ) {
    const includedCount = users.filter((user) => user.include).length;
    const newAmount = rawValue / includedCount;
    return users.map((user) => ({
      ...user,
      user_amount: user.include ? newAmount : 0,
    }));
  }

  function onSubmit(values: z.infer<typeof splitSchema>) {
    setTransition(async () => {
      try {
        const response = await createSplit({
          ...values,
          event_id,
          split_owner: user?.id!,
          split_amount: parseFloat(inputValue.toFixed(2)),
          split_users: splitUsers
            .filter((user) => user.include)
            .map((user) => ({
              user_id: user.user.id,
              split_user_amount: user.user_amount,
            })),
        });
        toast.success("Split has been created");
        setDialogState();
        broadcastSplit(response.data.split);
      } catch (error) {
        toast.success("Something went wrong. Please try again later!");
      }
    });
  }

  function broadcastSplit(data: Split) {
    if (channel) {
      channel.send({
        type: "broadcast",
        event: "notifications",
        payload: {
          ...data,
          type: "split",
          owner: {
            name: user?.user_metadata.full_name,
            avatar_url: user?.user_metadata.avatar_url,
          },
          createdAt: new Date(data.created_at),
        },
      });
    }
  }

  function handleCheckChange(id: string) {
    setSplitUsers((prev) => {
      const updatedUsers = prev.map((user) =>
        user.user.id === id ? { ...user, include: !user.include } : user
      );
      return updateSplitUsersAmount(inputValue, updatedUsers);
    });
  }

  useEffect(() => {
    if (eventUsers.length > 0) {
      const initialSplitUsers = eventUsers.map((user) => ({
        user: user.users,
        user_amount: 0,
        include: true,
      }));
      setSplitUsers(initialSplitUsers);
    }
  }, [eventUsers]);

  useEffect(() => {
    setSplitUsers((prev) => updateSplitUsersAmount(inputValue, prev));
  }, [inputValue]);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const width = spanRef.current.offsetWidth;
      inputRef.current.style.width = `${width * 2.2}px`;
    }
  }, [inputValue]);

  return (
    <Dialog open={dialogState} onOpenChange={setDialogState}>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col justify-center items-center">
              <div className="flex gap-1 justify-center items-center">
                <p>₹</p>
                <input
                  ref={inputRef}
                  placeholder="0"
                  value={formatNumberToIndianSystem(inputValue)}
                  onChange={handleInputValue}
                  className="border-none outline-none focus-visible:ring-0 p-0 text-3xl font-bold bg-transparent"
                  style={{ width: "1ch" }}
                />
                <span
                  ref={spanRef}
                  className="invisible absolute whitespace-pre-wrap"
                >
                  {inputValue || "0"}
                </span>
              </div>

              <FormField
                control={form.control}
                name="split_title"
                render={({ field }) => (
                  <FormControl>
                    <Input
                      placeholder="What for?"
                      {...field}
                      className="border-none outline-none focus-visible:ring-0 p-0 text-center text-muted-foreground"
                    />
                  </FormControl>
                )}
              />
            </div>

            <Separator />

            {splitUsers.map((user, index) => (
              <div
                key={index}
                className="flex justify-between items-start cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={user.include}
                    onCheckedChange={() => handleCheckChange(user.user.id)}
                  />
                  <Image
                    height="400"
                    width="400"
                    className="h-8 w-8 grayscale-100 group-hover:grayscale-0"
                    src={user.user.avatar_url}
                    alt={user.user.name}
                  />
                  <div className="flex flex-col">
                    <p>{user.user.name}</p>
                  </div>
                </div>

                <p>₹{formatNumberToIndianSystem(user.user_amount)}</p>
              </div>
            ))}

            <div className="flex justify-center">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <div className="flex items-center gap-3">
                    <p>In progress</p>
                    <Spinner />
                  </div>
                ) : (
                  <p>Split</p>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSplitDialog;
