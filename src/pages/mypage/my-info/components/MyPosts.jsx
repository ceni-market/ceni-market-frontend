import {NavLink} from "react-router-dom";
import MypagePostRow from "../../components/MypagePostRow.jsx";

const MyPosts = ({myPosts = []}) => {
    return (
        <section className="mypage-posts-panel">
            <div className="mypage-posts-tabs">
                <button className="is-active" type="button">내가 등록한 글</button>
            </div>

            <div className="mypage-posts-list">
                {myPosts.map((post) => (
                    <MypagePostRow item={post} key={post.id} />
                ))}
            </div>

            <NavLink className="mypage-more-link" to="/mypage/posts">
                더보기 &gt;
            </NavLink>
        </section>
    );
}

export default MyPosts;