# File: main/urls.py
from django.urls import path
from main.views import (
    show_main, create_product, show_product, show_xml, show_json,
    show_xml_by_id, show_json_by_id, register, login_user, logout_user,
    edit_product, delete_product, add_product_ajax, update_product_ajax, delete_product_ajax,
    ajax_register, ajax_login, ajax_logout, proxy_image, create_news_flutter, proxy_image, my_products_json
)

app_name = 'main'

urlpatterns = [
    path('', show_main, name='show_main'),
    path('create-product/', create_product, name='create_product'),
    path('product/<str:id>/', show_product, name='show_product'),
    path('xml/', show_xml, name='show_xml'),
    path('xml/<str:product_id>/', show_xml_by_id, name='show_xml_by_id'),
    path('json/', show_json, name='show_json'),
    path('json/create/', add_product_ajax, name='add_product_ajax'),
    path('json/<uuid:product_id>/update/', update_product_ajax, name='update_product_ajax'),
    path('json/<uuid:product_id>/delete/', delete_product_ajax, name='delete_product_ajax'),
    path('json/<uuid:product_id>/', show_json_by_id, name='show_json_by_id'),
    path('ajax/register/', ajax_register, name='ajax_register'),
    path('ajax/login/', ajax_login, name='ajax_login'),
    path('ajax/logout/', ajax_logout, name='ajax_logout'),
    path('register/', register, name='register'),
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),
    path('product/<uuid:id>/edit', edit_product, name='edit_product'),
    path('product/<uuid:id>/delete', delete_product, name='delete_product'),
    path('proxy-image/', proxy_image, name='proxy_image'),
    path('create-flutter/', create_news_flutter, name='create_news_flutter'),
    path('json/my-products/', my_products_json, name='my_products_json'),
    path('proxy_image/', proxy_image, name='proxy_image'),
]
