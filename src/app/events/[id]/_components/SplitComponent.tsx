import React from "react";
import { Split } from "@/lib/types";
import { useAtomValue } from "jotai";
import { userAtom } from "@/utils/atoms";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { convertToTime } from "@/lib/utils";

interface SplitComponentProps {
  split: Split;
}

const SplitComponent: React.FC<SplitComponentProps> = ({ split }) => {
  const user = useAtomValue(userAtom);

  return (
    <div
      className={`flex flex-col gap-1  ${
        user?.id! === split.data.split_owner ? "items-end" : ""
      }`}
    >
      <p className="text-[10px] text-muted-foreground">
        {convertToTime(split.created_at.toString())}
      </p>

      <div
        className={`flex gap-2 ${
          user?.id! === split.data.split_owner ? "flex-row-reverse" : ""
        }`}
      >
        <Image
          src={split.owner.avatar_url}
          alt={split.owner.name}
          width="400"
          height="400"
          className="h-8 w-8"
        />
        <div className="border border-muted p-4 flex flex-col gap-2 w-[300px]">
          {!split.data.split_title ? (
            <p className="text-xs">Split Request</p>
          ) : (
            <p className="text-xs">
              <span className="text-muted-foreground">Requested for</span>
              <span className="font-semibold"> {split.data.split_title}</span>
            </p>
          )}
          <div className="flex gap-1 items-center">
            <p>₹</p>
            <p className="text-3xl font-bold">{split.data.split_amount}</p>
          </div>

          {split.split_users?.map(
            (split_user, index) =>
              split_user.user_id === user?.id! && (
                <Button key={index} className="w-full">
                  ₹{split_user.split_user_amount}
                </Button>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default SplitComponent;
