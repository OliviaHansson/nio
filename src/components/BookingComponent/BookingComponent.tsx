import React from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import moment from 'moment';
import './BookingComponent.scss';
import FormComponent from '../FormComponent/FormComponent';

interface IBookingProps {

}
interface IBooking {
  customer_id: number,
  date: string,
  email: string,
  first_name: string,
  last_name: string,
  order_id: number,
  phone: string,
  seats: number,
  time: string
}

interface IBookingState {
  seats: number,
  date: Date,
  dateString: string,
  form: IForm,
  bookings: IBooking[],
  dateOfToday: [],
  bookingDone: boolean
}

interface IForm {
  time: string,
  firstName: string,
  lastName: string,
  emailAddress: string,
  phoneNumber: string
}

export class BookingComponent extends React.Component<IBookingProps, IBookingState> {
  constructor(props: any) {
    super(props);

    this.state = {
      seats: 2,
      date: new Date(),
      dateString: "",
      form: {
        time: "",
        firstName: "",
        lastName: "",
        emailAddress: "",
        phoneNumber: ""
      },
      bookings: [],
      dateOfToday: [],
      bookingDone: false

    }
    this.disableUnavailableDates = this.disableUnavailableDates.bind(this);
    this.disableUnavailableSeatings = this.disableUnavailableSeatings.bind(this);
    this.submitBooking = this.submitBooking.bind(this);
    this.createGuest = this.createGuest.bind(this);
  }


  async componentDidMount() {
    const label = document.querySelectorAll(".react-calendar__navigation__label");
    label.forEach(oneLabel => {
      oneLabel.setAttribute("disabled", "true");
    })
    await this.readAllOrders();
    this.disableUnavailableDates();
    let todaysDate = moment().format("YYYY-MM-DD") + " 00:00:00";
    if(this.isTodayAvailable(todaysDate)){
      this.setState({dateString: todaysDate})
    }
    this.disableUnavailableSeatings(todaysDate);
  }

  isTodayAvailable(todaysDate: string): boolean{
    let counter = 0;
      for(let i = 0; i < this.state.bookings.length; i++) {
        if(this.state.bookings[i].date === todaysDate) {
          counter++;
          if(counter >= 2) {
            return false;
          }
        }
      }
    return true;
  }

  async readAllOrders() {
    await axios.get("http://localhost:8888/order/readAll.php")
      .then((result: any) => {
        let array = this.state.bookings;
        let data:[] = result.data.records;
        for(let i = 0; i < data.length; i++) {
          array.push(data[i]);
        }
        this.setState({bookings: array});
      });
  }

  

  disableUnavailableDates() {
    const tiles = document.querySelectorAll(".react-calendar__tile");
    tiles.forEach(tile => {
      const abbr = tile!.firstElementChild;
      const date = abbr!.getAttribute("aria-label");

      const trimmedDate = date!.replace(",", "");
      const splitDate = trimmedDate!.split(" ");
      const realDate = splitDate[2] +"-"+ splitDate[1] +"-"+ splitDate[0];
      const yearMonthDateTime = moment(realDate, "YYYY-MMMM-DD").format("YYYY-MM-DD") + " 00:00:00";
      
      let counter = 0;
      for(let i = 0; i < this.state.bookings.length; i++) {
        if(this.state.bookings[i].date === yearMonthDateTime) {
          counter++;

          if(counter >= 2) {
            tile.setAttribute("disabled", "true");
            abbr!.setAttribute("style", "pointer-events: none");
          }
        }
      }
    })
  }
  // deleteOrdersWithPassedDate() {
  //   var todaysDate = moment().format("YYYY-MM-DD");

  //   const splitDate = todaysDate!.split("-");
  //   const newDate1 = parseInt(splitDate[0]);
  //   const newDate2 = parseInt(splitDate[1]);
  //   const newDate3 = parseInt(splitDate[2]);

  //   const todaysDateNew = [];
  //   todaysDateNew.push(newDate1, newDate2, newDate3);
  //   // todaysDateNew.push(newDate2);
  //   // todaysDateNew.push(newDate3);
  //   console.log(todaysDateNew);

  //   axios.get("http://localhost:8888/order/readAll.php")
  //     .then((result: any) => {
  //       let data:[] = result.data.records;
  //       const formerDates = [];

  //       for(let i = 0; i < data.length; i++) {
  //         const passedReservations = this.state.bookings[i].date;
  //         const splitDate = passedReservations!.split(" ");
  //         const separateDate = splitDate[0];
  //         const separate2 = separateDate!.split("-");

  //         const sep1 = parseInt(separate2[0]);
  //         const sep2 = parseInt(separate2[1]);
  //         const sep3 = parseInt(separate2[2]);
  //         formerDates.push(sep1, sep2, sep3);
  //         // console.log(formerDates);
  //       }

  //     })
  //     // var a = moment(todaysDateNew);
  //     //   var b = moment(formerDates);
  //     //   let difference = a.diff(b, 'days');
  //     //   // var duration = moment.duration(todaysDateNew.diff(formerDates))
  //     //   console.log(difference);

  // }

  disableUnavailableSeatings = (date:any) => {
    document.getElementById("earlyButton")!.removeAttribute("disabled");
    document.getElementById("lateButton")!.removeAttribute("disabled");

    let earlyCounter = 0;
    let lateCounter = 0;

    for(let i = 0; i < this.state.bookings.length; i++) {
      if(this.state.bookings[i].date === date ) {
        if(this.state.bookings[i].time === "18:00") {
          earlyCounter++;
        } else if (this.state.bookings[i].time === "21:00") {
          lateCounter++;
        }
        
        if(earlyCounter >= 1) {
          document.getElementById("earlyButton")!.setAttribute("disabled", "true");
        }
        if(lateCounter >= 1) {
          document.getElementById("lateButton")!.setAttribute("disabled", "true");
        }
      }
    }
  }

  // TODO: HEAVY REFRACTOR

  setSeats = (seatNumber: any) => {
    this.setState({seats: seatNumber.target.value}, this.handleBooking);
  }
  datePick = (pickedDate: any) => {
    const splitDate = pickedDate!.toString().split(" ");
    const realDate = splitDate[3] +"-"+ splitDate[1] +"-"+ splitDate[2];
    const date = moment(realDate, "YYYY-MMM-DD").format("YYYY-MM-DD") + " 00:00:00";
    
    this.setState({dateString: date});
    this.disableUnavailableSeatings(date);

    let previousForm = {...this.state.form};
    previousForm.time = "";
    this.setState({form: previousForm});
  }

  handleForm = (formContent: IForm) => {
    this.setState({form: formContent}, this.handleBooking);
    this.setState({bookingDone: true});
    console.log();
  }

  handleBooking = () => {
    this.submitBooking();
  }

  async createOrder(customerId: string){
    await axios({
      method: "POST",
      url: "http://localhost:8888/order/create.php",
      data: JSON.stringify({
        date: this.state.dateString,
        customer_id: customerId,
        time: this.state.form.time,
        seats: this.state.seats
      })
    })
  }

  async getGuestId(): Promise<any> {
    return await axios({
      method: "GET",
      url: "http://localhost:8888/guest/search.php?s=" + this.state.form.emailAddress
    })
    .then(function(response){
      return response.data.records[0].id;
    })
  }

  async createGuest() {
    await axios({
      method: "POST",
      url: "http://localhost:8888/guest/createCustomer.php",
      data: JSON.stringify({
        first_name: this.state.form.firstName,
        last_name: this.state.form.lastName,
        email: this.state.form.emailAddress,
        phone: this.state.form.phoneNumber
        })
      }
    )
    .then(function(response){
      //console.log(response);
    });
  }

  async checkIfGuestAlreadyExists(): Promise<boolean> {
    let res;
    await axios({
      method: "GET",
      url: "http://localhost:8888/guest/search.php?s=" + this.state.form.emailAddress
    })
    .then(function(response) {
      //console.log(response);
      res = response;
    })
    .catch(function(){});
    if(res === undefined){
      return false;
    } else {
      return true;
    }
  }

  sendEmail() {
    let dateForEmail = this.state.dateString.split(" ");
    axios({
      method: "POST",
      url: "http://localhost:8888/email/sendEmail.php",
      data: JSON.stringify({
        first_name: this.state.form.firstName,
        last_name: this.state.form.lastName,
        email: this.state.form.emailAddress,
        date: dateForEmail[0],
        time: this.state.form.time,
        seats: this.state.seats
      })
    })
  }

  submitBooking = async () => {
    let isGuestExisting: boolean;
    let guestId: string;
    isGuestExisting = await this.checkIfGuestAlreadyExists()
    if(!isGuestExisting){
      await this.createGuest();
    }
    guestId = await this.getGuestId();

    await this.createOrder(guestId);
    this.sendEmail();

  }
  render() {
    let name = this.state.form.firstName;
    let dateForConfirmation = this.state.dateString.split(" ");
    let time = this.state.form.time;
    let seats = this.state.seats;

    let booking: any;

    if (this.state.bookingDone === true) {
      booking = 
        <div className="confirmSpace">
          <h2>Tack {name} för din bokning!</h2>
          <p>En bekräftelse är påväg till den e-mail du angav.</p>
          <p>Du har bokat bord den {dateForConfirmation[0]}klockan {time} för {seats} person(er)</p>
          <p>Vi på restaurang nio ser framemot din vistelse hos oss.</p>
          <p>Ses snart!</p>
          <p>/nio</p>
          <p className="finstilta">Om du önskar att ändra eller avboka din bordsbokning så är det bara</p>
          <p className="finstilta">att höra av sig till oss på +46(0) 820 50 10</p>

        </div>
    }else {
      booking =
        <div>
          <h1 className="booking__heading">Boka</h1>
          <section className="booking__guests">
            <select onChange={this.setSeats}
              value={this.state.seats}>
              <option value="1">1 person</option>
              <option value="2">2 personer</option>
              <option value="3">3 personer</option>
              <option value="4">4 personer</option>
              <option value="5">5 personer</option>
              <option value="6">6 personer</option>
            </select>
          </section>
          <section className="booking__calendar">
            <Calendar
              onChange={this.datePick}
              onActiveDateChange={this.disableUnavailableDates}
              value={this.state.date}
              minDate= {new Date()}
            />
          </section>
          <section className="booking__form">
            <FormComponent 
            formSubmit={this.handleForm}
             pickedDate={this.state.dateString} />
          </section>
        </div>
    }
    return (
      <main id="booking">
        {booking}
      </main>
    );
  }
}
export default BookingComponent;