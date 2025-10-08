import datetime
from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.shortcuts import render, redirect, get_object_or_404
from main.forms import ProductForm
from main.models import Product
from django.http import HttpResponse
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.utils.html import strip_tags
from django.http import HttpResponse, JsonResponse
import json
from datetime import datetime

def _format_datetime_attr(obj, attr_name):
    """Return isoformat string if obj has attr_name and it's datetime-like, else None."""
    val = getattr(obj, attr_name, None)
    if val is None:
        return None
    try:
        return val.isoformat()
    except Exception:
        return str(val)
    
@login_required(login_url='/login')
def show_main(request):
    filter_type = request.GET.get("filter", "all")  # default 'all'
    if filter_type == "all":
        product_list = Product.objects.all().order_by('-is_featured', '-id')
    else:
        product_list = Product.objects.filter(user=request.user).order_by('-is_featured', '-id')
    
    context = {
        'npm': '2406346011',
        'name': request.user.username,
        'class': 'PBP B',
        'product_list': product_list,
        'last_login': request.COOKIES.get('last_login', 'Never')
        }
    return render(request, "main.html",context)

@login_required(login_url='/login')
def create_product(request):
    form = ProductForm(request.POST or None)

    if form.is_valid() and request.method == 'POST':
        product_entry = form.save(commit = False)
        product_entry.user = request.user
        product_entry.save()
        return redirect('main:show_main')

    context = {
        'form': form
    }
    return render(request, "create_product.html", context)

@login_required(login_url='/login')
def show_product(request, id):
    product = get_object_or_404(Product, pk=id)

    context = {
        'product': product
    }

    return render(request, "product_detail.html", context)

def show_xml(request):
     product_list = Product.objects.all()
     xml_data = serializers.serialize("xml", product_list)
     return HttpResponse(xml_data, content_type="application/xml")

def show_json(request):
    """
    Return list of products as JSON.
    Safe: will not assume presence of 'created_at' field.
    Featured products are placed first; fallback ordering by id (newer id = newer).
    """
    # gunakan ordering yang pasti ada: is_featured (field ada) lalu -id (pk)
    qs = Product.objects.all().order_by('-is_featured', '-id')

    data = []
    for p in qs:
        # safe-get created value if exists
        created_val = None
        # try common names, but do not crash if none exist
        for attr in ('created_at', 'created', 'created_on', 'timestamp', 'date_created'):
            if hasattr(p, attr):
                val = getattr(p, attr)
                # if datetime-like, convert to isoformat; else str()
                try:
                    created_val = val.isoformat() if val is not None else None
                except Exception:
                    created_val = str(val) if val is not None else None
                break

        data.append({
            'id': str(p.id),
            'name': p.name,
            'description': p.description,
            'price': p.price,
            'stock': p.stock,
            'thumbnail': p.thumbnail,
            'category': p.category,
            'is_featured': bool(p.is_featured),
            'user_id': p.user_id if hasattr(p, 'user_id') else (p.user.id if getattr(p, 'user', None) else None),
            'created_at': created_val,
        })
    return JsonResponse(data, safe=False)

def show_xml_by_id(request, product_id):
   try:
       product_item = Product.objects.filter(pk=product_id)
       xml_data = serializers.serialize("xml", product_item)
       return HttpResponse(xml_data, content_type="application/xml")
   except Product.DoesNotExist:
       return HttpResponse(status=404)

def show_json_by_id(request, product_id):
   try:
       product_item = Product.objects.get(pk=product_id)
       json_data = serializers.serialize("json", [product_item])
       return HttpResponse(json_data, content_type="application/json")
   except Product.DoesNotExist:
       return HttpResponse(status=404)
   
def register(request):
    form = UserCreationForm()

    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your account has been successfully created!')
            return redirect('main:login')
    context = {'form':form}
    return render(request, 'register.html', context)

def login_user(request):
   if request.method == 'POST':
      form = AuthenticationForm(data=request.POST)
      if form.is_valid():
          user = form.get_user()
          login(request, user)
          response = HttpResponseRedirect(reverse("main:show_main"))
          response.set_cookie('last_login', str(datetime.datetime.now()))
          return response
   else:
      form = AuthenticationForm(request)
   context = {'form': form}
   return render(request, 'login.html', context)

def logout_user(request):
    logout(request)
    response = HttpResponseRedirect(reverse('main:login'))
    response.delete_cookie('last_login')
    return response

def edit_product(request, id):
    product = get_object_or_404(Product, pk=id)
    form = ProductForm(request.POST or None, instance=product)
    if form.is_valid() and request.method == 'POST':
        form.save()
        return redirect('main:show_main')

    context = {
        'form': form
    }
    return render(request, "edit_product.html", context)

def delete_product(request, id):
    product = get_object_or_404(Product, pk=id)
    product.delete()
    return HttpResponseRedirect(reverse('main:show_main'))

@require_POST
def add_product_ajax(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status':'error','detail':'Authentication required'}, status=401)

    try:
        if request.content_type and 'application/json' in request.content_type:
            payload = json.loads(request.body.decode() or '{}')
            get = lambda k, d='': payload.get(k, d)
        else:
            get = lambda k, d='': request.POST.get(k, d)

        name = strip_tags(get('name', '')).strip()
        price = int(get('price', 0) or 0)
        description = strip_tags(get('description', '')).strip()
        stock = int(get('stock', 0) or 0)
        thumbnail = get('thumbnail', '')
        category = get('category', '')
        is_featured = get('is_featured') in ('on','true','1')

        p = Product.objects.create(
            user=request.user,
            name=name,
            price=price,
            description=description,
            stock=stock,
            thumbnail=thumbnail,
            category=category,
            is_featured=is_featured
        )

        created_at_val = _format_datetime_attr(p, 'created_at')

        return JsonResponse({
            'status':'created',
            'product': {
                'id': str(p.id),
                'name': p.name,
                'description': p.description,
                'price': p.price,
                'stock': p.stock,
                'thumbnail': p.thumbnail,
                'category': p.category,
                'is_featured': p.is_featured,
                'user_id': getattr(p, 'user_id', (p.user.id if getattr(p, 'user', None) else None)),
                'created_at': created_at_val,
            }
        }, status=201)
    except Exception as e:
        return JsonResponse({'status':'error','detail': str(e)}, status=400)

    
@require_POST
def update_product_ajax(request, product_id):
    if not request.user.is_authenticated:
        return JsonResponse({'status':'error','detail':'Authentication required'}, status=401)

    try:
        p = Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        return JsonResponse({'status':'error','detail':'Not found'}, status=404)

    owner_id = getattr(p, 'user_id', (p.user.id if getattr(p, 'user', None) else None))
    if owner_id != request.user.id:
        return JsonResponse({'status':'error','detail':'Forbidden - not owner'}, status=403)

    try:
        if request.content_type and 'application/json' in request.content_type:
            payload = json.loads(request.body.decode() or '{}')
            get = lambda k, d=None: payload.get(k, d)
        else:
            get = lambda k, d=None: request.POST.get(k, d)

        p.name = strip_tags(get('name', p.name)).strip()
        p.price = int(get('price', p.price) or p.price)
        p.description = strip_tags(get('description', p.description)).strip()
        p.stock = int(get('stock', p.stock) or p.stock)
        p.thumbnail = get('thumbnail', p.thumbnail)
        p.category = get('category', p.category)
        p.is_featured = get('is_featured') in ('on','true','1')

        p.save()

        created_at_val = _format_datetime_attr(p, 'created_at')

        return JsonResponse({'status':'updated', 'product': {
            'id': str(p.id),
            'name': p.name,
            'description': p.description,
            'price': p.price,
            'stock': p.stock,
            'thumbnail': p.thumbnail,
            'category': p.category,
            'is_featured': p.is_featured,
            'user_id': owner_id,
            'created_at': created_at_val,
        }})
    except Exception as e:
        return JsonResponse({'status':'error','detail': str(e)}, status=400)



@require_POST
def delete_product_ajax(request, product_id):
    if not request.user.is_authenticated:
        return JsonResponse({'status':'error','detail':'Authentication required'}, status=401)

    try:
        p = Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        return JsonResponse({'status':'error','detail':'Not found'}, status=404)

    if p.user_id != request.user.id:
        return JsonResponse({'status':'error','detail':'Forbidden - not owner'}, status=403)

    try:
        p.delete()
        return JsonResponse({'status':'deleted','id': product_id})
    except Exception as e:
        return JsonResponse({'status':'error','detail': str(e)}, status=400)

# --- AJAX auth endpoints (register / login / logout) ---
@csrf_exempt
@require_POST
def ajax_register(request):
    """
    Receives form-data or JSON with username, password1, password2.
    Returns JSON success or errors.
    """
    data = {}
    try:
        # support both form-encoded and JSON
        if request.content_type and 'application/json' in request.content_type:
            payload = json.loads(request.body.decode() or '{}')
        else:
            payload = request.POST

        username = payload.get('username', '').strip()
        password1 = payload.get('password1', '')
        password2 = payload.get('password2', '')

        if not username or not password1:
            return JsonResponse({'status': 'error', 'detail': 'Username and password required'}, status=400)
        if password1 != password2:
            return JsonResponse({'status': 'error', 'detail': 'Passwords do not match'}, status=400)

        form = UserCreationForm({'username': username, 'password1': password1, 'password2': password2})
        if form.is_valid():
            user = form.save()
            return JsonResponse({'status': 'created', 'username': user.username})
        else:
            return JsonResponse({'status': 'error', 'detail': form.errors}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'detail': str(e)}, status=400)

@csrf_exempt
@require_POST
def ajax_login(request):
    try:
        if request.content_type and 'application/json' in request.content_type:
            payload = json.loads(request.body.decode() or '{}')
        else:
            payload = request.POST

        username = payload.get('username', '').strip()
        password = payload.get('password', '')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'status': 'ok', 'username': user.username})
        else:
            return JsonResponse({'status': 'error', 'detail': 'Invalid credentials'}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'detail': str(e)}, status=400)

@csrf_exempt
@require_POST
def ajax_logout(request):
    try:
        logout(request)
        return JsonResponse({'status': 'ok'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'detail': str(e)}, status=400)