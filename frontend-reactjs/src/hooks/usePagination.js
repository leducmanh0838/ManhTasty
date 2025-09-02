import { useEffect, useRef, useState } from 'react';
import Apis, { authApis } from "../configs/Apis";

const usePagination = ({ endpoint, params = {}, useAuth = false, isLoadFirstData = false }) => {
  const [resultData, setResultData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const isLoadingItemsRef = useRef(false);
  const isRefreshingRef = useRef(false);
  const [hasMore, setHasMore] = useState(true);
  const [count, setCount] = useState(0);

  const buildUrl = (pageNumber) => {
    let url = `${endpoint}?page=${pageNumber}`;

    for (const key in params) {
      const value = params[key];

      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Nếu là mảng, append từng phần tử
          value.forEach((v) => {
            url += `&${encodeURIComponent(key)}=${encodeURIComponent(v)}`;
          });
        } else {
          // Nếu là kiểu thường (string, number)
          url += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
      }
    }

    console.info("url: ", url);
    return url;
  };

  // const buildUrl = (pageNumber) => {
  //   let url = `${endpoint}?page=${pageNumber}`;
  //   for (const key in params) {
  //     if (params[key]) {
  //       url += `&${key}=${params[key]}`;
  //     }
  //   }
  //   console.info("url: ", url);
  //   return url;
  // };

  const loadItems = async (prePage = 0, isReset) => {
    console.info("loadItems prePage isReset isLoadingItemsRef.current", prePage, isReset, isLoadingItemsRef.current)
    if (isLoadingItemsRef.current) return;
    isLoadingItemsRef.current = true;
    setLoading(true);
    try {
      const httpClient = useAuth ? await authApis() : Apis;
      const url = buildUrl(prePage + 1);
      const res = await httpClient.get(url);
      const result = res.data.results;

      if (!result || result.length === 0) {
        setHasMore(false);
        if (prePage === 0)
          setResultData([])
        else
          return;
      }

      !res.data.next && setHasMore(false);

      setCount(res.data.count)

      if (isReset) {
        setResultData(result)
      } else {
        setResultData(prev => {
          const prevArr = prev || [];
          const prevIds = new Set(prevArr.map(item => item.id));

          // Lọc chỉ giữ item mới có id chưa tồn tại
          const newItems = result.filter(item => !prevIds.has(item.id));

          return [...prevArr, ...newItems];
        });
      }


      setPage(prePage + 1);
    } catch (error) {
      console.error("Load error:", error);
      page === 0 && setResultData([]);
    } finally {
      setLoading(false);
      isLoadingItemsRef.current = false;
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadItems(page);
      // setPage(prev => prev + 1);
    }
  };

  const refresh = () => {
    console.info("refresh: ")
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    setHasMore(true);
    if (isLoadFirstData) {
      loadItems(0, true);
    }
    else {
      setPage(0);
      setResultData([]);
    }
    isRefreshingRef.current = false;
  };

  useEffect(() => {
    isLoadFirstData && loadMore();
  }, [])

  return { resultData, setResultData, loading, loadMore, refresh, hasMore, page, count };
};

export default usePagination;