from django.db import models
from django.forms import ValidationError
from django.contrib.auth.models import User
# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username

class Brand(models.Model):  #new
    name = models.CharField(max_length=55)

    def __str__(self):
        return self.name

class Product(models.Model):
    PRODUCT_TYPES = (
        ('SH', 'Shoes'),
        ('SHI', 'Shirt'),
        ('PA', 'Pants'),
    )
    Category_TYPES = (   
        ('Men', 'Men'),
        ('Womens', 'Womens'),
        ('Unisex', 'Unisex'),
    )

    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    product_type = models.CharField(max_length=3, choices=PRODUCT_TYPES)
    category_type = models.CharField(max_length=6, choices=Category_TYPES)
    product_picture = models.ImageField(upload_to='product_pictures/', blank=True, null=True)
    brand = models.ForeignKey('Brand', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}"

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    size = models.CharField(max_length=10)
    stock = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product.name} - Size: {self.size}, Stock: {self.stock}"
    
    def save(self, *args, **kwargs): #new
        if ProductVariant.objects.filter(product=self.product, size=self.size).exists():
            raise ValidationError("Variant with this size already exists.")
        super().save(*args, **kwargs)

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.user}'s cart"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    img = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
    
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    payment_id = models.CharField(max_length=255, unique=True)

    # New field for order status
    ORDER_STATUS_CHOICES = (
        ('P', 'Pending'),
        ('C', 'Confirmed'),
        ('S', 'Shipped'),
        ('D', 'Delivered'),
        ('X', 'Cancelled'),
    )
    status = models.CharField(max_length=1, choices=ORDER_STATUS_CHOICES, default='P')

    def __str__(self):
        return f"Order {self.id} by {self.user}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # price at the time of purchase

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
    

class Review(models.Model):
    RATING_CHOICES = (
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    )
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=RATING_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Review for {self.product.name} by {self.user.username}"
