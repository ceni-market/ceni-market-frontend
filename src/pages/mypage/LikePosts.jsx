import MypageListPage from './components/MypageListPage.jsx';
import './Mypage.scss';
import {useAuthStore} from "../../store/authStore.js";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {useState} from "react";
import {apiClient} from "../../api/apiClient.js";

function MyRegisteredPosts() {
    const [total, setTotal] = useState(0);
    const [selectedTab, setSelectedTab] = useState('전체');
    const [page, setPage] = useState(0);
    const size = 10;

    const fetchMyLikes = async (type, status) => {
        const response = await apiClient.get(
            `/mypage/likes`,
            {
                params: {
                    page,
                    size,
                    ...(type && {type}),
                    ...(status && {status}),
                }
            }
        )
        setTotal(response.data.data.totalElements)
        return response.data.data
    }

    const {data, isLoading, error} = useQuery({
        queryKey: ['likes', selectedTab, page, size],
        queryFn: () => fetchMyLikes(null, null),
    })

    const handleTabChange = (tab) => {

        setSelectedTab(tab);
        setPage(0);

        let type = null;
        let status = null;

        switch (tab) {
            case '전체': break;
            case '판매 중': type = 'SALE'; status = 'ACTIVE'; break;
            case '나눔 중': type = 'GIVEAWAY'; status = 'ACTIVE'; break;
        }
        fetchMyLikes(type, status)
    }

    return (
        <MypageListPage
            title="관심 상품"
            total={total}
            tabs={['전체', '판매 중', '나눔 중']}
            items={data?.content}
            handleTabChange={handleTabChange}
            selectedTab={selectedTab}
            page={data?.number ?? page}
            totalPages={data?.totalPages ?? 0}
            last={data?.last ?? true}
            onPageChange={setPage}
        />
    );
}

export default MyRegisteredPosts;
