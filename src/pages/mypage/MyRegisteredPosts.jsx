import MypageListPage from './components/MypageListPage.jsx';
import './Mypage.scss';
import {useAuthStore} from "../../store/authStore.js";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {useState} from "react";
import {apiClient} from "../../api/apiClient.js";

function MyRegisteredPosts() {
    const {token} = useAuthStore();
    const [myPosts, setMyPosts] = useState([]);
    const [total, setTotal] = useState(0);
    const [selectedTab, setSelectedTab] = useState('전체');

    const fetchMyPosts = async (type, status) => {
        const response = await apiClient.get(
            `/mypage/listings`,
            {
                params: {
                    size: 10,
                    ...(type && {type}),
                    ...(status && {status}),
                }
            }
        )
        setTotal(response.data.data.totalElements)
        setMyPosts(response.data.data.content);
        return response.data.data
    }

    const {data, isLoading: myPostsLoading, error: myPostsError} = useQuery({
        queryKey: ['myPosts'],
        queryFn: () => fetchMyPosts(null, null),
    })

    const handleTabChange = (tab) => {

        setSelectedTab(tab);

        let type = null;
        let status = null;

        switch (tab) {
            case '전체': break;
            case '판매 중': type = 'SALE'; status = 'ACTIVE'; break;
            case '나눔 중': type = 'GIVEAWAY'; status = 'ACTIVE'; break;
            case '판매 완료': type = 'SALE'; status = 'SOLD'; break;
            case '나눔 완료': type = 'GIVEAWAY'; status = 'GIVEN'; break;
        }
        fetchMyPosts(type, status)
    }

    return (
        <MypageListPage
            title="내가 등록한 글"
            total={total}
            tabs={['전체', '판매 중', '나눔 중', '판매 완료', '나눔 완료']}
            items={myPosts}
            handleTabChange={handleTabChange}
            selectedTab={selectedTab}
        />
    );
}

export default MyRegisteredPosts;
