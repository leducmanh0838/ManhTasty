import SidebarInfo from "./SidebarInfo";

const Sidebar = () => {
    return (
        <>
            <aside className="p-2 vh-100 d-none d-md-block"
                style={{ position: 'sticky', top: 0, maxWidth: '280px' }}>
                <div className="bg-white shadow pt-3 rounded h-100 px-2">
                    <SidebarInfo />
                </div>
            </aside>

            <div
                className="offcanvas offcanvas-start"
                tabIndex="-1"
                id="mobileSidebar"
                aria-labelledby="offcanvasLabel"
                style={{
                    visibility: 'visible',
                    width: 'auto', // 75% chiều ngang
                    zIndex: 1045,   // Trên cả header
                    minWidth: '60vw'
                }}
            >

                <div className="offcanvas-header">
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>

                <SidebarInfo />

            </div>
        </>
    )
}

export default Sidebar;