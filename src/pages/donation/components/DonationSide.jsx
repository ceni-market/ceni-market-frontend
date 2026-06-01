const DonationSide = ({categories = [], price_filters = [], selectedCategory, handleCategoryChange}) => {
    return (
        <aside className="product-list-sidebar">
            <div className="product-list-filter product-list-category-filter">
                <h2>카테고리</h2>
                <ul>
                    {categories.map((category) => (
                        <li key={category.id ?? 'all'}>
                            <button
                                type="button"
                                onClick={() => handleCategoryChange(category.id)}
                                className={selectedCategory === category.id ? 'is-active' : ''}
                            >
                                <i className="bi bi-tag" />
                                <span>{category.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/*<div className="product-list-filter product-list-price-filter">*/}
            {/*    <h2>가격대</h2>*/}
            {/*    <div className="product-list-price-inputs">*/}
            {/*        <label className="product-list-min-price">*/}
            {/*            <input type="text" disabled={true}/>*/}
            {/*            <span>원</span>*/}
            {/*        </label>*/}
            {/*        <div className="product-list-price-to">~</div>*/}
            {/*        <label className="product-list-max-price">*/}
            {/*            <input type="text" disabled={true}/>*/}
            {/*            <span>원</span>*/}
            {/*        </label>*/}
            {/*    </div>*/}
            {/*    <div className="product-list-price-tags">*/}
            {/*        {price_filters.map((filter) => (*/}
            {/*            <button type="button" key={filter} disabled={true}>*/}
            {/*                {filter}*/}
            {/*            </button>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</div>*/}
        </aside>
    )
}

export default DonationSide;


