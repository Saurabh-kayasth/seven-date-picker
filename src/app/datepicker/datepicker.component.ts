import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit {

  @Input() locale: string;
  @Input() canChangeNavMonthLogic: any;
  @Input() isAvailableLogic: any;
  arrow: string = "&#9660;";

  @Output() emitSelectedDate = new EventEmitter<any>();

  navDate: any;
  weekDaysHeaderArr: Array<string> = [];
  gridArr: Array<any> = [];
  selectedDate: any;
  isYear: boolean = false;
  activeYear: number;
  yearGrid: Array<any> = [];

  constructor() { }

  ngOnInit() {
    moment.locale(this.locale);
    this.navDate = moment();
    this.makeHeader();
    this.makeGrid();    
    // console.log(this.navDate.format("YYYY"));
    this.activeYear = parseInt(this.navDate.format("YYYY"));
    // console.log(this.activeYear);
    this.generateYearGrid(this.activeYear);
  }

  generateYearGrid(activeYear: number){
    const gridStartYear = activeYear - 10; 
    const gridEndYear = activeYear + 9;
    for(let i = gridStartYear; i <= gridEndYear;i++){
      this.yearGrid.push(i);
    }
    // console.log(this.yearGrid);
  }

  handleYearClick(currentYear: number){
    this.yearGrid = [];
    this.activeYear = currentYear;
    this.generateYearGrid(currentYear);
    this.toggleYearContainer();
    this.navDate.set("year",this.activeYear);
    this.makeGrid();
  }

  changeNextYear(){
    this.yearGrid = [];
    this.activeYear += 20;
    this.generateYearGrid(this.activeYear);
  }

  changePreviousYear(){
    this.yearGrid = [];
    this.activeYear -= 20;
    this.generateYearGrid(this.activeYear);
  }

  changeNavMonth(num: number){
    // if(this.canChangeNavMonth(num)){
      this.navDate.add(num, 'month');
      this.makeGrid();
    // }
  }

  canChangeNavMonth(num: number){    
    if(this.canChangeNavMonthLogic){      
      const clonedDate = moment(this.navDate);
      return this.canChangeNavMonthLogic(num, clonedDate);      
    } else {
      return true;
    }
  }

  makeHeader(){
    const weekDaysArr: Array<number> = [0, 1, 2, 3, 4, 5, 6];
    weekDaysArr.forEach(day => this.weekDaysHeaderArr.push(moment().weekday(day).format('ddd')));
  }

  makeGrid(){
    this.gridArr = [];
    this.activeYear = parseInt(this.navDate.format("YYYY"));

    const firstDayDate = moment(this.navDate).startOf('month');
    const initialEmptyCells = firstDayDate.weekday();
    const lastDayDate = moment(this.navDate).endOf('month');
    const lastEmptyCells = 6 - lastDayDate.weekday();
    const daysInMonth = this.navDate.daysInMonth();
    const arrayLength = initialEmptyCells + lastEmptyCells + daysInMonth;

    for(let i = 0; i < arrayLength; i++){
      let obj: any = {};
      if(i < initialEmptyCells || i > initialEmptyCells + daysInMonth -1){
        obj.value = 0;
        obj.available = false;
      } else {
        obj.value = i - initialEmptyCells +1;
        obj.available = this.isAvailable(i - initialEmptyCells +1);
      }
      this.gridArr.push(obj);
    }
  }

  isAvailable(num: number): boolean{
    if(this.isAvailableLogic){
      let dateToCheck = this.dateFromNum(num, this.navDate);
      return this.isAvailableLogic(dateToCheck);
    } else {
      return true;
    }    
  }

  dateFromNum(num: number, referenceDate: any): any{
    let returnDate = moment(referenceDate);
    return returnDate.date(num);
  }

  selectDay(day: any){
    // if(day.available){
      this.selectedDate = this.dateFromNum(day.value, this.navDate);
      this.emitSelectedDate.emit(this.selectedDate);
    // }
  }

  toggleYearContainer(){
    this.isYear = !this.isYear;
    if(!this.isYear){
      this.arrow = "&#9660";
    }
    else {
      this.arrow = "&#9650";
    }
  }

}
