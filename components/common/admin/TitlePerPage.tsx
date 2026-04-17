import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateNewPet from "@/components/pet/CreateNewPet";

interface TitlePerPageProps {
  title: string;
  description: string;
  handleOpenModal: () => void;
}
export default function TitlePerPage({
  title,
  description,
  handleOpenModal,
}: TitlePerPageProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground font-medium">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button className="shadow-lg shadow-primary/20 font-bold">
                <Plus className="w-5 h-5 mr-2" /> Thêm thú cưng
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo mới một thú cưng</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>

              <CreateNewPet />

              <DialogFooter>
                <p>Thông tin bắt buộc</p>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>

                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </div>
  );
}
