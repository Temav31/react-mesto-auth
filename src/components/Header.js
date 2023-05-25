import React from "react";
import headerLogo from '../image/logo1.svg';

function Header() {
    return (
        <header className="header">
            <img
                src={headerLogo}
                alt="Логотип"
                className="header__logo"
            />
        </header>
    )
}
export default Header;