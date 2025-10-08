# File: main/urls.py
from django.urls import path
from main.views import (
    show_main, create_product, show_product, show_xml, show_json,
    show_xml_by_id, show_json_by_id, register, login_user, logout_user,
    edit_product, delete_product,
    # new ajax views
    add_product_ajax, update_product_ajax, delete_product_ajax,
    ajax_register, ajax_login, ajax_logout
)

app_name = 'main'

urlpatterns = [
    path('', show_main, name='show_main'),
    path('create-product/', create_product, name='create_product'),
    path('product/<str:id>/', show_product, name='show_product'),

    # XML endpoints
    path('xml/', show_xml, name='show_xml'),
    path('xml/<str:product_id>/', show_xml_by_id, name='show_xml_by_id'),

    # list endpoint
    path('json/', show_json, name='show_json'),

    # --- AJAX endpoints for products (declare BEFORE the catch-all json/<uuid:...>/ ) ---
    path('json/create/', add_product_ajax, name='add_product_ajax'),
    path('json/<uuid:product_id>/update/', update_product_ajax, name='update_product_ajax'),
    path('json/<uuid:product_id>/delete/', delete_product_ajax, name='delete_product_ajax'),

    # JSON by id (use uuid converter so only valid UUIDs match)
    path('json/<uuid:product_id>/', show_json_by_id, name='show_json_by_id'),

    # AJAX auth
    path('ajax/register/', ajax_register, name='ajax_register'),
    path('ajax/login/', ajax_login, name='ajax_login'),
    path('ajax/logout/', ajax_logout, name='ajax_logout'),

    # regular auth / edit / delete pages
    path('register/', register, name='register'),
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),
    path('product/<uuid:id>/edit', edit_product, name='edit_product'),
    path('product/<uuid:id>/delete', delete_product, name='delete_product'),
]
