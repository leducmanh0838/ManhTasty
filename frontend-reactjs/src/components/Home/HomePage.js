import { mockRecipes } from "../../mocks/homepage";
import "./Home.css";
import { BiDotsHorizontalRounded, BiShareAlt } from "react-icons/bi";

const HomePage = () => {
    return (
        // <main className="py-4 px-3 recipe-grid">
        //     {mockRecipes.map((recipe) => (
        //         <div
        //             key={recipe.id}
        //             className="card shadow-sm mb-4"
        //             style={{ breakInside: 'avoid', width: '100%' }}
        //         >
        //             <img
        //                 src={recipe.image}
        //                 alt={recipe.title}
        //                 className="card-img-top"
        //                 style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
        //             />
        //             <div className="card-body text-center p-2">
        //                 <p className="card-text fw-medium small mb-0">{recipe.title}</p>
        //             </div>
        //         </div>
        //     ))}
        // </main>

        //         <div className="hover-box">
        //   Di chuột vào tôi 👆
        // </div>

        <main className="py-4 px-3 recipe-grid">
            {mockRecipes.map((recipe) => (
                <div
                    key={recipe.id}
                    className="card mb-4 recipe-card"
                    style={{
                        breakInside: 'avoid',
                        width: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        border: 'none',
                        borderRadius: '12px',
                    }}
                >
                    <div
                        className="position-relative group"
                        style={{ cursor: 'pointer' }}
                    >
                        {/* Hình ảnh món ăn */}
                        <div className="recipe-image">
                            <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="card-img-top"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block',
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '40%',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                                }}
                            />
                        </div>

                        <div
                            className="text-center fs-5"
                            style={{
                                position: 'absolute',
                                bottom: '8px',
                                width: '100%',
                                color: 'white',
                                fontWeight: '600',
                                zIndex: 2,
                            }}
                        >
                            {recipe.title}
                        </div>

                        {/* Nút xuất hiện khi hover */}
                        <div
                            className="action-buttons d-flex justify-content-between align-items-start px-2"
                            style={{
                                position: 'absolute',
                                top: '10px',
                                width: '100%',
                                // height: '50px',
                                transition: 'opacity 0.3s',
                                zIndex: 3,
                            }}
                        >
                            {/* <div className="hover-box">
                                Di chuột vào tôi 👆
                            </div> */}
                            <div>
                                {/* Nút 3 chấm */}
                                <button
                                    className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center me-2"
                                    style={{ width: '36px', height: '36px' }} // đảm bảo hình tròn cố định
                                >
                                    <BiDotsHorizontalRounded size={20} />
                                </button>
                            </div>
                            <div className="d-flex gap-2">
                                {/* Nút chia sẻ */}
                                <button
                                    className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center me-2"
                                    style={{ width: '36px', height: '36px' }} // đảm bảo hình tròn cố định
                                >
                                    <BiShareAlt />
                                </button>
                                {/* Nút lưu */}
                                <button className="btn btn-danger btn-sm fw-bold rounded-pill px-3">
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </main>


        // <main className="py-4 px-3 recipe-grid">
        //     {mockRecipes.map((recipe) => (
        //         <div
        //             key={recipe.id}
        //             className="card mb-4"
        //             style={{
        //                 breakInside: 'avoid',
        //                 width: '100%',
        //                 position: 'relative',
        //                 overflow: 'hidden',
        //                 border: 'none',
        //                 borderRadius: '12px',
        //             }}
        //         >
        //             <div style={{ position: 'relative' }}>
        //                 <img
        //                     src={recipe.image}
        //                     alt={recipe.title}
        //                     className="card-img-top"
        //                     style={{
        //                         width: '100%',
        //                         height: 'auto', // để ảnh theo tỷ lệ thật
        //                         display: 'block',
        //                     }}
        //                 />
        //                 {/* Gradient overlay */}
        //                 <div
        //                     style={{
        //                         position: 'absolute',
        //                         bottom: 0,
        //                         left: 0,
        //                         right: 0,
        //                         height: '40%', // thấp hơn vì ảnh cao bất kỳ
        //                         background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
        //                     }}
        //                 />

        //                 <div
        //                     style={{
        //                         position: 'absolute',
        //                         bottom: '8px',
        //                         right: '12px',
        //                         color: 'white',
        //                         fontWeight: '600',
        //                         zIndex: 2,
        //                     }}
        //                 >
        //                     <button className="btn btn-light btn-sm rounded-circle me-2">
        //                         <BiDotsHorizontalRounded/>
        //                     </button>
        //                 </div>

        //                 {/* Chữ trên ảnh */}
        //                 <div className="text-center fs-5"
        //                     style={{
        //                         position: 'absolute',
        //                         bottom: '8px',
        //                         width: '100%',
        //                         color: 'white',
        //                         fontWeight: '600',
        //                         // fontSize: '16px',
        //                         zIndex: 2,
        //                     }}
        //                 >
        //                     {recipe.title}
        //                 </div>
        //             </div>
        //         </div>
        //     ))}
        // </main>


    )
}

export default HomePage;