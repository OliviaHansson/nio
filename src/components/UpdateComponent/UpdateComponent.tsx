import React from 'react';
import './UpdateComponent.scss';

interface IBooking {
  customer_id: number,
  date: string,
  email: string,
  first_name: string,
  last_name: string,
  order_id: number,
  phone: number,
  seats: number,
  time: string
}

interface IUpdateProps {
  booking: IBooking,
  updateOrder(state:any): void 
}

interface IUpdateState {
  [key: string]: string
}

export class UpdateComponent extends React.Component<IUpdateProps, IUpdateState> {
  constructor(props: IUpdateProps) {
    super(props);

    const customer_idString = this.props.booking.customer_id.toString();
    const order_idString = this.props.booking.order_id.toString();
    const seatsString = this.props.booking.seats.toString();

    this.state = {
      first_name: "",
      last_name: "",
      phone: "",
      customer_id: customer_idString,
      date: this.props.booking.date,
      email: this.props.booking.email,
      order_id: order_idString,
      seats: seatsString,
      time: this.props.booking.time
    }
  }
  
  handleChange = (e: any) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
    console.log(value);
  }

  updateBooking = () => {
    let editState = {...this.state};
    if(this.state.first_name === "") {
      editState.first_name = this.props.booking.first_name;
    }
    if(this.state.last_name === "") {
      editState.last_name = this.props.booking.last_name;
    }
    if(this.state.phone === "") {
      editState.phone = this.props.booking.phone.toString();
    }
    this.props.updateOrder(editState);
  }

  render() {

    return (
      <form id="update">
        <ul className="update__credentials">
          <li className="update__row">
            <label htmlFor="first_name">Namn:</label>
            <input type="text" className="update__textbox" 
              name="first_name" 
              onChange={this.handleChange} 
              defaultValue={this.props.booking.first_name}
              pattern="[a-z]\w{4,}\d+" required/>
          </li>
          <li className="update__row">
            <label htmlFor="last_name">Efternamn:</label>
            <input type="text" className="update__textbox" 
              name="last_name" 
              onChange={this.handleChange} 
              defaultValue={this.props.booking.last_name}
              pattern="[a-z]\w{4,}\d+" required/>
          </li>
          <li className="update__row">
            <label htmlFor="phone">Telefon:</label>
            <input type="number" className="update__textbox" 
              name="phone"
              onChange={this.handleChange} 
              defaultValue={this.props.booking.phone.toString()}
              required/>
          </li>
          
          {/* <input type="checkbox"/> */}
          <input type="button" className="update__submit" value="Uppdatera"
            onClick={this.updateBooking} />
        </ul>
      </form>
    );
  }
}

export default UpdateComponent;