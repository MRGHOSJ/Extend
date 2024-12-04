// -- React and related libs
import React from "react";
import { connect } from "react-redux";
import { Switch, Route, withRouter, Redirect } from "react-router";

// -- Third Party Libs
import PropTypes from "prop-types";

// -- Custom Components
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";
import Breadcrumbs from "../Breadbrumbs/Breadcrumbs";
import Dashboard from "../../pages/dashboard/Dashboard";
import Typography from "../../pages/typography/Typography";
import Notifications from "../../pages/notifications/Notifications";
import Tables from "../../pages/tables/Tables";
import Charts from "../../pages/uielements/charts/Charts";
import Icons from "../../pages/uielements/icons/IconsPage";
import Maps from "../../pages/uielements/maps/google/GoogleMapPage";

// -- Component Styles
import s from "./Layout.module.scss";
import Profile from "../../pages/profile/Profile";
import Wallet from "../../pages/wallet/Wallet";
import Settings from "../../pages/settings/Settings";
import Packets from "../../pages/packets/Packets";
import Packet from "../../pages/packet/Packet";
import AddPacket from "../../pages/addPacket/AddPacket";
import Friends from "../../pages/friends/Friends";
import Voucher from "../../pages/voucher/Voucher";

const Layout = (props) => {
  return (
    <div className={s.root}>
      <div className={s.wrap}>
        <Header />
        <Sidebar />
        <main className={s.content}>
          <Breadcrumbs url={props.location.pathname} />
          <Switch>
            <Route
              path="/app"
              exact
              render={() => <Redirect to="app/dashboard" />}
            />
            <Route path="/app/dashboard" exact component={Dashboard} />
            <Route path="/app/packets" exact component={Packets} />
            <Route path="/app/packets/add" exact component={AddPacket} />
            <Route path="/app/friends" exact component={Friends} />

            <Route
              path="/app/packets/add/:currentPacket"
              exact
              component={AddPacket}
            />

            <Route
              path="/app/packets/:currentPacket"
              exact
              component={Packet}
            />
            <Route path="/app/profile" exact component={Profile} />
            <Route path="/app/voucher" exact component={Voucher} />
            <Route path="/app/wallet" exact component={Wallet} />
            <Route path="/app/settings" exact component={Settings} />
            <Route path="/app/typography" exact component={Typography} />
            <Route path="/app/tables" exact component={Tables} />
            <Route path="/app/notifications" exact component={Notifications} />
            <Route
              path="/app/ui-elements"
              exact
              render={() => <Redirect to={"/app/ui-elements/charts"} />}
            />
            <Route path="/app/ui-elements/charts" exact component={Charts} />
            <Route path="/app/ui-elements/icons" exact component={Icons} />
            <Route path="/app/ui-elements/maps" exact component={Maps} />
            <Route path="*" exact render={() => <Redirect to="/error" />} />
          </Switch>
        </main>
        <Footer />
      </div>
    </div>
  );
};

Layout.propTypes = {
  sidebarOpened: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
  };
}

export default withRouter(connect(mapStateToProps)(Layout));
