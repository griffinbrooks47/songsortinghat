import './subnavbar.css'

export const SubNavbar = () => {
    return (
        <ul className='subnav'>
            <li className='subnav-item'>
                <a className='subnav-item-tag'>
                    Top 10
                </a>
            </li>
            <li className='subnav-item'>
                <a className='subnav-item-tag'>
                    Top 20
                </a>
            </li>
            <li className='subnav-item'>
                <a className='subnav-item-tag'>
                    All
                </a>
            </li>
        </ul>
    )
}