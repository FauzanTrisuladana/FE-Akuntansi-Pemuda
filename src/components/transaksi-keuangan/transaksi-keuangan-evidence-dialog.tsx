import type { TransaksiKeuanganRecord } from "./types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TransaksiKeuanganEvidenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: TransaksiKeuanganRecord | null;
}

export function TransaksiKeuanganEvidenceDialog({
  open,
  onOpenChange,
  data,
}: TransaksiKeuanganEvidenceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Bukti Transaksi {data?.deskripsi ? `"${data.deskripsi}"` : ""}
          </DialogTitle>
          <DialogDescription>
            Preview bukti transaksi keuangan
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="py-4">
          {data?.bukti ? (
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <img
                src={data.bukti}
                alt={`Bukti transaksi ${data.deskripsi}`}
                className="w-full object-contain max-h-96"
              />
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Tidak ada bukti tersedia
            </p>
          )}
        </DialogBody>

        <DialogFooter>
          <Button
            variant="outline"
            className="md:w-[50%] w-full h-12 cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
