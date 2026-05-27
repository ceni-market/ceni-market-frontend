import MypageListPage from './components/MypageListPage.jsx';
import {tradeRows} from './mypageData.js';
import './Mypage.scss';
import {useState} from "react";
import {apiClient} from "../../api/apiClient.js";
import {useQuery} from "@tanstack/react-query";

function TradeHistory() {
    const [trads, setTrads] = useState([]);
    const [total, setTotal] = useState(0);
    const [selectedTab, setSelectedTab] = useState('전체');

    const fetchMyPosts = async (role) => {
        const response = await apiClient.get(
            `/mypage/transactions`,
            {
                params: {
                    size: 10,
                    ...(role && {role}),
                }
            }
        )
        setTotal(response.data.data.totalElements)
        setTrads(response.data.data.content);
        return response.data.data
    }

    const {data, isLoading: myPostsLoading, error: myPostsError} = useQuery({
        queryKey: ['trades'],
        queryFn: () => fetchMyPosts(null, null),
    })

    const handleTabChange = (tab) => {

        setSelectedTab(tab);

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
        fetchMyPosts(role)
    }

    return (
        <MypageListPage
            title="거래 내역"
            total={total}
            tabs={['전체', '판매 완료', '구매 완료']}
            items={trads}
            handleTabChange={handleTabChange}
            selectedTab={selectedTab}
        />
    );
}

export default TradeHistory;
