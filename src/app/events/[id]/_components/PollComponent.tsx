import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { addVote } from "../../actions";
import { userAtom } from "@/utils/atoms";
import { useAtomValue } from "jotai";

interface PollComponentProps {
  poll: any;
  //   poll_choices: {
  //     choice_id: string;
  //     poll_choice: string;
  //     vote_count: number;
  //   }[];
}

const PollComponent: React.FC<PollComponentProps> = ({
  poll,
  //   poll_choices,
}) => {
  const user = useAtomValue(userAtom);

  //   const [choices, setChoices] = useState(poll_choices);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [totalVotes, setTotalVotes] = useState<number>(0);

  const setUserSelectedChoice = () => {
    if (!poll.votes) return;

    const userVote = poll.votes.find((vote: any) => vote.user_id === user?.id);
    if (userVote) {
      setSelectedChoice(userVote.choice_id);
    }
  };

  useEffect(() => {
    const total = poll.choices.reduce(
      (sum: any, choice: { vote_count: any }) => sum + choice.vote_count,
      0
    );
    setTotalVotes(total);
    setUserSelectedChoice();
  }, []);

  const handleVote = async (choice_id: string) => {
    if (selectedChoice !== choice_id) {
      setSelectedChoice(choice_id);
      addVote(poll.poll_id, user?.id, choice_id);
      // You might want to update the vote count here and make an API call
    }
  };

  return (
    <div className="p-4">
      <p className="text-lg font-semibold mb-4">{poll.poll_title}</p>
      {poll.choices.map((poll_option: any) => (
        <div key={poll_option.choice_id} className="mb-4 relative">
          <div
            className="relative cursor-pointer h-12 rounded-lg transition-colors duration-200 flex items-center justify-center"
            onClick={() => handleVote(poll_option.choice_id)}
          >
            <Progress
              value={(poll_option.vote_count / totalVotes) * 100}
              // value={33}
              className={`absolute h-full w-full rounded-lg ${
                selectedChoice === poll_option.choice_id
                  ? "border-8 border-blue-500"
                  : ""
              }`}
            />
            <span className="z-10 text-blue-500 text-lg font-semibold bg-opacity-75 px-2 py-1 rounded">
              {poll_option.poll_choice}
              {/* ({((poll_option.vote_count / totalVotes) * 100).toFixed(1)}%) */}
            </span>
          </div>
          <span className="text-sm mt-2 block text-right text-gray-600">
            {poll_option.vote_count} votes
          </span>
        </div>
      ))}
    </div>
  );
};

export default PollComponent;
