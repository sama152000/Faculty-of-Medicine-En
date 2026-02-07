import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MedicineFooterComponent } from "./Pages/shared/medicine-footer/medicine-footer.component";
import { HeaderComponent } from "./Pages/shared/header/header.component";
@Component({
  selector: 'app-Faculty-of-Medicine',
  templateUrl: './Faculty-of-Medicine.component.html',
  styleUrls: ['./Faculty-of-Medicine.component.css'],
  imports: [RouterOutlet, MedicineFooterComponent, HeaderComponent]
})
export class FacultyOfMedicineComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    ////////////
  }

}
