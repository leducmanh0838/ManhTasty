import { memo, useContext, useState } from "react";
import ReportDialog from "./ReportDialog";
import MenuItemWithIcon from "../../../components/ui/MenuItemWithIcon"
import { HiOutlineFlag } from "react-icons/hi";
import { toast } from "react-toastify";
import { AppContext } from "../../../provides/AppProvider";

const ReportDialogButton = ({ objectId, contentType, className}) => {
    console.info("render ReportDialogButton ", Math.random())
    const [showModal, setShowModal] = useState(false);
    const { currentUser } = useContext(AppContext);

    return (
        <>
            <button className={`btn btn-light btn-sm text-start ${className}`}
                onClick={() => {currentUser?setShowModal(true):toast.warning("Bạn cần đăng nhập để báo cáo!")}}
            >
                <MenuItemWithIcon icon={<HiOutlineFlag/>} label={"Báo cáo"}/>
            </button>
            <ReportDialog {...{ objectId, showModal, setShowModal, contentType }}/>
        </>
    )
}

export default memo(ReportDialogButton);