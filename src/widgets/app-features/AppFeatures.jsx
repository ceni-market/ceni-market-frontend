import './AppFeatures.scss';

const FEATURES = [
  {
    title: '구성원 인증으로 안전하게',
    desc: ['ITCEN 구성원만 이용할 수 있어', '더욱 안전하고 신뢰할 수 있어요.'],
    image: '/assets/images/features-1.png',
  },
  {
    title: '1:1 채팅으로 편리하게',
    desc: ['관심 있는 상품은 판매자와', '1:1 채팅으로 간편하게 소통하세요.'],
    image: '/assets/images/features-2.png',
  },
  {
    title: '나눔으로 함께 성장해요',
    desc: ['나눔을 통해 따뜻한 마음을 나누고', '함께 성장하는 문화를 만들어요.'],
    image: '/assets/images/features-3.png',
  },
  {
    title: '지속 가능한 거래 문화',
    desc: ['중고 거래와 나눔을 통해', '환경을 생각하는 가치를 실천해요.'],
    image: '/assets/images/features-4.png',
  },
];

function AppFeatures() {
  return (
    <section className="app-features" data-node-id="425:2029">
      <div className="app-features-inner content-container">
        <div className="app-features-list">
          {FEATURES.map((feature) => (
            <article className="app-features-item" key={feature.title}>
              <span className="app-features-icon-box">
                <img className="app-features-icon" src={feature.image} alt="" />
              </span>
              <div className="app-features-copy">
                <h2 className="app-features-title">{feature.title}</h2>
                <p className="app-features-desc">
                  <span className="app-features-desc-line">{feature.desc[0]}</span>
                  <span className="app-features-desc-line">{feature.desc[1]}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AppFeatures;
