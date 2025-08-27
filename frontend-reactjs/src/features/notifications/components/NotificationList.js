import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../provides/AppProvider";
import { printErrors } from "../../../utils/printErrors";
import { authApis, endpoints } from "../../../configs/Apis";
import usePagination from "../../../hooks/usePagination"
import Avatar from "../../../components/ui/Avatar"
import { IoMdNotifications } from "react-icons/io";
import NotificationTypeUI from "../../../components/ui/NotificationTypeUI";
import { useNavigate } from "react-router-dom";
import { ModelContentType } from "../../../configs/Values";

const NotificationItem = ({ notification }) => {
    const nav = useNavigate();
    const [link, setLink] = useState(null);
    useEffect(() => {
        if (notification.content_type == ModelContentType.RECIPE.value)
            setLink(`/recipes/${notification.object_id}-xxx`)
        else if (notification.content_type == ModelContentType.COMMENT.value)
            setLink(`/comments/${notification.object_id}`)
        // console.info("notification.type: ", notification.type)
    }, [])

    return (
        <>
            <div className="row">
                <div className="col-1">
                    <div className="position-relative">
                        <img
                            src="/icons/logo.png"
                            alt="ManhTasty Logo"
                            style={{ width: 65, height: 65 }}
                        />
                        <span className="position-absolute translate-middle badge rounded-circle bg-danger"
                            style={{
                                bottom: "0px",    // cách đáy 20px
                                right: "-25px",
                            }}
                        >
                            <IoMdNotifications />
                        </span>
                    </div>
                </div>
                <div className="col-9">
                    <div className="btn btn-light text-start rounded p-3 d-inline-block border"
                        onClick={() => link && nav(link)}
                    >
                        <div className="d-flex">
                            <p className="fw-semibold me-2">{notification.title}</p>
                            <div>
                                <NotificationTypeUI value={notification.type} />
                            </div>
                        </div>
                        <div>
                            <p className="mb-0">{notification.description}</p>
                        </div>
                    </div>


                </div>
            </div>
        </>
    )
}

const NotificationList = ({ }) => {
    const { currentUser } = useContext(AppContext);

    const {
        resultData: notifications,
        // loading,
        // loadMore,
        // refresh,
        // hasMore,
        // page,
    } = usePagination({ endpoint: endpoints.currentUser.notifications.list, isLoadFirstData: true, useAuth: true });

    return (<>
        <div className="container">
            <h2 className="fw-bold mb-3">
                Thông báo
            </h2>
            {notifications && notifications.map((notification) => <>
                <div className="mb-2">
                    <NotificationItem notification={notification} />
                </div>
            </>)}
        </div>
    </>)
}

export default NotificationList;