export const pageButtonRenderer = ({
    page,
    active,
    disable,
    title,
    onPageChange
}) => {
    const handleClick = (e) => {
        e.preventDefault();
        onPageChange(page);
    };
    const activeStyle = {};
    if (active) {
        activeStyle.backgroundColor = '#ff2e63f2';
        activeStyle.color = 'white';
    } else {
        activeStyle.backgroundColor = '#ffc2c2';
        activeStyle.color = 'black';
    }
    if (typeof page === 'string') {
        activeStyle.backgroundColor = 'white';
        activeStyle.color = 'black';
    }
    return (
        <li className="page-item">
            <a href="#" onClick={handleClick} className="page-link" style={activeStyle}>{page}</a>
        </li>
    );
};