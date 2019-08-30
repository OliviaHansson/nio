import React from 'react';
import './FormComponent.scss';

interface IFormProps {

}

interface IFormState {
  [key: string]: string
}

export class FormComponent extends React.Component<IFormProps, IFormState> {
  constructor(props: any) {
    super(props);

    this.state = {
      time: "",
      firstName: "",
      lastName: "",
      emailAddress: "",
      phoneNumber: ""
    }
  }

  handleChange = (e: any) => {
    const target = e.target;
    const value = target.value;
    console.log(value);
    
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  createBooking = (e: any) => {
    console.log(this.state);
  }

  render() {
    return (
      <form onSubmit={this.createBooking}>
        <input type="radio" name="time" className="form__radiobutton" 
          value="18:00"
          checked={this.state.time === "18:00"} 
          onChange={this.handleChange} />

        <p className="form__radioText">18:00</p>

        <input type="radio" name="time" className="form__radiobutton" 
          value="21:00"
          checked={this.state.time === "21:00"} 
          onChange={this.handleChange} />

        <p className="form__radioText">21:00</p>
        
        <label htmlFor="firstName">Name:</label>
        <input type="text" className="form__textbox" 
          name="firstName" 
          onChange={this.handleChange} />
        <label htmlFor="lastName">Last name:</label>
        <input type="text" className="form__textbox" 
          name="lastName" 
          onChange={this.handleChange} />
        <label htmlFor="emailAddress">E-mail:</label>
        <input type="text" className="form__textbox" 
          name="emailAddress"
          onChange={this.handleChange} />
        <label htmlFor="phoneNumber">Phone:</label>
        <input type="number" className="form__textbox" 
          name="phoneNumber"
          onChange={this.handleChange} />

        <input type="button" value="Submit"
          onClick={this.createBooking} />
      </form>
    );
  }
}

export default FormComponent;