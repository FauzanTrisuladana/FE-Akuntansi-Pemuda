import type { LaporanKeuanganTransaksiRecord } from "./types";
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

interface LaporanKeuanganEvidenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: LaporanKeuanganTransaksiRecord | null;
}

export function LaporanKeuanganEvidenceDialog({
  open,
  onOpenChange,
  data,
}: LaporanKeuanganEvidenceDialogProps) {
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
            <img
              src={data.bukti}
              alt={`Bukti transaksi ${data.deskripsi}`}
              className="w-full object-contain max-h-96"
            />
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Tidak ada bukti tersedia
            </p>
          )}
        </DialogBody>

        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            className="h-12 cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
