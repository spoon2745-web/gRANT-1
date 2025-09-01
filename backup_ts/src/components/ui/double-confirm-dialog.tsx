"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DoubleConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  secondaryDescription: string
  confirmText?: string
  secondaryConfirmText?: string
  cancelText?: string
  onConfirm: () => void
}

export function DoubleConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  secondaryDescription,
  confirmText = "Continue",
  secondaryConfirmText = "Yes, I'm absolutely sure",
  cancelText = "Cancel",
  onConfirm
}: DoubleConfirmDialogProps) {
  const [step, setStep] = useState(1)

  const handleClose = () => {
    setStep(1)
    onOpenChange(false)
  }

  const handleFirstConfirm = () => {
    setStep(2)
  }

  const handleFinalConfirm = () => {
    onConfirm()
    setStep(1)
    onOpenChange(false)
  }

  const handleBack = () => {
    setStep(1)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {title}
          </DialogTitle>
          <DialogDescription className="py-2">
            {step === 1 ? description : secondaryDescription}
          </DialogDescription>
        </DialogHeader>
        
        {step === 1 ? (
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleClose}
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleFirstConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {confirmText}
            </Button>
          </DialogFooter>
        ) : (
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleBack}
            >
              Go Back
            </Button>
            <Button
              onClick={handleFinalConfirm}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              {secondaryConfirmText}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
