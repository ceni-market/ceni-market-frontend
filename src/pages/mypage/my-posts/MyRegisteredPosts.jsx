import MypageListPage from '../components/MypageListPage.jsx';
import '../Mypage.scss';
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {apiClient} from "../../../api/apiClient.js";

function MyRegisteredPosts() {
    const [total, setTotal] = useState(0);
    const [selectedTab, setSelectedTab] = useState('전체');
    const [page, setPage] = useState(0);
    const size = 10;

    const fetchMyPosts = async (type, status) => {
        const response = await apiClient.get(
            `/mypage/listings`,
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
        queryKey: ['myPosts',selectedTab, page, size],
        queryFn: () => fetchMyPosts(null, null),
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
        fetchMyPosts(type, status)
    }

    return (
        <MypageListPage
            title="내가 등록한 글"
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
