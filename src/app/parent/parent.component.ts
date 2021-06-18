import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {

  locale: string = 'en';
  selectedDate: any;
  displayDate: string = "";
  toggleDatePicker: boolean = false;

  constructor() { }

  ngOnInit() {
    const date = new Date();
    this.displayDate = date.getDate() + "/"+(date.getMonth()+1)+"/"+date.getFullYear();
  }

  setSelectedDate(date){
    this.selectedDate = date;
    console.log(this.selectedDate.format('DD/MM/yyyy'));
    this.displayDate = this.selectedDate.format('DD/MM/yyyy');
  }

  canChangeMonthLogic(num, currentDate){
    currentDate.add(num, 'month');
    const minDate = moment().add(-1, 'month');
    const maxDate = moment().add(1, 'year');
    
    return currentDate.isBetween(minDate, maxDate);
  }

  isAvailableLogic(dateToCheck: any){
    if(dateToCheck.isBefore(moment(), 'day')){
      return false;
      } else {
          return true;
      }
  }

  toggleCalendar(){
    this.toggleDatePicker = !this.toggleDatePicker;
  }

}
