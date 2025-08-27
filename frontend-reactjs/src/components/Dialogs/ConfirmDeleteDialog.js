import { memo } from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmDeleteDialog = ({ show, title, message, onCancel, onConfirm, confirmText = "Xác nhận", cancelText = "Hủy" }) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default memo(ConfirmDeleteDialog);
