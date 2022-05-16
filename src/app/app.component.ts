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
  isSubmitted = false;


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
      comment : [""]
    })
    this.friends.push(friend)
  }

  onDeleteFriend(i:number){
    this.friends.removeAt(i);
  }

  submitTrue(){
    this.isSubmitted = true
  }

  onSubmit(){
    this.totalBill = 0
    this.individualBill = 0
    console.log(this.billForm.value)
    this.billForm.value["friends"].forEach( (e:{friendName:string,paidAmt:number,comment:string}) => {
      this.totalBill = this.totalBill + e["paidAmt"]
    });
    this.individualBill = this.totalBill / this.billForm.value["friends"].length
  }

  onCopy(){
    this.onSubmit()
    let header = "Bill for " + this.billForm.value["place"]
    let paymentPart1 = ""
    let paymentPart2 = "Bill = "
    let paymentPart3 = "= $" + this.totalBill
    let paymentPart4 = ""
    this.billForm.value["friends"].forEach( (e:{friendName:string,paidAmt:number,comment:string}) =>{

      if (e["paidAmt"] > 0 || e["paidAmt"] < 0){
        paymentPart1 = paymentPart1 + e["friendName"] +" paid $" + e["paidAmt"] + " (" + e["comment"] + ")" +"\n"
        paymentPart2 = paymentPart2 + "+ $" + e["paidAmt"] + " "

        paymentPart4 = paymentPart4
                      + e["friendName"]
                      + " bill = $" + this.roundNumber(this.individualBill)
                      + " - $" + this.roundNumber(e["paidAmt"])
                      + " = $" + this.roundNumber(this.individualBill - e["paidAmt"])
                      + "\n"
      }
      else {
        paymentPart4 = paymentPart4
        + e["friendName"]
        + " bill = $" + this.roundNumber(this.individualBill)
        + "\n"
      }


    })

    console.log(header)
    console.log(paymentPart1)
    console.log(paymentPart2)
    console.log(paymentPart3)
    console.log(paymentPart4)

    const copyString = header + "\n\n"
                      + paymentPart1
                      + "\n" + paymentPart2
                      + "\n" + paymentPart3 + "\n"
                      + "\n" + paymentPart4

    navigator.clipboard.writeText(copyString)
      .then( (sucess) =>{
        console.log("copy successfully");
      },
      (error) =>{
        console.log("copy failed");
      });
  }


  private roundNumber(num: number){
    return Math.round((num + Number.EPSILON) * 100) / 100
  }
}
