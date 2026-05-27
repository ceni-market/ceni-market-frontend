import MypageListPage from './components/MypageListPage.jsx';
import './Mypage.scss';
import {useAuthStore} from "../../store/authStore.js";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {useState} from "react";

function MyRegisteredPosts() {
    const {token} = useAuthStore();
    const [likes, setLikes] = useState([]);
    const [total, setTotal] = useState(0);
    const [selectedTab, setSelectedTab] = useState('전체');

    const fetchMyPosts = async (type, status) => {
        const response = await axios.get(
            `https://api.ceni-market.site/api/mypage/likes`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    size: 10,
                    ...(type && {type}),
                    ...(status && {status}),
                }
            }
        )
        setTotal(response.data.data.totalElements)
        setLikes(response.data.data.content);
        return response.data.data
    }

    const {data, isLoading: myPostsLoading, error: myPostsError} = useQuery({
        queryKey: ['likes'],
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
        }
        fetchMyPosts(type, status)
    }

    return (
        <MypageListPage
            title="관심 상품"
            total={total}
            tabs={['전체', '판매 중', '나눔 중']}
            items={likes}
            handleTabChange={handleTabChange}
            selectedTab={selectedTab}
        />
    );
}

export default MyRegisteredPosts;
