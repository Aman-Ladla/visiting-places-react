import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import Backdrop from "../UIElements/Backdrop";
import MainHeader from "./MainHeader";
import "./MainNavigation.css";
import NavigationLinks from "./NavigationLinks";
import SideDrawer from "./SideDrawer";

const MainNavigation = () => {
    const [drawerIsOpen, setDrawerOpen] = useState(false);

    const openDrawerHandler = () => {
        setDrawerOpen(true);
    };

    const closeDrawerHandler = () => {
        setDrawerOpen(false);
    };

    return (
        <Fragment>
            {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
            <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
                <nav className="main-navigation__drawer-nav">
                    <NavigationLinks />
                </nav>
            </SideDrawer>
            <MainHeader>
                <button
                    className="main-navigation__menu-btn"
                    onClick={openDrawerHandler}
                >
                    <span />
                    <span />
                    <span />
                </button>
                <h1 className="main-navigation__title">
                    <Link to="/">Visiting Places</Link>
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavigationLinks />
                </nav>
            </MainHeader>
        </Fragment>
    );
};

export default MainNavigation;
