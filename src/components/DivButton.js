import React from 'react';

export default class DivButton extends React.Component {
  constructor(props) {
    super(props);
    console.log("DivButton constructor called!");
    this.state = {
      disabled: false,
    };
    this.onButtonClick = this.onButtonClick.bind(this);
    this.disableButtonTimeout = null;
  }
  onButtonClick() {
    console.log(this.state);
    if (this.state.disabled) {
      console.log('DivButton: button disabled ==> ignoring click');
    }
    else {
      console.log('DivButton: button click accepted.');
      this.props.onButtonClick();
      this.setState({ disabled: true });
      this.disableButtonTimeout = setTimeout(()=>{
        this.setState({ disabled: false });
        console.log('DivButton: re-enabling button');
      }, this.props.disableTime);
    }
  }
  componentWillUnmount() {
    clearTimeout(this.disableButtonTimeout);
  }
  render() {
    return (
      <div
        className={this.props.className}
        style={this.props.buttonStyle}
        onClick={this.onButtonClick}
      >
        {this.props.children}
      </div>
    )
  }
}
