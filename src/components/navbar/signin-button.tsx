import { Button } from "../ui/button";
import Spinner from "../ui/spinner";

interface SignInButtonProps {
  onClick: () => void;
  loading: boolean;
}

export const SignInButton: React.FC<SignInButtonProps> = ({
  onClick,
  loading,
}) => (
  <div className="flex justify-end">
    <Button data-testid="google_auth" onClick={onClick} disabled={loading}>
      {loading ? (
        <div className="flex items-center gap-3">
          <p>In progress</p>
          <Spinner />
        </div>
      ) : (
        <p>Sign in with Google</p>
      )}
    </Button>
  </div>
);
