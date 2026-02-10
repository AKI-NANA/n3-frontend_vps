"use client"

import { useEffect, useRef, ReactNode } from "react"
import { X } from "lucide-react"
import { createPortal } from "react-dom"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  showFooter?: boolean
  footer?: ReactNode
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showFooter = false,
  footer,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
      return () => {
        document.removeEventListener("keydown", handleEscape)
        document.body.style.overflow = ""
      }
    }
  }, [isOpen, onClose])

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  if (typeof window === "undefined") return null

  const sizeClasses = {
    sm: "n3-modal-sm",
    md: "n3-modal-md",
    lg: "n3-modal-lg",
    xl: "n3-modal-xl",
    full: "n3-modal-full",
  }

  return createPortal(
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className={`n3-modal-overlay ${isOpen ? "open" : ""}`}
      />

      {/* Modal */}
      <div className={`n3-modal ${sizeClasses[size]} ${isOpen ? "open" : ""}`}>
        {/* Header */}
        {title && (
          <div className="n3-modal-header">
            <h2 className="n3-modal-title">{title}</h2>
            <button onClick={onClose} className="n3-modal-close">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="n3-modal-body">
          {children}
        </div>

        {/* Footer */}
        {showFooter && footer && (
          <div className="n3-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </>,
    document.body
  )
}

// Convenience exports
export function ModalHeader({ children }: { children: ReactNode }) {
  return <div className="n3-modal-header">{children}</div>
}

export function ModalBody({ children }: { children: ReactNode }) {
  return <div className="n3-modal-body">{children}</div>
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return <div className="n3-modal-footer">{children}</div>
}
