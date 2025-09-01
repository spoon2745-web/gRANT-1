'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SelectiveDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  messageId: string
  userName: string
  userEmail: string
  onConfirm: (messageId: string, deleteType: 'admin-only' | 'both') => void
}

export default function SelectiveDeleteDialog({
  open,
  onOpenChange,
  messageId,
  userName,
  userEmail,
  onConfirm
}: SelectiveDeleteDialogProps) {
  const [deleteType, setDeleteType] = useState<'admin-only' | 'both'>('admin-only')
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = async () => {
    setIsConfirming(true)
    try {
      await onConfirm(messageId, deleteType)
      onOpenChange(false)
      setDeleteType('admin-only') // Reset to default
    } finally {
      setIsConfirming(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setDeleteType('admin-only') // Reset to default
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Chat Message</DialogTitle>
          <DialogDescription>
            Choose how you want to delete this message from <strong>{userName}</strong> ({userEmail}).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="deleteType"
                value="admin-only"
                checked={deleteType === 'admin-only'}
                onChange={(e) => setDeleteType(e.target.value as 'admin-only')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-medium text-sm">Hide from Admin View Only</div>
                <div className="text-xs text-gray-600 mt-1">
                  The message will be hidden from the admin dashboard, but the user can still see it in their chat history.
                  You can restore it later if needed.
                </div>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="deleteType"
                value="both"
                checked={deleteType === 'both'}
                onChange={(e) => setDeleteType(e.target.value as 'both')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-medium text-sm">Delete for Both Admin and User</div>
                <div className="text-xs text-gray-600 mt-1">
                  The message will be permanently hidden from both admin dashboard and user&apos;s chat history.
                  <span className="text-red-600 font-medium"> This action can be undone but may affect user experience.</span>
                </div>
              </div>
            </label>
          </div>

          {deleteType === 'both' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="text-sm text-red-700">
                  <div className="font-medium">Warning: This will affect the user&apos;s chat history</div>
                  <div className="text-xs mt-1">The user will no longer see this message in their chat. Use this option carefully.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isConfirming}
          >
            Cancel
          </Button>
          <Button
            variant={deleteType === 'both' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={isConfirming}
            className={deleteType === 'admin-only' ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            {isConfirming ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              deleteType === 'admin-only' ? 'Hide from Admin' : 'Delete for Both'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
