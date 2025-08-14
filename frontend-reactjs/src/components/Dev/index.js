// import { useEffect, useRef } from "react";

// function App() {
//     const loaderRef = useRef(null);

//     useEffect(() => {
//         if (!loaderRef.current) return;

//         const observer = new IntersectionObserver(
//             entries => {
//                 if (entries[0].isIntersecting) {
//                     console.log("Chạm cuối → Gọi API load thêm dữ liệu");
//                 }
//             },
//             { threshold: 0 }
//         );

//         observer.observe(loaderRef.current);
//         return () => observer.disconnect();
//     }, []);

//     return (
//         <div style={{ height: "200vh", padding: "20px" }}>
//             <p>Kéo xuống cuối để test...</p>
//             <div
//                 ref={loaderRef}
//                 style={{
//                     height: "50px",
//                     background: "tomato",
//                     // marginTop: "800px"
//                 }}
//             >
//                 Vùng trigger
//             </div>
//         </div>
//     );
// }


// const Dev = () => {



//     return (<>
//         <App/>
//     </>)
// }

// export default Dev;

import { useEffect } from "react";
import { endpoints } from "../../configs/Apis";
import usePagination from "../../hooks/usePagination";

const Dev = () => {
    const {
        resultData: recipes,
        loading,
        loadMore,
        refresh,
        hasMore,
        page,
    } = usePagination({endpoint:endpoints.recipes.list, isLoadFirstData:false});
    useEffect(() => {
        // console.info("recipes: ", JSON.stringify(recipes, null, 2));
    }, [recipes])


    return (<>
        <div>
            {recipes && recipes.map((recipe, index) => (<div>
                {recipe.title}
            </div>))}
            <button disabled={!hasMore} onClick={loadMore}>loadMore</button>
            <button onClick={refresh}>refresh</button>
        </div>
    </>)
}

export default Dev;