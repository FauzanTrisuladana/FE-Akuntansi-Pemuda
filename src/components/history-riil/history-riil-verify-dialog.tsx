import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { HistoryRiilRecord } from "./types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────
type HistoryRiilVerifyDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  data?: HistoryRiilRecord | null;
  onVerify?: (id: number) => Promise<boolean> | boolean;
};

// ─── Component ────────────────────────────────────────────────────────────────
export function HistoryRiilVerifyDialog({
  open,
  onOpenChange,
  data,
  onVerify,
}: HistoryRiilVerifyDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled =
    typeof open === "boolean" && typeof onOpenChange === "function";
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!data) return;

    setIsLoading(true);
    try {
      const success = await onVerify?.(data.id);
      if (success) {
        setDialogOpen(false);
      }
    } catch {
      toast.error("Gagal memverifikasi data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    setDialogOpen(val);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Verifikasi</DialogTitle>
          <DialogDescription>
            Verifikasi {data?.nama_akun} pada tanggal {data?.tanggal} Sudah
            sesuai
          </DialogDescription>
          <DialogDescription className="text-sm text-muted-foreground">
            Pastikan nilai yang tercantum sama dengan aslinya
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            className="md:w-[50%] w-full h-12 cursor-pointer"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="button"
            className="md:w-[50%] w-full bg-slate-900 text-white hover:bg-slate-800 h-12 cursor-pointer"
            onClick={handleVerify}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ya, Verifikasi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
