import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../../provides/AppProvider";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Apis, { authApis, endpoints } from "../../../configs/Apis";
import RecipeCardExtend from "../../recipes/components/RecipeCardExtend";
import "./SearchPage.css"
import NotFoundRecipe from "./NotFoundRecipe";
import usePagination from "../../../hooks/usePagination";
import LoadingSpinner from "../../../components/ui/Spinner/LoadingSpinner";

const SearchPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useContext(AppContext);
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword");
    const orderBy = searchParams.get("sort_by") || "-id";
    const [keywordSuggestions, setKeywordSuggestions] = useState([]);

    // useEffect(() =>{console.info("orderBy: ", orderBy)}, [orderBy])

    const loaderRef = useRef(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; // lần đầu render → bỏ qua
            return;
        }

        const fecthData = async() =>{
            try{
                const res = await Apis.get(`${endpoints.search.popularKeywords}?keyword=${keyword}`)
                setKeywordSuggestions(res.data)
            }catch(err){

            }
        }

        // Chỉ chạy effect khi keyword thay đổi sau render đầu tiên
        // console.info("keyword changed:", keyword);
        // console.info("page", page);
        refresh();
        // console.info("recipes: ", JSON.stringify(recipes, null, 2))
        fecthData ();
    }, [keyword]);

    const {
        resultData: recipes,
        loading,
        loadMore,
        hasMore,
        refresh,
        page,
        setPage
    } = usePagination({ endpoint: endpoints.recipes.search, isLoadFirstData: true, useAuth: !!currentUser, params: { "keyword": keyword, "sort_by": orderBy } });

    useEffect(() => {
        refresh();
    }, [orderBy])


    useEffect(() => {
        console.info("useEffect seachPage")
        if (!loaderRef.current || !recipes || recipes.length <= 0) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    // console.log("Chạm cuối → Gọi API load thêm dữ liệu");
                    hasMore && loadMore();
                }
            },
            { threshold: 0 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [recipes]);


    // Map option hiển thị sang giá trị sort_by
    const sortOptions = [
        { label: "Mới nhất", value: "-id" },
        { label: "Lượt xem", value: "-view_count" },
        { label: "Đánh giá", value: "-avg_rating" },
    ];

    // Lấy giá trị hiện tại từ query param
    const params = new URLSearchParams(location.search);
    const currentSort = params.get("sort_by") || "-id";

    const handleChange = (e) => {
        const newSort = e.target.value;
        params.set("sort_by", newSort); // cập nhật sort_by
        console.info("url: ", `${location.pathname}?${params.toString()}`)
        navigate(`${location.pathname}?${params.toString()}`);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-7 py-4 px-3">
                    {recipes && recipes.length > 0 ? recipes.map((recipe, index) => (
                        <div key={index}>
                            <RecipeCardExtend recipe={recipe} />
                        </div>
                    )) : <NotFoundRecipe />}
                    <div ref={loaderRef} className="p-2" />
                    {loading && <LoadingSpinner size='sm' text='Đang tải món ăn...' />}
                </div>
                <div className="col-5 py-4 px-3">
                    <div className="mb-2">
                        <span class="fw-bold">Tìm kiếm tương tự:</span>
                    </div>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                        {keywordSuggestions.map((item, index) => (
                            <span key={index} className={`px-3 py-1 rounded-pill border border-2 btn btn-light`}
                                onClick={() => navigate(`/search?keyword=${item.keyword}`)}
                            >
                                {item?.keyword}
                            </span>
                        ))}
                    </div>

                    <div className="mb-2">
                        <span class="fw-bold">Sắp xếp theo:</span>
                    </div>
                    <select value={currentSort} onChange={handleChange} className="form-select">
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default SearchPage;