import { memo, useState } from "react";
import ReportDialog from "./ReportDialog";
import MenuItemWithIcon from "../../../components/ui/MenuItemWithIcon"
import { HiOutlineFlag } from "react-icons/hi";

const ReportDialogButton = ({ objectId, contentType, className}) => {
    console.info("render ReportDialogButton ", Math.random())
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className={`btn btn-light btn-sm text-start ${className}`}
                onClick={() => {
                    setShowModal(true);
                }}
            >
                <MenuItemWithIcon icon={<HiOutlineFlag/>} label={"Báo cáo"}/>
            </button>
            <ReportDialog {...{ objectId, showModal, setShowModal, contentType }}/>
        </>
    )
}

export default memo(ReportDialogButton);