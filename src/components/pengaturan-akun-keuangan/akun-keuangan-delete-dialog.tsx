import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { AkunKeuanganRecord } from "./types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AkunKeuanganDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  akun: AkunKeuanganRecord | null;
  onConfirm: (id: number) => Promise<boolean> | boolean;
}

export function AkunKeuanganDeleteDialog({
  open,
  onOpenChange,
  akun,
  onConfirm,
}: AkunKeuanganDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async (id: number) => {
    setIsDeleting(true);
    try {
      const success = await onConfirm(id);
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
            <AlertDialogTitle>Hapus Data Akun Keuangan?</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus akun <b>{akun?.namaAkun}</b>?
            <br />
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            className="md:w-[50%] w-full bg-slate-900 text-white hover:text-white hover:bg-slate-800 h-12 cursor-pointer"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-rose-600 hover:bg-rose-700 md:w-[50%] w-full h-12 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              if (akun) handleConfirm(akun.id);
            }}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Ya, Hapus"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
