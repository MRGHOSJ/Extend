import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import s from "./Sidebar.module.scss";
import LinksGroup from "./LinksGroup/LinksGroup.js";
import { changeActiveSidebarItem } from "../../actions/navigation.js";
import SofiaLogo from "../Icons/SofiaLogo.js";
import cn from "classnames";

const Sidebar = (props) => {

  const {
    activeItem = '',
    ...restProps
  } = props;

  const [burgerSidebarOpen, setBurgerSidebarOpen] = useState(false)

  useEffect(() => {
    if (props.sidebarOpened) {
      setBurgerSidebarOpen(true)
    } else {
      setTimeout(() => {
        setBurgerSidebarOpen(false)
      }, 0);
    }
  }, [props.sidebarOpened])

  return (
    <nav className={cn(s.root, {[s.sidebarOpen]: burgerSidebarOpen})} >
      <header className={s.logo}>
        <span className={s.title}>EXTEND</span>
      </header>
      <ul className={s.nav}>
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Dashboard"
          isHeader
          iconName={<i className={'eva eva-home-outline'}/>}
          link="/app/dashboard"
          index="dashboard"
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Packets"
          isHeader
          iconName={<i className={'eva eva-book-outline'} />}
          link="/app/packets"
          index="packets"
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Profile"
          isHeader
          iconName={<i className={'eva eva-person-outline'} />}
          link="/app/profile"
          index="profile"
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Wallet"
          isHeader
          iconName={<i className={'eva eva-folder-outline'} />}
          link="/app/wallet"
          index="wallet"
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Settings"
          isHeader
          iconName={<i className={'eva eva-settings-outline'} />}
          link="/app/settings"
          index="settings"
        />
      </ul>
    </nav>
  );
}

Sidebar.propTypes = {
  sidebarOpened: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  activeItem: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    activeItem: store.navigation.activeItem,
  };
}

export default withRouter(connect(mapStateToProps)(Sidebar));
