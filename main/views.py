from django.shortcuts import render

# Create your views here.
def show_main(request):
    context = {
        'npm' : '2406346011',
        'name': 'Bryan Christopher Kurniadi',
        'class': 'PBP B'
    }

    return render(request, "main.html", context)
