import React from 'react';

export default class NormalButton extends React.Component {
  constructor(props) {
    super(props);
    console.log("NormalButton constructor called!");
    this.state = {
      disabled: false,
    };
    this.onButtonClick = this.onButtonClick.bind(this);
  }
  onButtonClick() {
    console.log(this.state);
    if (this.state.disabled) {
      console.log('NormalButton: button disabled ==> ignoring click');
    }
    else {
      console.log('NormalButton: button click accepted.');
      this.props.onButtonClick();
      this.setState({ disabled: true });
      setTimeout(()=>{
        this.setState({ disabled: false });
        console.log('NormalButton: re-enabling button');
      }, this.props.disableTime);
    }
  }

  render() {
    return (
      <button
        style={this.props.buttonStyle}
        onClick={this.onButtonClick}
      >
        {this.props.children}
      </button>
    )
  }
}
