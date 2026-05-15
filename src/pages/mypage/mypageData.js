export const productRows = [
  {
    id: 1,
    title: '맥북 에어 M1 13인치',
    category: 'ITㆍ디지털',
    date: '2026.05.06',
    price: '650,000',
    status: '판매중',
    views: 135,
    likes: 12,
    image: '/assets/images/popular-sample.jpeg',
  },
  {
    id: 2,
    title: '맥북 에어 M1 13인치',
    category: 'ITㆍ디지털',
    date: '2026.05.06',
    price: '650,000',
    status: '판매중',
    views: 135,
    likes: 12,
    image: '/assets/images/popular-sample.jpeg',
  },
];

export const mypagePosts = [
  ...productRows,
  {
    id: 3,
    title: '맥북 에어 M1 13인치',
    category: 'ITㆍ디지털',
    date: '2026.05.06 등록',
    price: '650,000',
    status: '거래완료',
    done: true,
    views: 135,
    likes: 12,
    image: '/assets/images/popular-sample.jpeg',
  },
];

export const tradeRows = [
  {
    ...productRows[0],
    status: '판매 완료',
    done: true,
  },
  {
    ...productRows[1],
    status: '구매 완료',
    done: true,
  },
];

export const donationRows = [
  {
    ...productRows[0],
    price: '0',
    status: '나눔 완료',
    done: true,
  },
  {
    ...productRows[1],
    price: '0',
    status: '나눔 중',
  },
];

export const recentTrades = Array.from({ length: 4 }, (_, index) => ({
  id: index + 1,
  title: '맥북 에어 M1 13인치',
  date: '2026.05.06',
  price: '650,000',
  image: '/assets/images/popular-sample.jpeg',
}));
