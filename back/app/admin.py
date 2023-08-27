from django.contrib import admin
from app.models import Brand, Cart, CartItem, Order, OrderItem, Product, ProductVariant, UserProfile
# Register your models here.

admin.site.register(Product)
admin.site.register(ProductVariant)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Brand)
admin.site.register(UserProfile)
# admin.site.register(Order)
# admin.site.register(OrderItem)
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

# class OrderAdmin(admin.ModelAdmin):
#     list_display = ('id', 'user', 'created_at', 'total_price', 'payment_id', 'status')
#     list_filter = ('user', 'created_at', 'status')
#     search_fields = ('id', 'user__username', 'payment_id', 'status')
#     inlines = [OrderItemInline]

# admin.site.register(Order, OrderAdmin)

class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user', 'created_at', 'total_price', 'payment_id', 'status',
        'user_address', 'user_city', 'user_phone', 'user_name'
    )
    list_filter = ('user', 'created_at', 'status')
    search_fields = ('id', 'user__username', 'payment_id', 'status','user_address', 'user_city', 'user_phone', 'user_name')
    inlines = [OrderItemInline]

    def user_address(self, obj):
        return obj.user.userprofile.address
    user_address.short_description = 'Address'

    def user_phone(self, obj):
        return obj.user.userprofile.phone
    user_phone.short_description = 'Phone'

    def user_city(self, obj):
        return obj.user.userprofile.city
    user_city.short_description = 'City'

    def user_name(self, obj):
        return obj.user.userprofile.first_name + ' ' + obj.user.userprofile.last_name
    user_name.short_description = 'Name'

admin.site.register(Order, OrderAdmin)