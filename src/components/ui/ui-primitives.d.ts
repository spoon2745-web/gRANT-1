declare module '@/components/ui/dialog' {
  import React from 'react'
  // Use permissive types to avoid strict prop mismatches between JS and TS
  export const Dialog: React.ComponentType<any>
  export const DialogContent: React.ComponentType<any>
  export const DialogHeader: React.ComponentType<any>
  export const DialogTitle: React.ComponentType<any>
  export const DialogDescription: React.ComponentType<any>
  export const DialogFooter: React.ComponentType<any>
  export const DialogTrigger: React.ComponentType<any>
}

declare module '@/components/ui/button' {
  import React from 'react'
  export const Button: React.ComponentType<any>
}
