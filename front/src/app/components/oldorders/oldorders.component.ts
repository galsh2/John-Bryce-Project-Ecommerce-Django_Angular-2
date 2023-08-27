import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-oldorders',
  templateUrl: './oldorders.component.html',
  styleUrls: ['./oldorders.component.css']
})
export class OldordersComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getUserOrders().subscribe(data => {
      if (data === null || data.length === 0) {
        console.log('data is null');
      } else {
        this.orderService.getUserOrders().subscribe(data => {
          this.orders = data;
          console.log(data);
        });
      }

    });
  }
}
