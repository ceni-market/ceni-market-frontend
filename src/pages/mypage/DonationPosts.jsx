import MypageListPage from './components/MypageListPage.jsx';
import {donationRows} from './mypageData.js';
import './Mypage.scss';
import {useState} from "react";
import {apiClient} from "../../api/apiClient.js";
import {useQuery} from "@tanstack/react-query";

function DonationPosts() {
    const [donations, setDonations] = useState([]);
    const [total, setTotal] = useState(0);
    const [selectedTab, setSelectedTab] = useState('전체');

    const fetchMyPosts = async (role, type) => {
        const response = await apiClient.get(
            `/mypage/transactions`,
            {
                params: {
                    size: 10,
                    ...(role && {role}),
                    ...(type && {type}),
                }
            }
        )
        setTotal(response.data.data.totalElements)
        setDonations(response.data.data.content);
        return response.data.data
    }

    const {data, isLoading: myPostsLoading, error: myPostsError} = useQuery({
        queryKey: ['donations'],
        queryFn: () => fetchMyPosts(null, null),
    })

    const handleTabChange = (tab) => {

        setSelectedTab(tab);

        let role = null;
        let type = 'GIVEAWAY';

        switch (tab) {
            case '전체':
                break;
            case '나눔한 글':
                role = 'SELLER';
                break;
            case '나눔받은 글':
                role = 'BUYER';
                break;
        }
        fetchMyPosts(role, type)
    }

    return (
        <MypageListPage
            title="나눔 관리"
            total={total}
            tabs={['전체', '나눔한 글', '나눔받은 글']}
            items={donations}
            handleTabChange={handleTabChange}
            selectedTab={selectedTab}
        />
    );
}

export default DonationPosts;
