import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchAutocompleteSimple from "./SearchAutocompleteSimple";
import { AppContext } from "../../../provides/AppProvider";
import Apis, { authApis, endpoints } from "../../../configs/Apis";
import { MdHistory, MdSearch } from "react-icons/md";
import moment from 'moment';
import 'moment/locale/vi';

const SearchBar = () => {
    const { currentUser } = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);

    const [userSearch, setUserSearch] = useState(null);
    const handleSelectItem = (suggestionItem) => {
        params.set('keyword', suggestionItem.keyword);
        navigate(`/search?${params.toString()}`);
        // navigate(`/search?keyword=${suggestionItem.keyword}`)
    }

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser) {
                const api = await authApis();
                const res = await api.get(endpoints.currentUser.recentKeywords)
                // {moment(comment.created_at).fromNow()}
                const dataWithIcons = res.data.map(item => ({
                    ...item,
                    icon: <MdHistory />,
                    text: item.last_seen ? moment(item.last_seen).fromNow() : ""
                }))
                setUserSearch(dataWithIcons)
            } else {
                setUserSearch([]);
            }
        }
        fetchData();
    }, [currentUser])

    const handleGetResponseSuggestions = async (keyword) => {
        const res = await Apis.get(`${endpoints.search.popularKeywords}?keyword=${keyword}`);
        console.info("kw: ", res.data)
        const dataWithIcons = res.data.map(item => ({ 
            ...item, 
            icon: <MdSearch />,
            text: item.total_count ? `${item.total_count} lượt tìm kiếm` : ""
        }))
        return dataWithIcons;
        // if (currentUser) {
        //     const api = await authApis();
        //     const res = await api.get(endpoints.currentUser.recentKeywords)
        //     return res.data;
        // }
    }

    const handleSubmit = (keyword) => {
        navigate(`/search?keyword=${keyword}`)
    }
    return (
        <>
            {userSearch && <SearchAutocompleteSimple label="Tìm kiếm món ăn, nguyên liệu, dịp, chế độ ăn, vùng miền,..." keyword={"keyword"} onSubmit={handleSubmit} 
            {...{ handleSelectItem, handleGetResponseSuggestions }} defaultKeywords={userSearch} />}
        </>
    )
}

export default SearchBar;