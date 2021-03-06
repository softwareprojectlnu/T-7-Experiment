import { Subscription } from 'rxjs/Subscription';
import { ShoppingCartService } from './../services/shopping-cart.service';
import { Product } from './../models/product';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input('product') product: Product;
  subscription: Subscription;
  ordered = 0;
  percent = 0;

  constructor(private cart: ShoppingCartService) { }

  ngOnInit() {
    if (this.product.key) {
      this.subscription = this.cart.getItem(this.product.key).subscribe(cartItem => {
        if (cartItem !== null) this.ordered = cartItem['amount'];
      });
    }
    if (this.product.onSale) {
      this.percent = this.product.oldPrice - this.product.price;
      this.percent = (this.percent / this.product.oldPrice) * 100;
    }
  }
  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  increase(){
    this.ordered++;
    this.amountChanged();
  }
  decrease(){
    this.ordered--;
    this.amountChanged();
  }

  amountChanged(){
    if(this.product.key){
      this.cart.setItem(this.product.key, this.ordered);
    }
  }
}
