import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TitlePerPageProps {
  title: string;
  description: string;
  buttonText?: string;
  handleOpenModal?: () => void;
}

export default function TitlePerPage({
  title,
  description,
  buttonText,
  handleOpenModal,
}: TitlePerPageProps) {
  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="font-medium text-muted-foreground">{description}</p>
      </div>

      {buttonText ? (
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={handleOpenModal}
            className="font-bold shadow-lg shadow-primary/20"
          >
            <Plus className="mr-2 h-5 w-5" /> {buttonText}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
