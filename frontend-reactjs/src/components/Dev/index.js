import Login from "../../features/auth/components/Login";

const Comment = ({ root = true }) => {
    console.info(root ? "Bình luận gốc" : "Bình luận trả lời")
    return (
        <>
            <div className="p-3">
                {root ? "Bình luận gốc" : "Bình luận trả lời"}
            </div>
            {root && <Comment root={false} />}
        </>
    );
};

const Dev = () => {
    return (<>
        <Comment />
        {/* <PageSpinner/> */}
    </>)
}

export default Dev;