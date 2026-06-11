import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FormattedTransactionPJ {
  id: number;
  tanggal: string;
  deskripsi: string;
  akun: string;
  pemasukanDisplay: string;
  pengeluaranDisplay: string;
}

interface PenanggungJawabTransactionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  namaPj?: string;
  transactions: Array<FormattedTransactionPJ>;
}

export function PenanggungJawabTransactionsDialog({
  open,
  onOpenChange,
  namaPj,
  transactions,
}: PenanggungJawabTransactionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {namaPj ?? "Penanggung Jawab"}
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="grid gap-4 py-4">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-slate-900">
                  Tanggal
                </TableHead>
                <TableHead className="font-semibold text-slate-900">
                  Deskripsi
                </TableHead>
                <TableHead className="font-semibold text-slate-900">
                  Akun
                </TableHead>
                <TableHead className="font-semibold text-slate-900 text-right">
                  Pemasukan
                </TableHead>
                <TableHead className="font-semibold text-slate-900 text-right">
                  Pengeluaran
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <TableRow key={t.id} className="hover:bg-slate-50">
                    <TableCell className="text-sm text-slate-700">
                      {t.tanggal}
                    </TableCell>
                    <TableCell className="text-sm text-slate-700">
                      {t.deskripsi}
                    </TableCell>
                    <TableCell className="text-sm text-slate-700">
                      {t.akun}
                    </TableCell>
                    <TableCell className="text-sm text-green-600 text-right">
                      {t.pemasukanDisplay}
                    </TableCell>
                    <TableCell className="text-sm text-rose-600 text-right">
                      {t.pengeluaranDisplay}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Tidak ada transaksi
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
