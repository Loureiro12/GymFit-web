import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DeleteModalProps {
  title: string
  description: string
  titleButtonDelete: string
  titleButtonConfirm: string
  openModal: boolean
  closeModal: () => void
}

export function DeleteModal({
  title,
  description,
  titleButtonConfirm,
  titleButtonDelete,
  openModal,
  closeModal,
}: DeleteModalProps) {
  return (
    <AlertDialog open={openModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeModal}>
            {titleButtonDelete}
          </AlertDialogCancel>
          <AlertDialogAction>{titleButtonConfirm}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
