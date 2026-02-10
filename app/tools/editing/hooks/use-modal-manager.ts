// app/tools/editing/hooks/use-modal-manager.ts
import { useState, useCallback } from 'react';
import type { ModalType, ModalPayload } from '../types/modal';

export const useModalManager = () => {
  const [openModal, setOpenModal] = useState<ModalType>('none');
  const [payload, setPayload] = useState<ModalPayload | null>(null);

  const open = useCallback((type: ModalType, data: ModalPayload | null = null) => {
    setOpenModal(type);
    setPayload(data);
  }, []);

  const close = useCallback(() => {
    setOpenModal('none');
    setPayload(null);
  }, []);

  const isOpen = useCallback((type: ModalType) => {
    return openModal === type;
  }, [openModal]);

  return {
    openModal,
    payload,
    open,
    close,
    isOpen,
  };
};
