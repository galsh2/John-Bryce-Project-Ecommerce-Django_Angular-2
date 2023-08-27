import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = []; // This will hold the filtered products
  searchText: string = ''; // This will hold the search text

  filterByCategory: boolean = false; // Flag to filter by category
  filterByBrand: boolean = false;   // Flag to filter by brand
  uniqueBrands: string[] = [];
  uniqueCategories: string[] = [];
  selectedBrand: string = '';
  selectedCategory: string = '';


  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = products; // Initially, display all products
      
      // console.log(products);

      this.uniqueBrands = [...new Set(products.map(product => product.brand))];
      this.uniqueCategories = [...new Set(products.map(product => product.category_type))];
    });
  }

  ngOnChanges(): void {
    this.filterProducts();
  }

filterProducts(): void {
  if (!this.searchText) {
    this.filteredProducts = this.products;
    return;
  }

  this.filteredProducts = this.products.filter(product => {
    const productName = product.name ? product.name.toLowerCase() : '';
    const productDesc = product.desc ? product.desc.toLowerCase() : '';

    return productName.includes(this.searchText.toLowerCase()) || 
           productDesc.includes(this.searchText.toLowerCase());
  });
}

  addToCart(product:any): void {
    this.cartService.addToCart(product);
  }


    // Open the filter modal
    openFilterModal(): void {
      const modal = document.getElementById('filterModal');
      if (modal) modal.style.display = 'block';
    }
  
    // Close the filter modal
    closeFilterModal(): void {
      const modal = document.getElementById('filterModal');
      if (modal) modal.style.display = 'none';
    }
  
    // Apply filters based on the selections
    applyFilters(): void {
      this.filteredProducts = this.products;
  
      if (this.selectedBrand) {
        this.filteredProducts = this.filteredProducts.filter(product => product.brand === this.selectedBrand);
      }
  
      if (this.selectedCategory) {
        this.filteredProducts = this.filteredProducts.filter(product => product.category_type === this.selectedCategory);
      }
  
      this.closeFilterModal();
    }
}