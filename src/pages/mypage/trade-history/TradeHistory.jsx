import MypageListPage from '../components/MypageListPage.jsx';
import '../Mypage.scss';
import {useState} from "react";
import {apiClient} from "../../../api/apiClient.js";
import {useQuery} from "@tanstack/react-query";

function TradeHistory() {
    const [total, setTotal] = useState(0);
    const [selectedTab, setSelectedTab] = useState('전체');
    const [page, setPage] = useState(0);
    const size = 10;

    const fetchMyTrades = async (role) => {
        const response = await apiClient.get(
            `/mypage/transactions`,
            {
                params: {
                    page,
                    size,
                    ...(role && {role}),
                }
            }
        )
        setTotal(response.data.data.totalElements)
        return response.data.data
    }

    const {data, isLoading, error} = useQuery({
        queryKey: ['trades', selectedTab, page, size],
        queryFn: () => fetchMyTrades(null, null),
    })

    const handleTabChange = (tab) => {

        setSelectedTab(tab);
        setPage(0);

        let role = null;

        switch (tab) {
            case '전체':
                break;
            case '판매 완료':
                role = 'SELLER';
                break;
            case '구매 완료':
                role = 'BUYER';
                break;
        }
        fetchMyTrades(role)
    }

    return (
        <MypageListPage
            title="거래 내역"
            total={total}
            tabs={['전체', '판매 완료', '구매 완료']}
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

export default TradeHistory;
