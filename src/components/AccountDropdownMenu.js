import React from 'react';
import {ButtonDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import '../styles/CardStyles.css';

export default class AccountDropdownMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuActive: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }
  toggleMenu() {
    this.setState({menuActive: !this.state.menuActive});
  }
  render() {
    let children = React.Children.toArray(this.props.children);
    return (
      <Dropdown isOpen={this.state.menuActive} toggle={this.toggleMenu}>
        <div
          onClick={this.toggleMenu}
        >
          {children[0]}
        </div>
        <DropdownMenu right>
          <DropdownItem header>My account</DropdownItem>
          <DropdownItem disabled>Profile</DropdownItem>
          <DropdownItem>
            <div onClick={this.props.onSettingsClick}>
              Settings
            </div>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem>
            <div onClick={this.props.onLogoutClick}>
              Log out
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}
