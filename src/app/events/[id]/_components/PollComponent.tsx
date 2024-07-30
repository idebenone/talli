import React, { useState, useEffect } from "react";

import { Progress } from "@/components/ui/progress";
import { addVote, getPollResults } from "../../actions";
import { userAtom } from "@/utils/atoms";
import { useAtomValue } from "jotai";
import { CheckCircle } from "lucide-react";
import { convertToTime } from "@/lib/utils";
import Image from "next/image";
import { Poll } from "@/lib/types";

interface PollComponentProps {
  poll: Poll;
}

interface ViewChoicesProps {
  selectedChoice: number;
  setSelectedChoice: (choiceId: number) => void;
  pollId: number;
  choiceId: number;
  pollChoice: string;
  userId: string;
}

interface ViewResultProps {
  pollChoice: string;
  voteCount: number;
  totalVotes: number;
}

const ViewChoices: React.FC<ViewChoicesProps> = ({
  selectedChoice,
  setSelectedChoice,
  pollId,
  choiceId,
  pollChoice,
  userId,
}) => {
  async function handleVote(choice_id: number) {
    if (selectedChoice !== choice_id) {
      setSelectedChoice(choice_id);
      addVote(pollId, userId, choice_id);
    }
  }

  return (
    <div
      className={`h-8 border border-muted py-1 px-2 hover:bg-muted flex items-center transition-all duration-200 cursor-pointer ${
        selectedChoice === choiceId && "bg-muted"
      } `}
      onClick={() => selectedChoice !== choiceId && handleVote(choiceId)}
    >
      <div className="flex gap-2 items-center justify-between w-full">
        <p className="text-xs text-muted-foreground">{pollChoice}</p>
        {selectedChoice === choiceId && (
          <CheckCircle className="h-3 w-3 text-green-600" />
        )}
      </div>
    </div>
  );
};

const ViewResult: React.FC<ViewResultProps> = ({
  pollChoice,
  voteCount,
  totalVotes,
}) => {
  return (
    <div className="h-8 relative flex items-center justify-between">
      <Progress
        value={(voteCount / totalVotes) * 100}
        className="absolute h-full w-full"
      />
      <span className="z-10 p-1 text-xs invert">{pollChoice}</span>
      <span className="z-10 p-1 text-xs invert italic">
        {(voteCount / totalVotes) * 100}%
      </span>
    </div>
  );
};

const PollComponent: React.FC<PollComponentProps> = ({ poll }) => {
  const user = useAtomValue(userAtom);

  const [pollChoices, setPollChoices] = useState<any[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<number>();
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [viewResult, setViewResult] = useState<boolean>(false);

  async function handlePollResults() {
    const response = await getPollResults(poll.data.poll_id);
    const total = response.data?.reduce(
      (sum: number, choice: { vote_count: number }) => sum + choice.vote_count,
      0
    );

    setPollChoices(response.data!);
    setTotalVotes(total);
  }

  useEffect(() => {
    if (!poll.votes) return;
    const userVote = poll.votes.find((vote: any) => vote.user_id === user?.id);
    if (userVote) {
      setSelectedChoice(userVote.choice_id);
    }
  }, []);

  useEffect(() => {
    if (viewResult) {
      handlePollResults();
    }
  }, [viewResult]);

  return (
    <div
      className={`flex flex-col gap-1  ${
        user?.id! === poll.data.poll_owner ? "items-end" : ""
      }`}
    >
      <p className="text-[10px] text-muted-foreground">
        {convertToTime(poll.created_at.toString())}
      </p>

      <div
        className={`flex gap-2 ${
          user?.id! === poll.data.poll_owner ? "flex-row-reverse" : ""
        }`}
      >
        <Image
          src={poll.owner.avatar_url}
          alt={poll.owner.name}
          width="400"
          height="400"
          className="h-8 w-8"
        />
        <div className="p-4 border border-muted flex flex-col gap-2 w-[300px]">
          <p className="text-lg">{poll.data.poll_title}</p>

          {!viewResult && (
            <div className="flex flex-col gap-1">
              {poll.choices.map((poll_choice: any, index: number) => (
                <ViewChoices
                  key={index}
                  selectedChoice={selectedChoice!}
                  setSelectedChoice={(choiceId: number) =>
                    setSelectedChoice(choiceId)
                  }
                  pollId={poll_choice.poll_id}
                  choiceId={poll_choice.choice_id}
                  pollChoice={poll_choice.poll_choice}
                  userId={user?.id!}
                />
              ))}
            </div>
          )}

          {viewResult && (
            <div className="flex flex-col gap-1">
              {pollChoices.map((poll_option: any, index: number) => (
                <ViewResult
                  key={index}
                  pollChoice={poll_option.poll_choice}
                  totalVotes={totalVotes}
                  voteCount={poll_option.vote_count}
                />
              ))}
            </div>
          )}

          <p
            className="text-end text-[12px] text-blue-500 italic cursor-pointer"
            onClick={() => setViewResult(!viewResult)}
          >
            {viewResult ? "Close" : "Results"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PollComponent;
