from django.db import IntegrityError
from django.http import Http404
from django.shortcuts import get_object_or_404, render

# Create your views here.

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from app.models import Cart, CartItem, Order, OrderItem, Product, Review, UserProfile
from app.serializers import CartSerializer, ProductSerializer, ReviewSerializer, UserProfileSerializer

############################################################# register #########################################################
# {   "username" : " ", "password" : " ", "email" : " "}

from django.contrib.auth.models import User
from rest_framework import status


class RegistrationAPIView(APIView):
    def post(self, request):
        # Extract the required data from the request
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        # Perform validation on the input data
        if not username or not email or not password:
            return Response({'error': 'Please provide all the required fields.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the email is already taken
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new user
        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            # Create a new cart for the user
            # cart = Cart.objects.create(user=user)
        except IntegrityError:
            return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        # Return a success responset
        return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)

################################################################### login ################################################################



# class ObtainTokenPairView(TokenObtainPairView):
#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         user = serializer.validated_data['user']
#         token = serializer.validated_data

#         return Response({
#             'user': user.username,
#             'access_token': token['access'],
#             'refresh_token': token['refresh']
#         })

class ObtainTokenPairWithUsernameView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user  # use serializer.user instead
        # print(serializer.validated_data['access'])

        return Response({
            'username': user.username,
            'id': user.id,
            'access': str(serializer.validated_data['access']),
            'refresh': str(serializer.validated_data['refresh']),
        })

class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=200)
        except Exception as e:
            return Response(status=400)
############################################################# profile #############################################################
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET','POST','PUT'])
@permission_classes([IsAuthenticated])
def create_user_profile(request):
    if request.method == 'GET':
        # user_profiles = UserProfileSerializer.objects.filter(user=request.user)
        user_profiles = UserProfile.objects.filter(user=request.user)
        serializer = UserProfileSerializer(user_profiles, many=True)
        # print(serializer.data)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            # Set the user to the currently authenticated user
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    elif request.method == 'PUT':
        try:
            # Assuming there's only one profile per user
            user_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=400)

        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()  # No need to save the user here since we're updating
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

############################################################# product #############################################################

class ProductAPIView(APIView):
    # permission_classes = (IsAuthenticated,)
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        # print(serializer.data)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

############################################################# cart #############################################################

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import JsonResponse

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_cart(request):
    user = request.user
    cart, created = Cart.objects.get_or_create(user=user)

    # Clear existing items for this cart.
    cart.cartitem_set.all().delete()

    # Add new items.
    for item_data in request.data:
        product = Product.objects.get(id=item_data['id'])
        quantity = item_data['quantity']
        img = item_data['img']
        CartItem.objects.create(cart=cart, product=product, quantity=quantity, img=img)
    
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def load_cart(request):
    user = request.user

    # This line will get the cart if it exists or create one if it doesn't.
    cart, created = Cart.objects.get_or_create(user=user)

    # Serialize the cart
    serializer = CartSerializer(cart)

    # Prepare the response data
    response_data = []

    # Loop through all items in the cart and extract the required information
    for item in serializer.data["items"]:
        product_info = item["product"]
        response_data.append({
            "id": product_info["id"],
            "name": product_info["name"],
            "price": product_info["price"],
            "quantity": item["quantity"],
            "img" : item['img']
        })
    print(response_data)
    return Response(response_data)

################################################### order ################################################# 
from django.shortcuts import get_object_or_404

# {
#   "cart_items": [
#     {
#       "product_id": 1,
#       "quantity": 1
#     },
#     {
#       "product_id": 2,
#       "quantity": 3
#     }
#   ]
# }

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_order(request):
    user = request.user
    cart = get_object_or_404(Cart, user=user)

    # Get the payment_id from the request
    payment_id = request.data.get('payment_id')
    # Create a new order for the user with the payment_id
    order = Order.objects.create(user=user, payment_id=payment_id)

    # # Create a new order for the user
    # order = Order.objects.create(user=user)

    # Copy items from cart to order
    total_price = 0
    for cart_item in cart.cartitem_set.all():
        price = cart_item.product.price  
        total_price += price * cart_item.quantity
        OrderItem.objects.create(
            order=order, 
            product=cart_item.product, 
            quantity=cart_item.quantity, 
            price=price
        )
    order.total_price = total_price
    order.save()

    # Clear the cart after order is placed
    cart.cartitem_set.all().delete()

    return Response({"message": "Order generated successfully!", "order_id": order.id})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_orders(request):
    user = request.user
    
    # Query all orders for the user
    orders = Order.objects.filter(user=user)

    # Serialize the orders into a JSON response (a simple example)
    orders_data = []
    for order in orders:
        order_items = OrderItem.objects.filter(order=order)
        
        items_data = []
        for item in order_items:
            items_data.append({
                "product_name": item.product.name,
                "quantity": item.quantity,
                "price": str(item.price)
            })

        orders_data.append({
            "order_id": order.id,
            "created_at": order.created_at.strftime('%Y-%m-%d %H:%M:%S'), 
            "total_price": str(order.total_price),
            "items": items_data
        })
    # print(orders_data)
    return Response(orders_data)


################################################### review ################################################# 


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def reviews(request, review_id=None):
    if request.method == 'GET':
        reviews = Review.objects.filter(user=request.user)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    elif request.method == 'PUT':
        try:
            review = Review.objects.get(id=review_id, user=request.user)
        except Review.DoesNotExist:
            return Response(status=404)

        serializer = ReviewSerializer(review, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        try:
            review = Review.objects.get(id=review_id, user=request.user)
        except Review.DoesNotExist:
            return Response(status=404)

        review.delete()
        return Response(status=204)
