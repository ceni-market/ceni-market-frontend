import MypageListPage from '../components/MypageListPage.jsx';
import '../Mypage.scss';
import {useState} from "react";
import {apiClient} from "../../../api/apiClient.js";
import {useQuery} from "@tanstack/react-query";

function DonationPosts() {
    const [total, setTotal] = useState(0);
    const [selectedTab, setSelectedTab] = useState('전체');
    const [page, setPage] = useState(0);
    const size = 10;

    const getRoleByTab = (tab) => {
        switch (tab) {
            case '나눔한 글':
                return 'SELLER';
            case '나눔받은 글':
                return 'BUYER';
            default:
                return null;
        }
    };

    const fetchMyDonations = async (role) => {
        const response = await apiClient.get(
            `/mypage/transactions`,
            {
                params: {
                    page,
                    size,
                    type: 'GIVEAWAY',
                    ...(role && {role}),
                }
            }
        )
        setTotal(response.data.data.totalElements)
        return response.data.data
    }

    const {data, isLoading, error} = useQuery({
        queryKey: ['donations', selectedTab, page, size],
        queryFn: () => fetchMyDonations(getRoleByTab(selectedTab)),
    })

    const handleTabChange = (tab) => {

        setSelectedTab(tab);
        setPage(0);
    }

    return (
        <MypageListPage
            title="나눔 내역"
            total={total}
            tabs={['전체', '나눔한 글', '나눔받은 글']}
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

export default DonationPosts;
