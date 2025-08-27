// ConfirmDeleteDraftDialogButton.js

import { memo, useState } from "react";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

const ConfirmDeleteDialogButton = ({ handleDelete, children, message, confirmText="Xóa", cancelText="Hủy" }) => {
    const [showDialog, setShowDialog] = useState(false);

    //   const handleDelete = () => {
    //     console.log("Xóa bản nháp...");
    //     setShowDialog(false);
    //     // gọi API xóa ở đây
    //   };

    return (
        <>
            {/* <button className="btn btn-danger" onClick={() => setShowDialog(true)}>
                Xóa bản nháp
            </button> */}
            <div onClick={() => setShowDialog(true)}>
                {children}
            </div>

            <ConfirmDeleteDialog
                show={showDialog}
                title="Xác nhận xóa"
                // message="Bạn có chắc chắn muốn xóa bản nháp này không? Hành động này không thể hoàn tác."
                message = {message}
                onCancel={() => setShowDialog(false)}
                onConfirm={() => {
                    handleDelete();
                    setShowDialog(false);
                }}
                confirmText={confirmText}
                cancelText={cancelText}
            />
        </>
    );
};

export default memo(ConfirmDeleteDialogButton);
