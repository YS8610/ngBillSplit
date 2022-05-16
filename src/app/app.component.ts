import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ngBillSplit';

  billForm !: FormGroup;
  totalBill = 0;
  individualBill = 0;
  IsSubmitted = false;


  constructor(private fb : FormBuilder){}


  ngOnInit(): void {
    this.billForm = this.fb.group({
      place: ["",[Validators.required,Validators.minLength(3)]],
      friends : this.fb.array([
        this.fb.group({
          friendName : ["",Validators.required],
          paidAmt : [0,Validators.required],
          comment : ""
        })
      ])
    })
  }

  get friends(){
    return this.billForm.controls["friends"] as FormArray;
  }

  onAddFriend(){
    const friend = this.fb.group({
      friendName : ["",Validators.required],
      paidAmt : [0,Validators.required],
      comment : ""
    })
    this.friends.push(friend)
  }

  onDeleteFriend(i:number){
    this.friends.removeAt(i);
  }

  onSubmit(){
    this.IsSubmitted=true
    this.totalBill = 0
    this.individualBill = 0
    console.log(this.billForm.value)
    this.billForm.value["friends"].forEach( (e:{friendName:string,paidAmt:number,comment:string}) => {
      this.totalBill = this.totalBill + e["paidAmt"]
    });
    this.individualBill = this.totalBill / this.billForm.value["friends"].length
    console.log("total bill = %f",this.totalBill)
    console.log("individual bill = %f", this.individualBill)
  }


}
